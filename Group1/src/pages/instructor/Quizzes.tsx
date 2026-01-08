import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  questions: any[];
  subject_code: string;
  _id?: string; // fallback if old quiz has no id
}

export default function InstructorQuizzes() {
  const instructorEmail = localStorage.getItem("instructorEmail") || "";
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch quizzes
  const fetchQuizzes = async () => {
    if (!instructorEmail) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/quizzes/instructors?instructor_email=${instructorEmail}`);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
      setError("Failed to load quizzes. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Delete quiz
  const handleDelete = async (quiz: Quiz) => {
    const quizId = quiz.id || quiz._id;
    if (!quizId) {
      alert("Invalid quiz ID.");
      return;
    }
    if (!confirm("Delete this quiz?")) return;
    try {
      await api.delete(`/quizzes/${quizId}`);
      alert("Quiz deleted successfully.");
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to delete quiz", err);
      alert("Failed to delete quiz. Make sure the quiz ID is correct.");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="font-sans text-black">
      <h1 className="text-3xl font-bold mb-10 -mt-5 bg-white p-8 px-20 border-b-2">
        Quizzes
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md border ml-[280px] mr-5 w-300">
        <div className="flex justify-between items-center mb-6">
          <p className="font-semibold">{quizzes.length} Quizzes</p>
          <button
            onClick={() => navigate("/instructor/quizzes/create")}
            className="bg-[#87FDA8] border-2 border-black px-4 py-2 rounded-lg font-semibold hover:bg-emerald-400"
          >
            + Add Quiz
          </button>
        </div>

        {loading ? (
          <p>Loading quizzes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const quizId = quiz.id || quiz._id; // safe ID
              return (
                <div
                  key={quizId}
                  className="p-5 rounded-xl shadow border bg-[#FFE7B3] flex flex-col justify-between min-h-[220px] relative"
                >
                  {/* Edit / Delete */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => navigate(`/instructor/quizzes/edit/${quizId}`)}
                      title="Edit Quiz"
                      className="hover:bg-black/10 rounded p-1"
                    >
                      <Edit2 size={20} color="black" />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz)}
                      title="Delete Quiz"
                      className="hover:bg-black/10 rounded p-1"
                    >
                      <Trash2 size={20} color="black" />
                    </button>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-bold">{quiz.title}</h3>
                    <p className="text-sm mt-3 min-h-[40px]">
                      {quiz.description || "No description provided"}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between text-sm font-semibold mt-4">
                    <span>{quiz.questions.length} items</span>
                    <span>until {quiz.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
