from pydantic import BaseModel
from typing import List, Optional

# ----------------------------
# STUDENT MODEL
# ----------------------------
class Student(BaseModel):
    studentNumber: str
    firstName: str
    middleName: Optional[str] = None
    lastName: str
    birthdate: str
    yearSection: str
    email: str
    password: str

# ----------------------------
# INSTRUCTOR MODEL
# ----------------------------
class Instructor(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    course: str
    email: str
    password: str

# ----------------------------
# SINGLE SUBJECT MODEL (InstructorSubjects)
# ----------------------------
class InstructorSubjects(BaseModel):
    id: Optional[str] = None         # ID will be generated automatically
    name: str
    code: str
    description: Optional[str] = None
    number_of_students: int = 0
    instructor_email: str
    students: List[str] = []

# ----------------------------
# QUIZ MODELS
# ----------------------------
class Question(BaseModel):
    question: str
    choices: List[str] = []
    answer: str
    type: str

class Quiz(BaseModel):
    subject_code: str
    title: str
    description: str
    deadline: str
    questions: List[Question]
    created_by: str
    created_at_month: int
    created_at_year: int
    graded: bool = False
    average_score: float = 0
    timer_minutes: Optional[int] = None
    max_attempts: Optional[int] = None
    max_tab_switches: Optional[int] = None


class QuestionCreate(BaseModel):
    question: str
    choices: List[str] = []
    answer: str
    type: str   # "multiple_choice" | "identification"


class QuizCreate(BaseModel):
    title: str
    description: str
    deadline: str
    subject_code: str
    instructor_email: str
    questions: List[QuestionCreate]
    timer_minutes: Optional[int] = None
    max_attempts: Optional[int] = None
    max_tab_switches: Optional[int] = None
