from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.subject import router as subject_router
from routes.student import router as student_router
from routes.quiz import router as quiz_router
from routes.instructor import router as instructor_router

app = FastAPI()

# Allow requests from frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include your routers
app.include_router(subject_router)  
app.include_router(student_router)
app.include_router(quiz_router)
app.include_router(instructor_router)
