from fastapi import APIRouter, HTTPException
from database import students_collection, subjects_collection
from models import Student

router = APIRouter(prefix="/students", tags=["Students"])

# Register Student
@router.post("/register")
def register_student(student: Student):
    existing = students_collection.find_one({"email": student.email})
    if existing:
        return {"message": "Email already exists"}
    
    students_collection.insert_one(student.dict())
    return {"message": "Student registered successfully"}

# Login Student
@router.post("/login")
def login_student(data: dict):
    student = students_collection.find_one({
        "email": data["email"],
        "password": data["password"]
    })
    if student:
        return {"message": "Login successful"}
    return {"message": "Invalid credentials"}

# Get quizzes for enrolled subjects
@router.get("/quizzes")
def get_student_quizzes(student_email: str):
    """
    Returns all quizzes for subjects the student is enrolled in.
    """
    # Find subjects the student is enrolled in
    enrolled_subjects = list(subjects_collection.find(
        {"students": student_email},
        {"_id": 0, "code": 1}
    ))
    enrolled_codes = [s["code"] for s in enrolled_subjects]

    # Find quizzes for those subjects
    from database import quizzes_collection
    quizzes = list(quizzes_collection.find(
        {"subject_code": {"$in": enrolled_codes}},
        {"_id": 0}
    ))

    return quizzes
