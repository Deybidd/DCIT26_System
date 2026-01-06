import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { useNavigate } from "react-router-dom";

export default function Quizzes() {
  const instructorEmail = localStorage.getItem("instructorEmail") || "";
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const res = await api.get(`/quizzes/instructors?instructor_email=${instructorEmail}`);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className=" font-sans text-black">
      <h1 className="text-2xl font-bold mb-10 -mt-10 bg-white p-8 px-20 border-b-2">Quizzes</h1>

      {/* Container */}
      <div className="bg-white h-130 w-250 absolute left-99 p-6 rounded-2xl shadow-md border">
         <h1 className="text-2xl font-bold">Quiz Table</h1>
        <div className="flex justify-between items-center mb-6">
          <p className="text-black font-semibold">{quizzes.length} Quizzes</p>
          <button
            onClick={() => navigate("/instructor/quizzes/create")}
            className="bg-[#87FDA8] border-2 border-black px-4 py-2 rounded-lg font-semibold hover:bg-emerald-400"
          >
            + Add Quiz
          </button>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-3 gap-6">
          {quizzes.map((quiz, i) => (
            <div key={i} className="p-5 rounded-xl shadow border bg-[#FFE7B3]">
              <h3 className="font-bold text-black">{quiz.title}</h3>
              <p className="text-sm text-black mt-5">{quiz.description}</p>
              <div className="flex justify-between mt-10 text-sm font-semibold text-black">
                <span>{quiz.questions.length} items</span>
                <span>until {quiz.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
