from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["quizapp"]

students_collection = db["students"]
instructors_collection = db["instructors"]
subjects_collection = db["subjects"]
quizzes_collection = db["quizzes"]
