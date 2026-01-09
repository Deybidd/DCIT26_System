from fastapi import APIRouter, HTTPException
import traceback
from database import quizzes_collection, subjects_collection, instructors_collection, student_quiz_responses_collection
from models import QuizCreate
from datetime import datetime
import uuid
from bson import ObjectId
import copy


router = APIRouter(prefix="/quizzes", tags=["Quizzes"])



# -------------------------
# CREATE QUIZ
# -------------------------
@router.post("/")
def create_quiz(quiz: QuizCreate):
    instructor = instructors_collection.find_one({"email": quiz.instructor_email})
    if not instructor:
        raise HTTPException(404, "Instructor not found")

    quiz_id = str(uuid.uuid4())

    quizzes_collection.insert_one({
        "id": quiz_id,
        "subject_code": quiz.subject_code,
        "title": quiz.title,
        "description": quiz.description,
        "deadline": quiz.deadline,
        "questions": [{
            "question": q.question,
            "choices": q.choices,
            "answer": q.answer,
            "type": q.type,
        } for q in quiz.questions],
        "timer_minutes": quiz.timer_minutes,
        "created_by": f"{instructor['first_name']} {instructor['last_name']}",
        "created_at": datetime.utcnow(),
        "graded": False,
        "average_score": 0,
        "max_tab_switches": quiz.max_tab_switches,
        "max_attempts": quiz.max_attempts,
    })

    return {"quiz_id": quiz_id}

# -------------------------
# GET QUIZZES FOR INSTRUCTOR
# -------------------------
@router.get("/instructors")
def get_instructor_quizzes(instructor_email: str):
    subjects = list(subjects_collection.find(
        {"instructor_email": instructor_email}, {"code": 1, "_id": 0}
    ))
    if not subjects:
        return []

    subject_codes = [s["code"] for s in subjects]
    quizzes_cursor = quizzes_collection.find({"subject_code": {"$in": subject_codes}})
    quizzes = []

    for q in quizzes_cursor:
        q["id"] = q.get("id") or str(q["_id"])
        q.pop("_id", None)
        # Remove answers from questions
        for question in q.get("questions", []):
            question.pop("answer", None)
        quizzes.append(q)
    return quizzes



def find_quiz(quiz_id: str):
    quiz = quizzes_collection.find_one({"id": quiz_id})
    if not quiz:
        try:
            quiz = quizzes_collection.find_one({"_id": ObjectId(quiz_id)})
        except:
            return None

    return copy.deepcopy(quiz)  # 🚨 CRITICAL

# -------------------------
# GET SINGLE QUIZ
# -------------------------
@router.get("/{quiz_id}")
def get_quiz(quiz_id: str):
    quiz = find_quiz(quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    quiz["id"] = quiz.get("id") or str(quiz["_id"])
    quiz.pop("_id", None)

    for q in quiz["questions"]:
        q.pop("answer", None)

    return quiz

@router.get("/edit/{quiz_id}")
def get_quiz_for_edit(quiz_id: str):
    quiz = find_quiz(quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    quiz["id"] = quiz.get("id") or str(quiz["_id"])
    quiz.pop("_id", None)

    # DO NOT REMOVE ANSWERS HERE
    return quiz


# -------------------------
# UPDATE QUIZ
# -------------------------
@router.put("/{quiz_id}")
def update_quiz(quiz_id: str, updated_quiz: dict):
    existing_quiz = quizzes_collection.find_one({"id": quiz_id})
    if not existing_quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Validate subject exists if updating subject_code
    if "subject_code" in updated_quiz:
        subject = subjects_collection.find_one({"code": updated_quiz["subject_code"]})
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")

    quizzes_collection.update_one({"id": quiz_id}, {"$set": updated_quiz})
    return {"message": "Quiz updated successfully"}


# -------------------------
# DELETE QUIZ
# -------------------------
@router.delete("/{quiz_id}")
def delete_quiz(quiz_id: str):
    result = quizzes_collection.delete_one({"id": quiz_id})
    if result.deleted_count == 0:
        try:
            result = quizzes_collection.delete_one({"_id": ObjectId(quiz_id)})
        except:
            raise HTTPException(status_code=404, detail="Quiz not found")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {"message": "Quiz deleted successfully"}


# -------------------------
# SUBMIT QUIZ (POST)
# -------------------------
@router.post("/submit/{quiz_id}")
def submit_quiz(quiz_id: str, submission: dict):
    from database import students_collection
    
    quiz = find_quiz(quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    student_email = submission["student_email"]

    attempts_used = student_quiz_responses_collection.count_documents({
        "quiz_id": quiz_id,
        "student_email": student_email
    })

    max_attempts = quiz.get("max_attempts")

    # ❗ HARD BLOCK AFTER LIMIT
    if max_attempts is not None and attempts_used >= max_attempts:
        raise HTTPException(
            status_code=403,
            detail=f"Maximum attempts ({max_attempts}) reached"
        )

    # Fetch student details from database
    student = students_collection.find_one({"email": student_email})
    if student:
        first_name = student.get('firstName', '')
        middle_name = student.get('middleName', '')
        last_name = student.get('lastName', '')
        student_name = f"{first_name} {middle_name} {last_name}".strip()
        year_section = student.get('yearSection', '')
    else:
        student_name = student_email
        year_section = ""

    # Calculate score immediately upon submission
    correct_count = sum(
        1 for q, a in zip(quiz["questions"], submission["answers"]) 
        if q.get("answer") == a.get("answer")
    )
    total_questions = len(quiz["questions"])
    percentage = int((correct_count / total_questions) * 100) if total_questions > 0 else 0

    student_quiz_responses_collection.insert_one({
        "quiz_id": quiz_id,
        "student_email": student_email,
        "student_name": student_name,
        "yearSection": year_section,
        "answers": submission["answers"],
        "submitted_at": datetime.utcnow(),
        "tab_switch_count": submission.get("tab_switch_count", 0),
        "score": correct_count,
        "percentage": percentage,
        "graded": False,
        "needs_grading": True,
        "released": False
    })

    return {"message": "Quiz submitted successfully", "score": correct_count, "percentage": percentage}


# -------------------------
# GET STUDENT RESPONSES
# -------------------------
@router.get("/responses")
def get_student_responses(quiz_id: str, student_email: str):
    responses = list(student_quiz_responses_collection.find({
        "quiz_id": quiz_id,
        "student_email": student_email
    }))

    for r in responses:
        r["_id"] = str(r["_id"])
        if "submitted_at" in r:
            r["submitted_at"] = r["submitted_at"].isoformat()
        else:
            r["submitted_at"] = None

    return responses


@router.get("/student/{student_email}/missed")
def get_missed_quizzes(student_email: str):
    """Get all quizzes that student hasn't submitted yet"""
    # Get all quizzes with questions included
    all_quizzes = list(quizzes_collection.find({}, {"id": 1, "title": 1, "subject_code": 1, "deadline": 1, "questions": 1}))
    
    # Get quizzes student has attempted
    attempted_quiz_ids = list(student_quiz_responses_collection.distinct(
        "quiz_id",
        {"student_email": student_email}
    ))
    
    # Filter missed quizzes
    missed = [q for q in all_quizzes if q["id"] not in attempted_quiz_ids]
    
    for q in missed:
        q["_id"] = str(q["_id"])
    
    return {"missed_quizzes": missed, "count": len(missed)}


@router.get("/student/{student_email}/performance")
def get_student_performance(student_email: str):
    """Calculate overall performance rate across all released quizzes"""
    responses = list(student_quiz_responses_collection.find({
        "student_email": student_email,
        "released": True  # Only count released responses
    }))
    
    if not responses:
        return {
            "overall_percentage": 0,
            "total_quizzes_taken": 0,
            "total_score": 0,
            "quiz_details": []
        }
    
    total_percentage = sum(r.get("percentage", 0) for r in responses)
    average_percentage = int(total_percentage / len(responses)) if responses else 0
    total_score = sum(r.get("score", 0) for r in responses)
    
    return {
        "overall_percentage": average_percentage,
        "total_quizzes_taken": len(responses),
        "total_score": total_score,
        "quiz_details": [
            {
                "quiz_id": r["quiz_id"],
                "percentage": r.get("percentage", 0),
                "score": r.get("score", 0),
                "submitted_at": r.get("submitted_at").isoformat() if r.get("submitted_at") else None
            }
            for r in responses
        ]
    }


@router.get("/attempts/check")
def check_attempts(quiz_id: str, student_email: str):
    quiz = find_quiz(quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    attempts_used = student_quiz_responses_collection.count_documents({
        "quiz_id": quiz_id,
        "student_email": student_email
    })

    max_attempts = quiz.get("max_attempts")

    can_take = True
    if max_attempts is not None and attempts_used >= max_attempts:
        can_take = False

    return {
        "can_take": can_take,
        "attempts_used": attempts_used,
        "max_attempts": max_attempts
    }



@router.get("/responses/count/{quiz_id}")
def get_quiz_responses_count(quiz_id: str):
    quiz = find_quiz(quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    responses = list(student_quiz_responses_collection.find({"quiz_id": quiz_id}))
    response_details = []

    for r in responses:
        correct_count = sum(
            1 for q, a in zip(quiz["questions"], r["answers"]) if q["answer"] == a["answer"]
        )
        # Use yearSection if available, else "N/A"
        year_section = r.get("yearSection", "N/A")
        student_name = r.get("student_name", "Unknown")
        tab_switches = r.get("tab_switch_count", 0)
        
        # Only include score and percentage if the response has been released
        is_released = r.get("released", False)

        response_details.append({
            "student_email": r["student_email"],
            "student_name": student_name,
            "correct_count": correct_count,
            "yearSection": year_section,
            "tab_switches": tab_switches,
            "answers": r["answers"],
            "score": r.get("score", None) if is_released else None,
            "percentage": r.get("percentage", None) if is_released else None,
            "released": is_released,
            "submitted_at": r["submitted_at"].isoformat(),
        })

    return {
        "count": len(responses),
        "responses": response_details
    }


# -------------------------
# -------------------------
# RELEASE QUIZ SCORE
# -------------------------
@router.post("/release/{quiz_id}")
def release_quiz_score(quiz_id: str):
    quiz = find_quiz(quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    # Only get submissions that are NOT yet graded
    new_responses = list(student_quiz_responses_collection.find({
        "quiz_id": quiz_id,
        "needs_grading": True
    }))

    if not new_responses:
        return {"message": "No new attempts to grade"}

    # Mark all as graded and released (score already calculated at submission time)
    for r in new_responses:
        student_quiz_responses_collection.update_one(
            {"_id": r["_id"]},
            {"$set": {
                "graded": True,
                "needs_grading": False,
                "released": True
            }}
        )

    # Recalculate quiz average from ALL graded attempts
    graded_responses = list(student_quiz_responses_collection.find({
        "quiz_id": quiz_id,
        "graded": True
    }))

    if graded_responses:
        avg = int(sum(r.get("percentage", 0) for r in graded_responses) / len(graded_responses))
    else:
        avg = 0

    quizzes_collection.update_one(
        {"id": quiz_id},
        {"$set": {"graded": True, "average_score": avg}}
    )

    return {
        "message": "New attempts graded successfully",
        "average_score": avg
    }

@router.get("/{quiz_id}/needs-grading")
def quiz_needs_grading(quiz_id: str):
    count = student_quiz_responses_collection.count_documents({
        "quiz_id": quiz_id,
        "needs_grading": True
    })
    return { "needs_grading": count > 0 }

# -------------------------
# GET ALL STUDENT RESULTS FOR A QUIZ (For Instructors)
# -------------------------
@router.get("/{quiz_id}/results")
def get_quiz_results(quiz_id: str):
    try:
        print(f"[DEBUG] Fetching results for quiz: {quiz_id}")
        
        quiz = find_quiz(quiz_id)
        if not quiz:
            print(f"[ERROR] Quiz not found: {quiz_id}")
            raise HTTPException(404, "Quiz not found")

        print(f"[DEBUG] Found quiz: {quiz.get('title')}")
        
        # Query without projection first to see all fields
        responses = list(student_quiz_responses_collection.find(
            {"quiz_id": quiz_id}
        ))
        
        print(f"[DEBUG] Found {len(responses)} responses")

        # Import students_collection safely
        try:
            from database import students_collection
        except Exception as e:
            print(f"[ERROR] Failed to import students_collection: {e}")
            students_collection = None

        results = []
        for idx, response in enumerate(responses):
            try:
                print(f"[DEBUG] Processing response {idx}: {response.get('student_email')}")
                
                student_email = response.get("student_email", "")
                student_name = student_email

                # Safe student lookup - wrap in try/catch
                if students_collection and student_email:
                    try:
                        student = students_collection.find_one({"email": student_email})
                        if student:
                            student_name = f"{student.get('first_name', '')} {student.get('last_name', '')}".strip()
                    except Exception as e:
                        print(f"[WARN] Failed to lookup student {student_email}: {e}")

                # Handle submitted_at field
                submitted = response.get("submitted_at")
                if isinstance(submitted, datetime):
                    submitted_at = submitted.isoformat()
                elif isinstance(submitted, str):
                    submitted_at = submitted
                else:
                    submitted_at = None

                # Safely convert numeric fields
                score = response.get("score", 0)
                if score is None:
                    score = 0
                else:
                    try:
                        score = int(score)
                    except (ValueError, TypeError):
                        score = 0

                percentage = response.get("percentage", 0)
                if percentage is None:
                    percentage = 0
                else:
                    try:
                        percentage = int(percentage)
                    except (ValueError, TypeError):
                        percentage = 0

                tab_switches = response.get("tab_switch_count", 0)
                if tab_switches is None:
                    tab_switches = 0
                else:
                    try:
                        tab_switches = int(tab_switches)
                    except (ValueError, TypeError):
                        tab_switches = 0

                results.append({
                    "student_email": student_email,
                    "student_name": student_name,
                    "score": score,
                    "percentage": percentage,
                    "tab_switches": tab_switches,
                    "submitted_at": submitted_at,
                    "graded": bool(response.get("graded", False)),
                    "released": bool(response.get("released", False))
                })
            except Exception as e:
                print(f"[ERROR] Error processing response {idx}: {e}")
                traceback.print_exc()
                continue

        print(f"[DEBUG] Returning {len(results)} formatted results")
        
        return {
            "quiz_id": quiz_id,
            "quiz_title": quiz.get("title", "Untitled Quiz"),
            "results": results
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Exception in get_quiz_results: {e}")
        traceback.print_exc()
        raise HTTPException(500, f"Server error while fetching quiz results: {str(e)}")