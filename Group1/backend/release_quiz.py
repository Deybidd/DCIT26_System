from bson import ObjectId
import copy
import sys

from database import quizzes_collection, student_quiz_responses_collection


def find_quiz(quiz_id: str):
    quiz = quizzes_collection.find_one({"id": quiz_id})
    if not quiz:
        try:
            quiz = quizzes_collection.find_one({"_id": ObjectId(quiz_id)})
        except Exception:
            return None
    return copy.deepcopy(quiz)


def release_quiz_score(quiz_id: str):
    quiz = find_quiz(quiz_id)
    if not quiz:
        print({"error": "Quiz not found"})
        return

    responses = list(student_quiz_responses_collection.find({"quiz_id": quiz_id}))
    if not responses:
        print({"error": "No student submissions to release"})
        return

    total_score = 0

    for r in responses:
        correct_count = sum(
            1 for q, a in zip(quiz["questions"], r["answers"]) if q.get("answer") == a.get("answer")
        )
        total_questions = len(quiz["questions"])
        percentage = int((correct_count / total_questions) * 100) if total_questions > 0 else 0

        student_quiz_responses_collection.update_one(
            {"_id": r["_id"]},
            {"$set": {"score": percentage}}
        )

        total_score += percentage

    average_score = int(total_score / len(responses))

    quizzes_collection.update_one(
        {"id": quiz_id},
        {"$set": {"graded": True, "average_score": average_score}}
    )

    print({"message": "Quiz scores released successfully", "average_score": average_score})


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python release_quiz.py <quiz_id>")
    else:
        release_quiz_score(sys.argv[1])
