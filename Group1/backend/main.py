from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import student, subject, quiz, instructor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student.router)
app.include_router(subject.router)
app.include_router(subject.router)
app.include_router(quiz.router)
app.include_router(instructor.router)
