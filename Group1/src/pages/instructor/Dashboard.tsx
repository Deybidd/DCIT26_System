import { useEffect, useState } from "react";
import { api } from "@/api/api";

export default function Dashboard() {
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [uncheckedQuizzes, setUncheckedQuizzes] = useState(0);
  const [performanceRate, setPerformanceRate] = useState(0);

  const [scheduledQuizzes, setScheduledQuizzes] = useState<any[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Top panel stats
        const res = await api.get("/instructors/dashboard");
        const { total_quizzes, unchecked_quizzes, performance_rate } = res.data;
        setTotalQuizzes(total_quizzes);
        setUncheckedQuizzes(unchecked_quizzes);
        setPerformanceRate(performance_rate);

        // Bottom panels
        const res2 = await api.get("/instructors/dashboard/panels");
        setScheduledQuizzes(res2.data.scheduled_quizzes);
        setReminders(res2.data.reminders);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-black font-bold mb-6">Dashboard</h1>

      {/* Top Stats Panels */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow p-4 rounded flex flex-col items-center">
          <h2 className="text-black">Total Quizzes Created</h2>
          <p className="text-3xl font-bold">{totalQuizzes}</p>
        </div>

        <div className="bg-white shadow p-4 rounded flex flex-col items-center">
          <h2 className="text-black">Unchecked Quizzes</h2>
          <p className="text-3xl font-bold">{uncheckedQuizzes}</p>
        </div>

        <div className="bg-white shadow p-4 rounded flex flex-col items-center">
          <h2 className="text-black">Overall Performance Rate</h2>
          <p className="text-3xl font-bold">{performanceRate}%</p>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Scheduled Quizzes */}
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg text-black font-bold mb-4">Scheduled Quizzes</h2>
          {scheduledQuizzes.length > 0 ? (
            <ul className="space-y-2">
              {scheduledQuizzes.map((quiz) => (
                <li key={quiz._id} className="border p-2 rounded">
                  <p className="font-semibold">{quiz.name}</p>
                  <p className="text-sm text-gray-500">Deadline: {new Date(quiz.deadline).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No scheduled quizzes.</p>
          )}
        </div>

        {/* Reminders */}
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg text-black font-bold mb-4">Reminders</h2>
          {reminders.length > 0 ? (
            <ul className="space-y-2 list-disc list-inside">
              {reminders.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          ) : (
            <p>No reminders.</p>
          )}
        </div>
      </div>
    </div>
  );
}
