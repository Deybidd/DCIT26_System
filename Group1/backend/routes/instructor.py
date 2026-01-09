from fastapi import APIRouter
from database import instructors_collection, quizzes_collection
from models import Instructor, Quiz
from datetime import datetime

router = APIRouter(prefix="/instructors", tags=["Instructors"])

# ---------------- REGISTER ----------------
@router.post("/register")
def register_instructor(instructor: Instructor):
    # Check for existing email
    existing = instructors_collection.find_one({"email": instructor.email})
    if existing:
        return {"message": "Email already registered"}

    instructors_collection.insert_one(instructor.dict())
    return {"message": "Instructor registered successfully"}


# ---------------- LOGIN ----------------
@router.post("/login")
def login_instructor(data: dict):
    instructor = instructors_collection.find_one({
        "email": data["email"],
        "password": data["password"]
    })
    
    
    if instructor:
        return {
            "message": "Login successful",
            "instructor_name": instructor["first_name"] + " " + instructor["last_name"]
            
        }
   
   
    return {"message": "Invalid credentials"}





# ---------------- DASHBOARD STATS ----------------
@router.get("/dashboard")
def dashboard_stats():
    now = datetime.now()
    month = now.month
    year = now.year

    total_quizzes = quizzes_collection.count_documents({
        "created_at_month": month,
        "created_at_year": year
    })

    unchecked_quizzes = quizzes_collection.count_documents({
        "created_at_month": month,
        "created_at_year": year,
        "graded": False
    })

    quizzes = quizzes_collection.find({
        "created_at_month": month,
        "created_at_year": year,
        "graded": True
    })

    total_score = 0
    total_count = 0

    for q in quizzes:
        if "average_score" in q:
            total_score += q["average_score"]
            total_count += 1

    performance_rate = round(total_score / total_count, 2) if total_count > 0 else 0

    return {
        "total_quizzes": total_quizzes,
        "unchecked_quizzes": unchecked_quizzes,
        "performance_rate": performance_rate
    }

# ---------------- DASHBOARD PANELS ----------------
@router.get("/dashboard/panels")
def dashboard_panels():
    now = datetime.now()
    
    # Get scheduled quizzes (future deadlines)
    scheduled_quizzes = list(quizzes_collection.find(
        {"deadline": {"$gt": now.isoformat()}},
        {"_id": 0, "id": 1, "title": 1, "deadline": 1, "subject_code": 1}
    ).limit(5))
    
    # Get reminders (could be quizzes due soon, etc.)
    reminders = [
        {"message": "Grade pending quizzes", "type": "warning"},
        {"message": "Review student performance", "type": "info"}
    ]
    
    return {
        "scheduled_quizzes": scheduled_quizzes,
        "reminders": reminders
    }
