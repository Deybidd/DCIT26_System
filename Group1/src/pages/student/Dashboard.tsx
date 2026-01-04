import { useEffect, useState } from "react";
import { api } from "@/api/api";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    api.get("/quizzes").then((res) => setQuizzes(res.data));
  }, []);

  return (
    <>
      <h1 className="text-2xl text-black font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white text-black p-4 rounded shadow">
          Submitted Quizzes: {quizzes.length}
        </div>
        <div className="bg-white text-black p-4 rounded shadow">Missing Quizzes: 0</div>
        <div className="bg-white text-black p-4 rounded shadow">Performance: 0%</div>
      </div>
    </>
  );
}
