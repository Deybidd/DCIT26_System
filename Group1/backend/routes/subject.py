from fastapi import APIRouter
from database import subjects_collection
from models import Subject

router = APIRouter(prefix="/subjects", tags=["Subjects"])

@router.post("/create")
def create_subject(subject: Subject):
    subjects_collection.insert_one(subject.dict())
    return {"message": "Subject created"}

@router.get("/")
def get_subjects():
    subjects = list(subjects_collection.find({}, {"_id": 0}))
    return subjects
