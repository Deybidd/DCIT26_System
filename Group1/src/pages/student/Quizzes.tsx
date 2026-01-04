import { useEffect, useState } from "react";
import { api } from "@/api/api";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    api.get("/quizzes").then((res) => setQuizzes(res.data));
  }, []);

  return (
    <>
      <h1 className="text-2xl text-black font-bold mb-4">Available Quizzes</h1>

      <div className="grid grid-cols-3 gap-4">
        {quizzes.map((q, i) => (
          <div key={i} className="bg-white text-black p-4 rounded shadow">
            <h2 className="font-bold">{q.title}</h2>
            <p>{q.description}</p>
            <p>Deadline: {q.deadline}</p>
            <p>Items: {q.questions.length}</p>
          </div>
        ))}
      </div>
    </>
  );
}
