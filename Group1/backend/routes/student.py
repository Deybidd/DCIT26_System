from fastapi import APIRouter
from database import students_collection
from models import Student

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/register")
def register_student(student: Student):
    students_collection.insert_one(student.dict())
    return {"message": "Student registered successfully"}

@router.post("/login")
def login_student(data: dict):
    student = students_collection.find_one({
        "email": data["email"],
        "password": data["password"]
    })
    if student:
        return {"message": "Login successful"}
    return {"message": "Invalid credentials"}

@router.get("/test")
def test_db():
    students_collection.insert_one({
        "name": "Test User",
        "email": "test@gmail.com",
        "password": "123"
    })
    return {"message": "Database and collection created"}

