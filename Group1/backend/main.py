from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import subject, student, quiz, instructor  # your routers

app = FastAPI()

# Allow requests from frontend
origins = [
    "http://localhost:5173",  # your Vite frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],        # allow GET, POST, PUT, DELETE
    allow_headers=["*"],        # allow all headers
)

# Include your routers
app.include_router(subject.router)  
app.include_router(student.router)
app.include_router(quiz.router)
app.include_router(instructor.router)
