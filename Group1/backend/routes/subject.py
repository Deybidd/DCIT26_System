from fastapi import APIRouter, HTTPException
from database import subjects_collection
from models import InstructorSubjects
import uuid

router = APIRouter(prefix="/subjects", tags=["Subjects"])

# Create subject
@router.post("/")
def create_subject(subject: InstructorSubjects):
    subject_dict = subject.dict()
    if not subject_dict.get("id"):
        subject_dict["id"] = uuid.uuid4().hex
    if "students" not in subject_dict or subject_dict["students"] is None:
        subject_dict["students"] = []
    subjects_collection.insert_one(subject_dict)
    return {"message": "Subject created", "subject_id": subject_dict["id"]}

# Get subjects
@router.get("/")
def get_subjects(instructorEmail: str = None):
    query = {}
    if instructorEmail:
        query["instructor_email"] = instructorEmail
    subjects = list(subjects_collection.find(query, {"_id": 0}))
    return subjects

# Update subject
@router.put("/{subject_id}")
def update_subject(subject_id: str, updated_subject: InstructorSubjects):
    result = subjects_collection.update_one(
        {"id": subject_id},
        {"$set": {
            "name": updated_subject.name,
            "code": updated_subject.code,
            "description": updated_subject.description,
            "number_of_students": updated_subject.number_of_students
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"message": "Subject updated"}

# Delete subject
@router.delete("/{subject_id}")
def delete_subject(subject_id: str):
    result = subjects_collection.delete_one({"id": subject_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"message": "Subject deleted"}

# Enroll student
@router.put("/enroll/{subject_id}")
def enroll_student(subject_id: str, student: dict):
    subject = subjects_collection.find_one({"id": subject_id})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    students = subject.get("students", [])
    if student["student_email"] in students:
        return {"message": "Already enrolled"}

    if len(students) >= 60:
        raise HTTPException(status_code=400, detail="Subject is full")

    students.append(student["student_email"])
    subjects_collection.update_one(
        {"id": subject_id},
        {"$set": {"students": students, "number_of_students": len(students)}}
    )
    return {"message": "Enrolled successfully"}

# Unenroll student
@router.put("/unenroll/{subject_id}")
def unenroll_student(subject_id: str, student: dict):
    subject = subjects_collection.find_one({"id": subject_id})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    students = subject.get("students", [])
    if student["student_email"] not in students:
        raise HTTPException(status_code=400, detail="You are not enrolled in this subject")

    students.remove(student["student_email"])
    subjects_collection.update_one(
        {"id": subject_id},
        {"$set": {"students": students, "number_of_students": len(students)}}
    )
    return {"message": "Successfully unenrolled"}
