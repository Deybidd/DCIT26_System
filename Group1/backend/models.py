from pydantic import BaseModel
from typing import List, Optional

class Student(BaseModel):
    studentNumber: str
    firstName: str
    middleName: Optional[str] = None
    lastName: str
    birthdate: str
    yearSection: str
    email: str
    password: str

class Instructor(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    course: str
    email: str
    password: str

class Subject(BaseModel):
    subject_code: str
    subject_name: str
    instructor: str
    students: List[str] = []

class Question(BaseModel):
    question: str
    choices: List[str]
    answer: str

class Quiz(BaseModel):
    subject_code: str
    title: str
    description: str
    deadline: str
    questions: List[Question]
