from fastapi import APIRouter
from database import quizzes_collection
from datetime import datetime

router = APIRouter(prefix="/instructors", tags=["Instructors"])

@router.get("/dashboard")
def dashboard_stats():
    now = datetime.now()
    month = now.month
    year = now.year

    # Total quizzes created this month
    total_quizzes = quizzes_collection.count_documents({
        "created_at_month": month,
        "created_at_year": year
    })

    # Unchecked quizzes (submitted but not graded)
    unchecked_quizzes = quizzes_collection.count_documents({
        "created_at_month": month,
        "created_at_year": year,
        "graded": False
    })

    # Overall performance: average score of all quizzes this month
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
