from fastapi import APIRouter, HTTPException
from database import students_collection, subjects_collection, quizzes_collection, student_quiz_responses_collection
from models import Student

router = APIRouter(prefix="/students", tags=["Students"])

# -------------------------
# REGISTER STUDENT
# -------------------------
@router.post("/register")
def register_student(student: Student):
    if students_collection.find_one({"email": student.email}):
        return {"message": "Email already exists"}
    if students_collection.find_one({"studentNumber": student.studentNumber}):
        return {"message": "Student number already exists"}
    
    students_collection.insert_one(student.dict())
    return {"message": "Student registered successfully"}

# -------------------------
# LOGIN STUDENT
# -------------------------
@router.post("/login")
def login_student(data: dict):
    student = students_collection.find_one({
        "email": data["email"],
        "password": data["password"]
    })
    if student:
        return {"message": "Login successful"}
    return {"message": "Invalid credentials"}

# -------------------------
# GET STUDENT QUIZZES
# -------------------------
@router.get("/quizzes")
def get_student_quizzes(student_email: str):
    """
    Returns quizzes for all subjects the student is enrolled in.
    student_email: the email of the student
    """
    # 1️⃣ Find the student
    student = students_collection.find_one({"email": student_email})
    if not student:
        return []

    student_number = student.get("studentNumber")
    if not student_number:
        return []

    # 2️⃣ Find all subjects the student is enrolled in
    enrolled_subjects = list(subjects_collection.find(
        {"students": student_number},
        {"_id": 0, "code": 1}  # Make sure the field here matches your DB
    ))
    enrolled_codes = [s["code"] for s in enrolled_subjects]

    if not enrolled_codes:
        return []

    # 3️⃣ Fetch all quizzes for these subjects
    quizzes = list(quizzes_collection.find(
        {"subject_code": {"$in": enrolled_codes}}
    ))

    # 4️⃣ Format quizzes to always include id and remove _id
    result = []
    for q in quizzes:
        if "id" not in q:
            q["id"] = str(q["_id"])
        q.pop("_id", None)
        result.append(q)

    return result

# -------------------------
# GET STUDENT QUIZ RESPONSES
# -------------------------
@router.get("/quiz-responses")
def get_student_quiz_responses(student_email: str):
    """
    Returns all quiz responses for a student with quiz details
    """
    responses = list(student_quiz_responses_collection.find({
        "student_email": student_email
    }))
    
    result = []
    for r in responses:
        # Get the quiz details to get title and total items
        quiz = quizzes_collection.find_one({"id": r["quiz_id"]})
        
        result.append({
            "_id": str(r["_id"]),
            "quiz_id": r["quiz_id"],
            "quiz_title": quiz["title"] if quiz else "Unknown Quiz",
            "score": r.get("score"),
            "percentage": r.get("percentage", 0),
            "submitted_at": r.get("submitted_at").isoformat() if r.get("submitted_at") else None,
            "released": r.get("graded", False),  # Use graded status as released
            "total_items": len(quiz["questions"]) if quiz else 0,
        })
    
    return result

# -------------------------
# GET STUDENT INFO
# -------------------------
@router.get("/me")
def get_student(email: str):
    student = students_collection.find_one({"email": email}, {"_id": 0, "password": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
