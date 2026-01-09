import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Users, X } from "lucide-react";

interface Quiz {
	id: string;
	title: string;
	description?: string;
	deadline: string;
	questions: any[];
	subject_code: string;
	graded?: boolean;
	_id?: string;
}

interface Response {
	student_email: string;
	correct_count: number;
	yearSection: string;
}

interface StudentDetail {
	name: string;
	score: number;
	violations: number;
	submitted_at: string;
}

export default function InstructorQuizzes() {
	const instructorEmail = localStorage.getItem("instructorEmail") || "";
	const navigate = useNavigate();

	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [needsGrading, setNeedsGrading] = useState<Record<string, boolean>>({});
	const [responsesMap, setResponsesMap] = useState<Record<string, Response[]>>(
		{}
	);
	const [showResponsesFor, setShowResponsesFor] = useState<string | null>(null);
	const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(
		null
	);
	const [modalLoading, setModalLoading] = useState(false);
	const [selectedQuizResponses, setSelectedQuizResponses] = useState<
		StudentDetail[]
	>([]);
	const [showModal, setShowModal] = useState(false);

	const fetchQuizzes = async () => {
		if (!instructorEmail) return;

		setLoading(true);
		try {
			const res = await api.get(`/quizzes/instructors`, {
				params: { instructor_email: instructorEmail },
			});

			setQuizzes(res.data);

			const respMap: Record<string, Response[]> = {};
			const gradeMap: Record<string, boolean> = {};

			for (const q of res.data) {
				const quizId = q.id || q._id;

				try {
					const resp = await api.get(`/quizzes/responses/count/${quizId}`);
					respMap[quizId] = resp.data.responses;
				} catch (err) {
					console.error(`Failed to fetch responses for quiz ${quizId}:`, err);
					respMap[quizId] = [];
				}

				try {
					const need = await api.get(`/quizzes/${quizId}/needs-grading`);
					gradeMap[quizId] = need.data.needs_grading;
				} catch (err) {
					console.error(
						`Failed to fetch grading status for quiz ${quizId}:`,
						err
					);
					gradeMap[quizId] = false;
				}
			}

			setResponsesMap(respMap);
			setNeedsGrading(gradeMap);
		} finally {
			setLoading(false);
		}
	};

	// Delete quiz
	const handleDelete = async (quiz: Quiz) => {
		const quizId = quiz.id || quiz._id;
		if (!quizId || !confirm("Delete this quiz?")) return;
		try {
			await api.delete(`/quizzes/${quizId}`);
			alert("Quiz deleted successfully.");
			fetchQuizzes();
		} catch (err) {
			console.error("Failed to delete quiz", err);
			alert("Failed to delete quiz.");
		}
	};

	// Release score
	const handleReleaseScore = async (quiz: Quiz) => {
		const quizId = quiz.id || quiz._id;
		if (!quizId) return;
		try {
			await api.post(`/quizzes/release/${quizId}`);
			alert("Scores released successfully!");
			fetchQuizzes();
		} catch (err) {
			console.error("Failed to release scores", err);
			alert("Failed to release scores.");
		}
	};

	const handleShowDetails = async (quizId: string) => {
		setModalLoading(true);
		setShowModal(true);
		try {
			const res = await api.get(`/quizzes/responses/count/${quizId}`);
			setSelectedQuizResponses(res.data.responses);
		} finally {
			setModalLoading(false);
		}
	};

	useEffect(() => {
		fetchQuizzes();
	}, []);

	return (
		<div className="flex flex-col h-screen font-sans">
			<h1 className="bg-[#FEFFF4] text-black font-sans text-3xl font-extrabold p-9">
				Quizzes
			</h1>
			<hr className="h-1 w-full bg-black" />

			<div className="bg-white flex flex-col w-3/4 h-3/4 mx-auto my-auto pb-4 rounded-lg shadow-lg overflow-hidden">
				<div className="flex justify-between items-center m-4">
					<p className="font-bold text-2xl text-black">
						{quizzes.length} Quizzes
					</p>
					<button
						onClick={() => navigate("/instructor/quizzes/create")}
						className="bg-[#87FDA8] text-black border-2 border-black px-4 py-2 rounded-lg font-semibold hover:bg-emerald-400 cursor-pointer"
					>
						+ Add Quiz
					</button>
				</div>
				<div className="flex-1 overflow-hidden">
					{loading ? (
						<p>Loading quizzes...</p>
					) : error ? (
						<p>{error}</p>
					) : quizzes.length === 0 ? (
						<p className="text-black text-center">No quizzes found.</p>
					) : (
						<div className="grid grid-cols-3 gap-4 m-4 text-black overflow-y-auto max-h-full">
							{quizzes.map((quiz) => {
								const quizId = quiz.id || quiz._id;
								if (!quizId) return null;
								const responses = responsesMap[quizId] || [];
								return (
									<div
										key={quizId}
										className="p-5 rounded-xl shadow border bg-[#FFE7B3] flex flex-col justify-between relative"
									>
										{/* Edit / Delete */}
										<div className="absolute top-2 right-2 flex gap-2">
											<button
												onClick={() =>
													navigate(`/instructor/quizzes/edit/${quizId}`)
												}
												title="Edit Quiz"
												className="hover:bg-black/10 rounded p-1 cursor-pointer"
											>
												<Edit2 size={20} color="black" />
											</button>
											<button
												onClick={() => handleDelete(quiz)}
												title="Delete Quiz"
												className="hover:bg-black/10 rounded p-1 cursor-pointer"
											>
												<Trash2 size={20} color="black" />
											</button>
										</div>

										<div>
											<h3 className="font-bold text-2xl">{quiz.title}</h3>
											<p className="text-sm font-regular mt-3">
												{quiz.description || "No description provided"}
											</p>
										</div>

										{/* Footer */}
										<div className="flex justify-between items-center mt-4">
											<span className="font-bold text-lg">
												{quiz.questions.length}{" "}
												<span className="font-medium text-xs">items</span>
											</span>
											<div className="flex items-center gap-2">
												<button
													onClick={() =>
														setShowResponsesFor(
															showResponsesFor === quizId ? null : quizId
														)
													}
													className="flex items-center gap-1 bg-white border px-3 py-1 rounded"
												>
													<Users size={14} /> {responses.length}
												</button>

												{needsGrading[quizId] && (
													<>
														<button
															onClick={() => handleShowDetails(quizId)}
															className="bg-blue-300 border border-black text-black font-semibold px-2 py-2 rounded text-xs hover:bg-blue-400 cursor-pointer"
														>
															View Details
														</button>
														<button
															onClick={() => handleReleaseScore(quiz)}
															className="bg-[#87FDA8] border border-black text-black font-semibold px-2 py-2 rounded text-xs hover:bg-green-400 cursor-pointer"
														>
															Release Score
														</button>
													</>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
				{showModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-black">
									Quiz Responses
								</h2>
								<button
									onClick={() => setShowModal(false)}
									className="text-gray-500 hover:text-gray-700"
								>
									<X size={24} />
								</button>
							</div>

							{modalLoading ? (
								<p className="text-center text-gray-600">Loading...</p>
							) : selectedQuizResponses.length === 0 ? (
								<p className="text-center text-gray-600">No responses found.</p>
							) : (
								<div className="space-y-4">
									{selectedQuizResponses.map((response: any, idx: number) => (
										<div key={idx} className="border p-4 rounded bg-gray-50">
											<p className="font-semibold text-black">
												{response.student_name}
											</p>
											<p className="text-sm text-gray-600">
												Year/Section: {response.yearSection}
											</p>
											<p className="text-sm text-gray-600">
												Score: {response.correct_count}
											</p>
											<p className="text-sm text-gray-600">
												Penalty Count: {response.tab_switches}
											</p>
											<p className="text-sm text-gray-600">
												Submitted:{" "}
												{new Date(response.submitted_at).toLocaleString()}
											</p>
										</div>
									))}
								</div>
							)}

							<button
								onClick={() => setShowModal(false)}
								className="w-full mt-6 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer font-semibold"
							>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
