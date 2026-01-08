import { useEffect, useState } from "react";
import { api } from "@/api/api";

export default function InstructorDashboard() {
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [uncheckedQuizzes, setUncheckedQuizzes] = useState(0);
  const [performanceRate, setPerformanceRate] = useState(0);
  const [scheduledQuizzes, setScheduledQuizzes] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const top = await api.get("/instructors/dashboard");
        setTotalQuizzes(top.data.total_quizzes);
        setUncheckedQuizzes(top.data.unchecked_quizzes);
        setPerformanceRate(top.data.performance_rate);

        const bottom = await api.get("/instructors/dashboard/panels");
        setScheduledQuizzes(bottom.data.scheduled_quizzes);
        setReminders(bottom.data.reminders);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="ml-60 flex-col h-screen">
      <h1 className="bg-[#FEFFF4] font-sans text-3xl text-black font-extrabold p-8 w-full">
        Instructor Dashboard
      </h1>
      <hr className="h-0.5 w-full bg-black self-center" />

      {/* TOP PART */}
     <div className="flex-1 grid xl:grid-cols-3 bg-white justify-center items-center gap-4 my-4 mx-20 p-1 h-[260px] rounded-2xl shadow-lg divide-x-2 divide-black">
  <StatBlob value={totalQuizzes} label="Total Quizzes Created" />
  <StatBlob value={uncheckedQuizzes} label="Unchecked Quizzes" />
  <StatBlob value={`${performanceRate}%`} label="Overall Performance Rate" />
</div>


      {/* BOTTOM PART */}
      <div className="flex-1 font-sans grid xl:grid-cols-2 gap-20 my-10 mx-30 p-4">

        {/* SCHEDULED QUIZZES */}
        <div className="flex flex-col text-black">
          <h1 className="pb-4 font-bold text-2xl">Scheduled Quizzes</h1>

          <div className="flex-1 font-medium bg-white grid grid-cols-1 rounded-2xl p-2 shadow-lg">
            <div className="p-4">
              <ul className="grid grid-cols-1 gap-3">
                {scheduledQuizzes.length === 0 && <p>No scheduled quizzes</p>}
                {scheduledQuizzes.map((q) => (
                  <li key={q._id} className="bg-[#FFE6B1] p-2 rounded shadow-sm">
                    <div className="flex font-bold justify-between">
                      <h1>{q.title}</h1>
                      <h1>{new Date(q.deadline).toLocaleDateString()}</h1>
                    </div>
                    <div className="flex justify-between">
                      <h1>{q.questions.length} Items</h1>
                      <span>Subject: {q.subject_code}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* REMINDERS */}
        <div className="flex flex-col text-black">
          <h1 className="pb-4 font-bold text-2xl">Reminders</h1>

          <div className="flex-1 bg-white grid grid-cols-1 rounded-2xl p-4 shadow-lg">
            <ul className="grid grid-cols-1 gap-4">
              {reminders.length === 0 && <p>No reminders</p>}
              {reminders.map((r, i) => (
                <li key={i}>
                  <h1 className="font-semibold text-lg">{r.title}</h1>
                  <p>{r.message}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlob({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-black p-4 flex flex-col justify-between text-center relative h-[240px]">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[230px] h-[170px] flex justify-center">
          <svg
            viewBox="0 0 149 113"
            className="absolute w-45 h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M52.25 0.59C60 0.25 68 0.94 76 1.03C84.07 1.12 92.6 0.44 100.35 2.23C109.07 4.25 116.43 9.8 123.17 15.7C130.24 21.89 137.33 28.45 141.77 36.67C146.28 45.02 148.11 54.88 147.01 64.37C145.87 74.15 140.55 82.75 134.01 90.05C127.46 97.37 120.12 104.92 110.75 108.46C101.05 112.13 90.07 111.34 79.53 111.03C68.75 110.71 57.07 111.45 47.13 107.32C37.25 103.21 29.37 95.41 21.83 87.87C14.28 80.32 7.02 72.24 3.25 62.5C-0.52 52.76 0.11 41.34 1.05 30.97C1.97 20.86 3.8 10.08 11.09 4.46C18.24 -1.04 30.41 1.54 40.33 1.61C44.34 1.64 48.34 0.77 52.25 0.59Z"
              fill="#87FDA8"
              stroke="black"
            />
          </svg>

          {/* VALUE CENTER */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-6xl font-extrabold">{value}</h1>
          </div>
        </div>
      </div>

      {/* LABEL */}
      <h1 className="text-lg font-bold mt-2">{label}</h1>
    </div>
  );
}

