import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { useNavigate } from "react-router-dom";

interface Quiz {
  id: string;
  subject_code: string;
  title: string;
  description: string;
  deadline: string;
  created_by: string;
  graded: boolean;
  average_score: number;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  students: string[];
}

export default function StudentQuizzes() {
  const studentEmail = localStorage.getItem("studentEmail") || "";
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/students/quizzes", {
        params: { student_email: studentEmail }
      });
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchQuizzes();
  }, []);

  // Only show quizzes for subjects the student is enrolled in
  const enrolledSubjectCodes = subjects
    .filter((s) => s.students.includes(studentEmail))
    .map((s) => s.code);

  const visibleQuizzes = quizzes.filter((q) =>
    enrolledSubjectCodes.includes(q.subject_code)
  );

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-6 text-black">Available Quizzes</h1>

      {visibleQuizzes.length === 0 ? (
        <p>You have no available quizzes at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleQuizzes.map((quiz) => {
            const subject = subjects.find((s) => s.code === quiz.subject_code);

            return (
              <div
                key={quiz.id}
                className="bg-white p-5 rounded-xl shadow border text-black relative flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-black">{quiz.title}</h3>
                  <p className="text-sm mt-2 text-black">{quiz.description}</p>
                  <p className="text-sm mt-2 text-black">
                    Subject: {subject ? subject.name : quiz.subject_code} ({quiz.subject_code})
                  </p>
                  <p className="text-sm mt-2 text-black">Instructor: {quiz.created_by}</p>
                  <p className="text-sm mt-2 text-black">Deadline: {quiz.deadline}</p>

                  {quiz.graded ? (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Graded: {quiz.average_score.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                      Not Graded
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Take Quiz
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
