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

        // Check previous attempts
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
        // Auto-quit after 3 seconds
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
      // Auto-submit after 3 seconds
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
    <div className="min-h-screen flex flex-col text-black items-center justify-start p-8">
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <p className="mb-6">{quiz.description}</p>

      {/* Timer Display */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2">
        {quiz.timer_minutes && (
          <div className={`font-bold text-2xl ${timeLeft !== null && timeLeft < 60 ? "text-red-600" : "text-blue-600"}`}>
            Time Left: {Math.floor((timeLeft ?? 0) / 60)
              .toString()
              .padStart(1, "0")}
            :
            {((timeLeft ?? 0) % 60).toString().padStart(2, "0")}
          </div>
        )}
        {quiz.max_tab_switches && (
          <div className="font-semibold text-yellow-700 text-lg">
            Tab Switches: {tabSwitchCountDisplay} / {quiz.max_tab_switches}
          </div>
        )}
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

      <form className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        {quiz.questions.map((q, i) => (
          <div key={i} className="mb-6">
            <p className="font-semibold mb-2">
              {i + 1}. {q.question}
            </p>

            {q.choices && q.choices.length > 0 ? (
              <div className="flex flex-col gap-2">
                {q.choices.map((choice, ci) => (
                  <label key={ci} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={choice}
                      checked={answers[i] === choice}
                      onChange={() => handleAnswerChange(i, choice)}
                    />
                    {choice}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="border p-2 rounded w-full"
                value={answers[i]}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleQuit}
            className="bg-gray-300 px-6 py-2 rounded border-2"
          >
            Quit
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Submit Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
