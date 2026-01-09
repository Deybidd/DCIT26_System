import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { BarChart2 } from "lucide-react";

interface Quiz {
  id: string;
  subject_code: string;
  title: string;
  description: string;
  deadline: string;
  created_by: string;
  graded: boolean;
  average_score: number;
  subject_name?: string; // optional if backend sends subject name
  questions: Array<any>; // array of questions
}

// Helper function to get random light color
const getRandomLightColor = (): string => {
  const lightColors = [
    "bg-blue-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-indigo-200",
    "bg-rose-200",
    "bg-cyan-200",
    "bg-amber-200",
    "bg-lime-200",
    "bg-sky-200",
    "bg-fuchsia-200"
  ];
  return lightColors[Math.floor(Math.random() * lightColors.length)];
};

export default function StudentQuizzes() {
  const navigate = useNavigate();
  const studentEmail = localStorage.getItem("studentEmail") || "";
  const [attemptInfo, setAttemptInfo] = useState<Record<string, boolean>>({});
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentScores, setStudentScores] = useState<Record<string, number>>({});
  const [showAttemptsModal, setShowAttemptsModal] = useState<string | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<any[]>([]);
  const [quizColors, setQuizColors] = useState<Record<string, string>>({});

  // Fetch quizzes and scores
  const fetchQuizzes = async () => {
    if (!studentEmail) return;

    try {
      const res = await api.get("/students/quizzes", {
        params: { student_email: studentEmail },
      });
      const quizList = res.data || [];
      setQuizzes(quizList);

      // Generate random colors for each quiz
      const colors: Record<string, string> = {};
      quizList.forEach((q: Quiz) => {
        colors[q.id] = getRandomLightColor();
      });
      setQuizColors(colors);

      // Check attempts
      const attemptMap: Record<string, boolean> = {};
      for (const q of quizList) {
        try {
          const attemptRes = await api.get("/quizzes/attempts/check", {
            params: { quiz_id: q.id, student_email: studentEmail },
          });
          attemptMap[q.id] = attemptRes.data.can_take;
        } catch (err) {
          console.error(`Failed to check attempts for quiz ${q.id}`, err);
          attemptMap[q.id] = false;
        }
      }
      setAttemptInfo(attemptMap);

      // Fetch student scores using /quizzes/responses/count/{quiz_id}
      const scores: Record<string, number> = {};
      for (const quiz of quizList) {
        try {
          const scoreRes = await api.get(`/quizzes/responses/count/${quiz.id}`);
          console.log(`Response count for quiz ${quiz.id}:`, scoreRes.data);
          if (scoreRes.data.responses && scoreRes.data.responses.length > 0) {
            // Find this student's response
            const studentResponse = scoreRes.data.responses.find(
              (r: any) => r.student_email === studentEmail
            );
            if (studentResponse) {
              const score = studentResponse.score !== undefined ? studentResponse.score : studentResponse.correct_count;
              if (score !== undefined) {
                scores[quiz.id] = score;
                console.log(`Fetched score for quiz ${quiz.id}:`, score);
              }
            }
          }
        } catch (err: any) {
          console.error(`Failed to fetch score for quiz ${quiz.id}`, err);
        }
      }
      setStudentScores(scores);

    } catch (err) {
      console.error("Failed to fetch quizzes", err);
      setQuizzes([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchQuizzes().finally(() => setLoading(false));
  }, [studentEmail]);

  if (loading) {
    return (
      <div className="ml-65 flex-col h-screen p-6 text-black">
        <p>Loading quizzes...</p>
      </div>
    );
  }



  const openAttemptsModal = async (quizId: string) => {
  try {
    // Use the existing responses count endpoint and filter for this student
    const res = await api.get(`/quizzes/responses/count/${quizId}`);
    const allResponses = res.data.responses || [];
    const studentResponses = allResponses.filter((r: any) => r.student_email === studentEmail);
    setAttemptHistory(studentResponses);
    setShowAttemptsModal(quizId);
  } catch (err) {
    console.error("Failed to load attempts", err);
    alert("Unable to load attempt history.");
  }
};
  

  return (
  <div className="ml-65 flex-col font-sans h-screen p-6 text-black">
    <h1 className="text-2xl font-bold mb-6 text-black">Available Quizzes</h1>

    {quizzes.length === 0 ? (
      <p>You have no available quizzes at the moment.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className={`border-2 ${quizColors[quiz.id]} p-5 rounded-xl shadow border text-black relative flex flex-col justify-between`}
          >
            <div>
              <h3 className="font-bold text-xl text-black">{quiz.title}</h3>
              <p className="text-sm mt-2 text-black">{quiz.description}</p>
              <p className="text-sm mt-2 text-black">
               <span className="font-semibold"> Subject: </span>{quiz.subject_name || quiz.subject_code} 
              </p>
              <p className="text-sm mt-2 text-black"><span className="font-semibold">Instructor: </span>{quiz.created_by}</p>
              <p className="text-sm mt-2 text-black"><span className="font-semibold">Deadline: </span>  {quiz.deadline}</p>

              {/* Graded / Not Graded with Icon & Score */}
{quiz.graded ? (
  <div className="mt-2 flex items-center gap-2">
    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
      <BarChart2 size={12} /> Graded
    </span>
    {studentScores[quiz.id] !== undefined && (
      <span className="text-sm font-semibold text-green-700">
        Your Score: {studentScores[quiz.id]} / {quiz.questions.length}
      </span>
    )}
  </div>
) : null}
  
{/* Top-right controls: View Attempts + Not Graded badge */}
<div className="absolute top-2 right-2 flex flex-col items-end gap-2">
  <button
    onClick={() => openAttemptsModal(quiz.id)
    }
    className="text-xs bg-[#87FDA8] border-1 px-2 py-1 rounded shadow hover:bg-green-400"
  >
    View Attempts
  </button>
  {!quiz.graded && (
    <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded">
      Not Graded
    </span>
  )}
</div>

{showAttemptsModal === quiz.id && (
  <>
    {/* Floating Close Button */}
    <button
      onClick={() => setShowAttemptsModal(null)}
      className="absolute top-8 left-7 border-2 border-black z-50 bg-red-400 font-bold text-black px-4 py-1 rounded-lg shadow hover:bg-red-500"
    >
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 14.122L17.3031 19.425C17.5845 19.7064 17.9661 19.8645 18.3641 19.8645C18.762 19.8645 19.1437 19.7064 19.4251 19.425C19.7065 19.1436 19.8646 18.7619 19.8646 18.364C19.8646 17.966 19.7065 17.5844 19.4251 17.303L14.1201 12L19.4241 6.69699C19.5634 6.55766 19.6738 6.39226 19.7492 6.21024C19.8245 6.02821 19.8633 5.83313 19.8632 5.63613C19.8632 5.43914 19.8243 5.24407 19.7489 5.06209C19.6735 4.8801 19.5629 4.71475 19.4236 4.57549C19.2843 4.43622 19.1189 4.32576 18.9368 4.25042C18.7548 4.17507 18.5597 4.13631 18.3627 4.13636C18.1657 4.13641 17.9707 4.17526 17.7887 4.25069C17.6067 4.32612 17.4414 4.43666 17.3021 4.57599L12.0001 9.87899L6.69709 4.57599C6.55879 4.43266 6.39333 4.31831 6.21036 4.23961C6.02739 4.16091 5.83058 4.11944 5.63141 4.11762C5.43224 4.11579 5.23471 4.15365 5.05033 4.22899C4.86595 4.30432 4.69842 4.41562 4.55752 4.55639C4.41661 4.69717 4.30515 4.86459 4.22964 5.0489C4.15414 5.23321 4.11609 5.43071 4.11773 5.62988C4.11936 5.82905 4.16065 6.02589 4.23917 6.20894C4.3177 6.39198 4.43189 6.55755 4.57509 6.69599L9.88009 12L4.57609 17.304C4.43289 17.4424 4.3187 17.608 4.24017 17.791C4.16165 17.9741 4.12036 18.1709 4.11873 18.3701C4.11709 18.5693 4.15514 18.7668 4.23064 18.9511C4.30615 19.1354 4.41761 19.3028 4.55852 19.4436C4.69942 19.5844 4.86695 19.6957 5.05133 19.771C5.23571 19.8463 5.43324 19.8842 5.63241 19.8824C5.83158 19.8805 6.02839 19.8391 6.21136 19.7604C6.39433 19.6817 6.55979 19.5673 6.69809 19.424L12.0001 14.122Z" fill="black"/>
</svg>

    </button>

    {/* Attempts Modal */}
    <div className="absolute top-11 right-4 z-40 w-80 bg-[#87FDA8] border-2 border-black rounded-lg p-4 shadow max-h-58 overflow-y-auto">
      <h2 className="text-base font-bold mb-2">Your Attempts</h2>

      {attemptHistory.length === 0 ? (
        <p className="text-sm">No attempts yet.</p>
      ) : (
        attemptHistory.map((a, idx) => (
          <div key={idx} className="border-1 py-3 text-sm bg-white p-3 rounded-lg mt-1 flex justify-between">
            <div>
              <p className="font-bold mb-1 text-sm">Attempt {idx + 1}</p>
              <p className="text-gray-500 text-xs">
                {new Date(a.submitted_at).toLocaleString()}
              </p>
            </div>
            <div className="font-semibold">
              {a.released ? (
                <>
                  {a.score} / {a.answers.length}
                  <span className="text-green-600 ml-2 text-sm font-extrabold">({a.percentage}%)</span>
                </>
              ) : (
                <span className="text-yellow-600 text-sm font-semibold">Pending Grade</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </>
)}


              </div>

            {/* Take Quiz Button */}
            <button
              disabled={!attemptInfo[quiz.id]}
              onClick={() => navigate(`/student/quiz/${quiz.id}`)}
              className={`px-4 py-2 rounded mt-3 ${
                attemptInfo[quiz.id]
                  ? "bg-[#87FDA8] border-2 border-black rounded-lg text-black"
                  : "bg-gray-400 border-2 rounded-lg text-gray-700 cursor-not-allowed"
              }`}
            >
              {attemptInfo[quiz.id] ? "Take Quiz" : "Attempts Used"}
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

}
