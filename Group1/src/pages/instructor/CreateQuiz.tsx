import { useState, useEffect } from "react";
import { api } from "@/api/api";
import { useNavigate } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  code: string;
  students: string[];
}

interface Question {
  question: string;
  type: "mc" | "id";
  choices: string[];
  answer: string;
}

export default function InstructorCreateQuiz() {
  const navigate = useNavigate();
  const instructorEmail = localStorage.getItem("instructorEmail") || "";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timerMinutes, setTimerMinutes] = useState<number>(1); // NEW: Timer state
  const [maxAttempts, setMaxAttempts] = useState<number>(1); // number of attempts
  const [maxTabSwitches, setMaxTabSwitches] = useState<number>(0);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get(`/subjects?instructorEmail=${instructorEmail}`);
      setSubjects(res.data);
      if (res.data.length > 0) setSelectedSubject(res.data[0].code);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", type: "mc", choices: ["", ""], answer: "" },
    ]);
  };

  const addChoice = (qIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].choices.push("");
      return copy;
    });
  };

  const handlePublish = async () => {
    if (
  !title ||
  !description ||
  !deadline ||
  !selectedSubject ||
  timerMinutes <= 0 ||
  maxAttempts < 1 ||
  questions.length === 0 ||
  questions.some(
    (q) =>
      !q.question ||
      !q.answer ||
      (q.type === "mc" && q.choices.some((c) => !c.trim()))
  )
) {
  alert("Please complete all required fields.");
  return;
}

    try {
      const date = new Date(deadline);
      const formattedDeadline = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

      const payload = {
  title,
  description,
  deadline: formattedDeadline,
  subject_code: selectedSubject,
  instructor_email: instructorEmail,
  questions: questions.map((q) => ({
    question: q.question,
    choices: q.type === "mc" ? q.choices.filter((c) => c.trim()) : [],
    answer: q.answer,
    type: q.type === "mc" ? "multiple_choice" : "identification",
  })),
  timer_minutes: timerMinutes > 0 ? timerMinutes : undefined,
  max_attempts: maxAttempts > 0 ? maxAttempts : undefined,
  max_tab_switches: maxTabSwitches > 0 ? maxTabSwitches : undefined,
};
      await api.post("/quizzes", payload);

      alert("Quiz published successfully!");
      navigate("/instructor/quizzes");
    } catch (err: any) {
      console.error("Failed to publish quiz", err.response?.data || err);
      alert(err.response?.data?.detail || "Failed to publish quiz.");
    }
  };

  return (
    <div className="mr-70 p-6 bg-[#87FDA8] w-3/6 max-w-2xl text-black rounded-2xl shadow-md mx-auto mt-8 mb-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

      <label className="font-medium mb-1 block">Select Subject</label>
      <select
        required
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="border-2 p-2 rounded mb-3 w-full bg-white"
      >
        {subjects.map((s) => (
          <option key={s.id} value={s.code}>
            {s.name} ({s.code})
          </option>
        ))}
      </select>

      <input 
        required
        className="w-full border-2 p-2 mb-3 rounded bg-white"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        required
        className="w-full border-2 p-2 mb-3 rounded bg-white"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="font-medium mb-1 block">Deadline</label>
      <input
        required
        type="date"
        className="border-2 p-2 rounded mb-3 w-full bg-white"
        style={{ colorScheme: "black" }}
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <label className="font-medium mb-1 block">Timer (Minutes)</label>
      <input
        required
        type="number"
        min={1}
        value={timerMinutes}
        onChange={(e) => setTimerMinutes(Math.max(1, Number(e.target.value)))}
        className="border-2 p-2 rounded mb-6 w-full bg-white"
        placeholder="Enter timer in minutes"
      />

      <label className="font-medium mb-1 block">Maximum Attempts (Optional)</label>
<input
  required
  type="number"
  min={1}
  value={maxAttempts}
  onChange={(e) => setMaxAttempts(Math.max(1, Number(e.target.value)))}
  className="border-2 p-2 rounded mb-3 w-full bg-white"
  placeholder="Enter max attempts for this quiz"
/>

<label className="font-medium mb-1 block">Maximum Tab Switches (Optional)</label>
<input
  type="number"
  min={0}
  value={maxTabSwitches}
  onChange={(e) => setMaxTabSwitches(Number(e.target.value))}
  className="border-2 p-2 rounded mb-6 w-full bg-white"
  placeholder="Enter number of allowed tab switches"
/>

{questions.map((q, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border-2 mb-4">
          <input
            required
            className="w-full border-2 rounded p-2 mb-2"
            placeholder="Question"
            value={q.question}
            onChange={(e) => {
              const copy = [...questions];
              copy[i].question = e.target.value;
              setQuestions(copy);
            }}
          />

          <select
            required
            className="border-2 rounded p-2 mb-2"
            value={q.type}
            onChange={(e) => {
              const copy = [...questions];
              copy[i].type = e.target.value as "mc" | "id";
              setQuestions(copy);
            }}
          >
            <option value="mc">Multiple Choice</option>
            <option value="id">Identification</option>
          </select>

          {q.type === "mc" && (
            <>
              {q.choices.map((choice, ci) => (
                <input
                  required
                  key={ci}
                  className="w-full border-2 rounded p-2 mb-1"
                  placeholder={`Choice ${ci + 1}`}
                  value={choice}
                  onChange={(e) => {
                    setQuestions((prev) => {
                      const copy = [...prev];
                      copy[i].choices[ci] = e.target.value;
                      return copy;
                    });
                  }}
                />
              ))}

              <button
                type="button"
                onClick={() => addChoice(i)}
                className="bg-[#87FDA8] text-black font-medium px-3 py-1 rounded border-2 border-black mt-2"
              >
                + Add Choice
              </button>
            </>
          )}

          <input
            required
            className="w-full border-2 rounded p-2 mt-2"
            placeholder="Correct Answer"
            value={q.answer}
            onChange={(e) => {
              const copy = [...questions];
              copy[i].answer = e.target.value;
              setQuestions(copy);
            }}
          />
</div>
      ))}

      <button
        
        type="button"
        onClick={addQuestion}
        className="bg-white px-4 py-2 rounded border-2 mr-3"
      >
        + Add Question
      </button>

      <button
        onClick={handlePublish}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Publish Quiz
      </button>
    </div>
  );
}
