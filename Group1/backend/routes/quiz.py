from fastapi import APIRouter, HTTPException
from database import quizzes_collection, subjects_collection
from models import Quiz, InstructorSubjects
import uuid

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

# Create a new quiz
@router.post("/instructors")
def create_quiz(quiz: Quiz):
    # Assign a unique id if not provided
    quiz_dict = quiz.dict()
    if not quiz_dict.get("id"):
        quiz_dict["id"] = uuid.uuid4().hex

    # Ensure subject exists
    subject = subjects_collection.find_one({"code": quiz.subject_code})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    quizzes_collection.insert_one(quiz_dict)
    return {"message": "Quiz published successfully", "quiz_id": quiz_dict["id"]}


# Get all quizzes for an instructor (only quizzes of their subjects)
@router.get("/instructors")
def get_instructor_quizzes(instructor_email: str):
    subjects = list(subjects_collection.find({"instructor_email": instructor_email}, {"code": 1, "_id": 0}))
    subject_codes = [s["code"] for s in subjects]

    quizzes = list(quizzes_collection.find({"subject_code": {"$in": subject_codes}}, {"_id": 0}))
    return quizzes


# Get all quizzes for a student (only quizzes for subjects they're enrolled in)
@router.get("/students")
def get_student_quizzes(student_email: str):
    # Find subjects where student is enrolled
    subjects = list(subjects_collection.find({"students": student_email}, {"code": 1, "name": 1, "_id": 0}))
    subject_codes = [s["code"] for s in subjects]

    quizzes = list(quizzes_collection.find({"subject_code": {"$in": subject_codes}}, {"_id": 0}))
    return quizzes


# Optional: get single quiz
@router.get("/{quiz_id}")
def get_quiz(quiz_id: str):
    quiz = quizzes_collection.find_one({"id": quiz_id}, {"_id": 0})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz
