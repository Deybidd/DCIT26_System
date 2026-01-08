from fastapi import APIRouter, HTTPException
from database import quizzes_collection, subjects_collection
from models import Quiz
import uuid

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

# -------------------------
# CREATE QUIZ
# -------------------------
@router.post("/instructors")
def create_quiz(quiz: Quiz):
    quiz_dict = quiz.dict()
    if not quiz_dict.get("id"):
        quiz_dict["id"] = uuid.uuid4().hex  # Ensure unique ID
    # Ensure subject exists
    subject = subjects_collection.find_one({"code": quiz.subject_code})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    quizzes_collection.insert_one(quiz_dict)
    return {"message": "Quiz published successfully", "quiz_id": quiz_dict["id"]}

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
        # Ensure every quiz has 'id'
        if "id" not in q:
            q["id"] = str(q["_id"])
        q.pop("_id", None)  # Remove MongoDB _id
        quizzes.append(q)

    return quizzes

# -------------------------
# GET SINGLE QUIZ
# -------------------------
@router.get("/{quiz_id}")
def get_quiz(quiz_id: str):
    quiz = quizzes_collection.find_one({"id": quiz_id}, {"_id": 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

# -------------------------
# UPDATE QUIZ
# -------------------------
@router.put("/{quiz_id}")
def update_quiz(quiz_id: str, updated_quiz: Quiz):
    existing_quiz = quizzes_collection.find_one({"id": quiz_id})
    if not existing_quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    subject = subjects_collection.find_one({"code": updated_quiz.subject_code})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    update_data = updated_quiz.dict(exclude={"id"})
    quizzes_collection.update_one({"id": quiz_id}, {"$set": update_data})
    return {"message": "Quiz updated successfully"}

# -------------------------
# DELETE QUIZ
# -------------------------
@router.delete("/{quiz_id}")
def delete_quiz(quiz_id: str):
    result = quizzes_collection.delete_one({"id": quiz_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Quiz with id '{quiz_id}' not found")
    return {"message": "Quiz deleted successfully"}
