import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api/api";
import { Clock, AlertTriangle } from "lucide-react";

interface Question {
  question: string;
  type: string;
  choices?: string[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  questions: Question[];
  timer_minutes?: number;
  max_attempts?: number;
  max_tab_switches?: number;
}

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const studentEmail = localStorage.getItem("studentEmail") || "";
  const submitLock = useRef(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [tabSwitchCountDisplay, setTabSwitchCountDisplay] = useState(0);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showTabSwitchModal, setShowTabSwitchModal] = useState(false);
  const tabSwitchCount = useRef(0);
  const quitLock = useRef(false);
  const timeUpLock = useRef(false);
  const tabSwitchLock = useRef(false);

  // -----------------------------
  // Fetch quiz and previous attempts
  // -----------------------------
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;

      try {
        const res = await api.get(`/quizzes/${quizId}`);
        const quizData: Quiz = res.data;
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(""));
        if (quizData.timer_minutes) setTimeLeft(quizData.timer_minutes * 60);

        try {
          const attemptsRes = await api.get("/quizzes/responses", {
            params: { quiz_id: quizId, student_email: studentEmail },
          });
          const attempts = attemptsRes.data || [];
          if (quizData.max_attempts && attempts.length >= quizData.max_attempts) {
            alert("You have reached the maximum number of attempts for this quiz.");
            navigate("/student/quizzes");
            return;
          }
        } catch (err: any) {
          if (err.response?.status === 404) {
            console.log("No previous attempts found, student can take the quiz.");
          } else {
            throw err;
          }
        }
      } catch (err) {
        console.error("Failed to fetch quiz", err);
        alert("Failed to load quiz");
        navigate("/student/quizzes");
      }
    };

    fetchQuiz();
  }, [quizId, studentEmail, navigate]);

  // -----------------------------
  // Tab switching detection
  // -----------------------------
  useEffect(() => {
    if (!quiz) return;

    const handleTabSwitch = () => {
      if (quitLock.current || tabSwitchLock.current) return;

      tabSwitchCount.current++;
      setTabSwitchCountDisplay(tabSwitchCount.current);

      if (quiz.max_tab_switches && tabSwitchCount.current >= quiz.max_tab_switches) {
        tabSwitchLock.current = true;
        setShowTabSwitchModal(true);
        setTimeout(() => {
          handleAutoSubmit();
        }, 3000);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) handleTabSwitch();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [quiz, navigate]);

  // -----------------------------
  // Timer countdown with auto-submit
  // -----------------------------
  useEffect(() => {
    if (timeLeft === null || quiz === null) return;

    if (timeLeft <= 0 && !timeUpLock.current) {
      timeUpLock.current = true;
      setShowTimeUpModal(true);
      setTimeout(() => {
        handleAutoSubmit();
      }, 3000);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return null;
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, quiz]);

  // -----------------------------
  // Answer handling
  // -----------------------------
  const handleAnswerChange = (index: number, value: string) => {
    const copy = [...answers];
    copy[index] = value;
    setAnswers(copy);
  };

  // -----------------------------
  // Rich Text Formatting
  // -----------------------------
  const applyFormatting = (command: "bold" | "italic" | "underline") => {
    document.execCommand(command, false, "");
  };

  // -----------------------------
  // Submit quiz
  // -----------------------------
  const handleSubmit = async () => {
    if (!quiz || submitLock.current) return;
    submitLock.current = true;

    try {
      const submission = {
        student_email: studentEmail,
        answers: quiz.questions.map((q, i) => ({
          question: q.question,
          answer: answers[i],
        })),
        tab_switch_count: tabSwitchCount.current,
      };

      await api.post(`/quizzes/submit/${quiz.id}`, submission);
      alert("Quiz submitted successfully!");
      navigate("/student/quizzes");
    } catch (err: any) {
      submitLock.current = false;
      alert("Submission failed.");
    }
  };

  // -----------------------------
  // Auto-submit helper
  // -----------------------------
  const handleAutoSubmit = async () => {
    if (quitLock.current || submitLock.current) return;
    submitLock.current = true;

    try {
      const submission = {
        student_email: studentEmail,
        answers: quiz?.questions.map((q, i) => ({
          question: q.question,
          answer: answers[i],
        })) || [],
        tab_switch_count: tabSwitchCount.current,
      };

      if (quiz) {
        await api.post(`/quizzes/submit/${quiz.id}`, submission);
      }
    } catch (err) {
      console.error("Auto-submit failed:", err);
    } finally {
      navigate("/student/quizzes", { replace: true });
    }
  };

  // -----------------------------
  // Quit quiz manually
  // -----------------------------
  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit? Your progress will be lost.")) {
      navigate("/student/quizzes");
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="min-h-screen flex font-sans [#FEFFF4] flex-col text-black items-center justify-start p-8">
      <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
      <p className="text-gray-700 mb-6">{quiz.description}</p>

      {/* Blob Container with Timer */}
<div className="fixed -top-2 -right-2 mb-8">
  {/* SVG Blob */}
  <svg
    width="100%"
    height="auto"
    viewBox="0 0 286 202"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto"
  >
    <path
      d="M263.229 3.5332C274.606 3.53321 280.299 3.68319 283 3.85645V84.5332C283 130.44 282.376 151.666 281.752 165.405C281.192 177.736 280.63 184.117 280.521 196.913C279.977 196.289 279.352 195.623 278.639 194.945C275.441 191.91 270.478 188.606 263.451 187.55C255.711 186.387 248.575 181.052 241.624 173.321C234.689 165.608 228.143 155.748 221.5 145.868C214.893 136.041 208.187 126.19 201.014 118.718C193.851 111.256 186.003 105.932 177.066 105.56C151.365 104.489 125.764 114.834 101.206 122.81C76.4695 130.843 52.7543 136.506 30.0469 126.989C18.4598 122.133 11.1531 115.797 6.83789 108.392C2.51547 100.974 1.10031 92.3228 1.59375 82.6748C2.08787 73.0146 4.49062 62.4454 7.7168 51.2676C10.9438 40.0871 14.9357 28.4801 18.6357 16.5537C20.2921 12.8112 20.3099 9.96682 19.9062 7.81836C19.7104 6.77605 19.4141 5.90636 19.2363 5.32715C19.1829 5.15317 19.1442 5.0149 19.1152 4.90234C19.6451 4.76242 20.5809 4.657 22.1943 4.59473C25.3944 4.47122 30.7115 4.5332 39.5 4.5332C43.9349 4.5332 92.4998 4.28318 143.632 4.0332C194.772 3.78319 248.483 3.5332 263.229 3.5332Z"
      fill="#87FDA8"
      stroke="black"
      strokeWidth="3"
    />
  </svg>

  {/* Timer Overlay */}
  <div className="absolute top-13 -right-8 transform -translate-x-1/2 -translate-y-1/2 text-center">
             
    {quiz.timer_minutes && (
       
      <div
        className={`font-bold text-2xl ${
          timeLeft !== null && timeLeft < 60 ? "text-red-600" : "text-black"
        }`}
      >
         Time Left: {Math.floor((timeLeft ?? 0) / 60)
          .toString()
          .padStart(1, "0")}
        :
        {((timeLeft ?? 0) % 60).toString().padStart(2, "0")}
      </div>
    )}
    {quiz.max_tab_switches && (
      <div className="font-semibold text-black text-base mt-1">
        Tab Switches: {tabSwitchCountDisplay} / {quiz.max_tab_switches}
      </div>
    )}
  </div>
</div>


      {/* Time Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md text-center">
            <div className="flex justify-center mb-4">
              <Clock size={64} className="text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Time's Up!</h2>
            <p className="text-gray-700 text-lg mb-6">
              Your time has expired. Your quiz will be automatically submitted now.
            </p>
            <div className="flex justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="text-gray-600 font-semibold">Submitting your quiz...</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switch Exceeded Modal */}
      {showTabSwitchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border-2 border-red-600 font-sans p-8 shadow-lg max-w-md text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={64} className="text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Tab Switches Exceeded!</h2>
            <p className="text-gray-700 text-lg mb-6">
              You have exceeded the maximum number of allowed tab switches. The quiz will be closed now.
            </p>
            <div className="flex justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-4 border-red-600 border-t-transparent rounded-full"></div>
              <p className="text-black-600 font-semibold">Closing quiz...</p>
            </div>
          </div>
        </div>
      )}

      <form className="w-full max-w-3xl">
        {quiz.questions.map((q, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
          >
            <p className="font-semibold text-lg mb-4">
              {i + 1}. {q.question}
            </p>

            {q.choices && q.choices.length > 0 ? (
              <div className="flex flex-col gap-3">
                {q.choices.map((choice, ci) => (
                  <label key={ci} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={choice}
                      checked={answers[i] === choice}
                      onChange={() => handleAnswerChange(i, choice)}
                      className="accent-blue-500"
                    />
                    <span className="text-gray-800">{choice}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="border rounded p-3">
                {/* Rich Text Toolbar */}
                <div className="mb-2 flex gap-2">
                  <button type="button" onClick={() => applyFormatting("bold")} className="font-bold border px-2 rounded hover:bg-gray-200">B</button>
                  <button type="button" onClick={() => applyFormatting("italic")} className="italic border px-2 rounded hover:bg-gray-200">I</button>
                  <button type="button" onClick={() => applyFormatting("underline")} className="underline border px-2 rounded hover:bg-gray-200">U</button>
                </div>
                {/* Editable div */}
                <div
                  contentEditable
                  className="min-h-[100px] w-full p-2 border rounded focus:outline-none"
                  onInput={(e) => handleAnswerChange(i, (e.target as HTMLDivElement).innerHTML)}
                  dangerouslySetInnerHTML={{ __html: answers[i] }}
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleQuit}
            className="bg-red-300 font-medium px-6 py-2 rounded border-2 hover:bg-red-400"
          >
            Quit
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#87FDA8] font-medium text-black border-1 border-black px-6 py-2 rounded hover:bg-green-300"
          >
            Submit Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
