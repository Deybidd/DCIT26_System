import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { useNavigate, useParams } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  code: string;
  students: string[];
}

interface Question {
  question: string;
  type: string;
  choices?: string[];
  answer: string;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  questions: Question[];
  subject_code: string;
}

export default function InstructorEditQuiz() {
  const navigate = useNavigate();
  const { quizId } = useParams(); // get quizId from route
  const instructorName = localStorage.getItem("instructorName") || "";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const res = await api.get(`/subjects?instructorEmail=${localStorage.getItem("instructorEmail")}`);
      setSubjects(res.data);
      if (res.data.length > 0) setSelectedSubject(res.data[0].code);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  // Fetch quiz data
  const fetchQuiz = async () => {
    if (!quizId) return;
    try {
      const res = await api.get(`/quizzes/${quizId}`);
      const quiz: Quiz = res.data;
      setTitle(quiz.title);
      setDescription(quiz.description || "");
      setDeadline(quiz.deadline);
      setSelectedSubject(quiz.subject_code);
      setQuestions(quiz.questions);
    } catch (err) {
      console.error("Failed to fetch quiz", err);
      alert("Failed to load quiz data");
      navigate("/instructor/quizzes");
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchQuiz();
  }, [quizId]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", type: "mc", choices: ["", ""], answer: "" }]);
  };

  const addChoice = (qIndex: number) => {
    const copy = [...questions];
    copy[qIndex].choices?.push("");
    setQuestions(copy);
  };

  // Handle quiz update
  const handleUpdate = async () => {
    if (!title || !deadline || !selectedSubject || questions.length === 0) {
      alert("Please complete all quiz fields");
      return;
    }

    try {
      const res = await api.put(`/quizzes/${quizId}`, {
        title,
        description,
        deadline,
        subject_code: selectedSubject,
        created_by: instructorName,
        questions,
      });

      if (res.data.message === "Quiz updated successfully") {
        alert("Quiz updated!");
        navigate("/instructor/quizzes");
      }
    } catch (err) {
      console.error("Failed to update quiz", err);
      alert("Failed to update quiz");
    }
  };

  return (
    <div className="p-10 bg-[#87FDA8] w-150 text-black rounded-2xl shadow-md absolute top-20 left-3/5 transform -translate-x-2/4">
      <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>

      {/* Subject selection */}
      <label className="font-medium mb-1 block">Select Subject</label>
      <select
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
        className="w-full border-2 p-2 mb-3 rounded bg-white"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border-2 p-2 mb-3 rounded bg-white"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Deadline */}
      <label className="font-medium mb-1 block">Deadline</label>
      <input
        type="date"
        className="border-2 p-2 rounded mb-6 w-full bg-white"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={i} className="bg-white p-4 rounded-lg border-2 mb-4">
          <input
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
            className="border-2 rounded p-2 mb-2"
            value={q.type}
            onChange={(e) => {
              const copy = [...questions];
              copy[i].type = e.target.value;
              setQuestions(copy);
            }}
          >
            <option value="mc">Multiple Choice</option>
            <option value="id">Identification</option>
          </select>

          {q.type === "mc" &&
            q.choices?.map((choice: string, ci: number) => (
              <div key={ci} className="flex gap-2 mb-1">
                <input
                  className="flex-1 border-2 rounded p-2"
                  placeholder={`Choice ${ci + 1}`}
                  value={choice}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[i].choices![ci] = e.target.value;
                    setQuestions(copy);
                  }}
                />
                <button
                  type="button"
                  className="bg-[#87FDA8] text-black font-medium px-2 rounded border-2 border-black"
                  onClick={() => addChoice(i)}
                >
                  + Choice
                </button>
              </div>
            ))}

          <input
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
        onClick={handleUpdate}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Update Quiz
      </button>
    </div>
  );
}
