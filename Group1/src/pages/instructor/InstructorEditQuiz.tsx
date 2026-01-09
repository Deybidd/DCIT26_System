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
  type: "mc" | "id";
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
  const { id: quizId } = useParams();
  const instructorName = localStorage.getItem("instructorName") || "";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get(`/subjects?instructorEmail=${localStorage.getItem("instructorEmail")}`);
        setSubjects(res.data);
        if (res.data.length > 0 && !selectedSubject) setSelectedSubject(res.data[0].code);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      try {
        const res = await api.get(`/quizzes/edit/${quizId}`);
        const quiz: Quiz = res.data;

        setTitle(quiz.title);
        setDescription(quiz.description || "");
        setSelectedSubject(quiz.subject_code);

        // Convert deadline from "1-25-2026" to "2026-01-25" for date input
        if (quiz.deadline) {
          const [month, day, year] = quiz.deadline.split('-');
          const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          setDeadline(formattedDate);
        }

        // Ensure choices exist for mc questions
        const fixedQuestions = quiz.questions.map((q) => ({
          ...q,
          type: q.type || "mc",
          choices: q.choices || ["", ""],
        }));
        setQuestions(fixedQuestions);
      } catch (err) {
        console.error("Failed to fetch quiz", err);
        alert("Failed to load quiz data");
        navigate("/instructor/quizzes");
      }
    };
    fetchQuiz();
  }, [quizId]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", type: "mc", choices: ["", ""], answer: "" },
    ]);
  };

  const addChoice = (qIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      if (!copy[qIndex].choices) copy[qIndex].choices = [];
      copy[qIndex].choices.push("");
      return copy;
    });
  };

  const handleUpdate = async () => {
    if (!title || !deadline || !selectedSubject || questions.length === 0) {
      alert("Please complete all quiz fields");
      return;
    }

    try {
      await api.put(`/quizzes/${quizId}`, {
        title,
        description,
        deadline,
        subject_code: selectedSubject,
        created_by: instructorName,
        questions,
      });

      alert("Quiz updated successfully!");
      navigate("/instructor/quizzes");
    } catch (err) {
      console.error("Failed to update quiz", err);
      alert("Failed to update quiz");
    }
  };

  return (
		<div className="p-6 bg-[#87FDA8] w-3/6 max-w-2xl text-black rounded-2xl shadow-md mx-auto mt-8 mb-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
			<h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>

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

			<label className="font-medium mb-1 block">Deadline</label>
			<input
				type="date"
				className="border-2 p-2 rounded mb-6 w-full bg-white"
				value={deadline}
				onChange={(e) => setDeadline(e.target.value)}
			/>

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
							copy[i].type = e.target.value as "mc" | "id";
							setQuestions(copy);
						}}
					>
						<option value="mc">Multiple Choice</option>
						<option value="id">Identification</option>
					</select>

					{q.type === "mc" &&
						q.choices?.map((choice, ci) => (
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
