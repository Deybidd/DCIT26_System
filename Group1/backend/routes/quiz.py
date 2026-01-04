from fastapi import APIRouter
from database import quizzes_collection
from models import Quiz

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.post("/create")
def create_quiz(quiz: Quiz):
    quizzes_collection.insert_one(quiz.dict())
    return {"message": "Quiz created"}

@router.get("/")
def get_quizzes():
    quizzes = list(quizzes_collection.find({}, {"_id": 0}))
    return quizzes
