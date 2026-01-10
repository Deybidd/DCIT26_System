from fastapi import APIRouter, HTTPException
from database import subjects_collection, students_collection
from models import InstructorSubjects
import uuid

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.post("/")
def create_subject(subject: InstructorSubjects):
    subject_dict = subject.dict()
    if not subject_dict.get("id"):
        subject_dict["id"] = uuid.uuid4().hex
    if "students" not in subject_dict or subject_dict["students"] is None:
        subject_dict["students"] = []
    subjects_collection.insert_one(subject_dict)
    return {"message": "Subject created", "subject_id": subject_dict["id"]}

@router.get("/")
def get_subjects(instructorEmail: str = None):
    query = {}
    if instructorEmail:
        query["instructor_email"] = instructorEmail
    subjects = list(subjects_collection.find(query, {"_id": 0}))
    return subjects


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

    # Validate that the student exists
    student_id = student.get("student_id")
    if not student_id:
        raise HTTPException(status_code=400, detail="Student ID required")
    
    student_doc = students_collection.find_one({"studentNumber": student_id})
    if not student_doc:
        raise HTTPException(status_code=404, detail="Student not found")

    students = subject.get("students", [])
    if student_id in students:
        return {"message": "Already enrolled"}

    if len(students) >= 60:
        raise HTTPException(status_code=400, detail="Subject is full")

    students.append(student_id)
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

    # Validate that the student exists
    student_id = student.get("student_id")
    if not student_id:
        raise HTTPException(status_code=400, detail="Student ID required")
    
    student_doc = students_collection.find_one({"studentNumber": student_id})
    if not student_doc:
        raise HTTPException(status_code=404, detail="Student not found")

    students = subject.get("students", [])
    if student_id not in students:
        raise HTTPException(status_code=400, detail="You are not enrolled in this subject")

    # Remove the student ID
    students.remove(student_id)
    
    subjects_collection.update_one(
        {"id": subject_id},
        {"$set": {"students": students, "number_of_students": len(students)}}
    )
    return {"message": "Successfully unenrolled"}

## Get students enrolled in a subject
@router.get("/{subject_code}/students")
def get_students(subject_code: str):
    subject = subjects_collection.find_one({"code": subject_code}, {"_id": 0})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    enrolled_items = subject.get("students", [])
    students_details = []

    for item in enrolled_items:
        # Lookup by studentNumber first, then email
        student = students_collection.find_one({"studentNumber": item}, {"_id": 0, "password": 0})
        if not student:
            student = students_collection.find_one({"email": item}, {"_id": 0, "password": 0})
        if student:
            full_name = f"{student.get('firstName', '')} {student.get('middleName', '')} {student.get('lastName', '')}".strip()
            students_details.append({
                "name": full_name,
                "yearSection": student.get("yearSection", "-"),
                "email": student.get("email", "N/A"),
                "studentNumber": student.get("studentNumber", "N/A")
            })
    
    return students_details

