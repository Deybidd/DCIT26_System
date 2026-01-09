import { useState, useEffect } from "react";
import { api } from "@/api/api"; // your Axios instance
import type { InstructorSubjects } from "@/components/instructor/InstructorSubjects";

export default function InstructorSubjectsPage() {
	const instructorEmail = localStorage.getItem("instructorEmail") || "";
	const [subjects, setSubjects] = useState<InstructorSubjects[]>([]);
	const [form, setForm] = useState({
		name: "",
		code: "",
		description: "",
		number_of_students: 0,
	});
	const [showForm, setShowForm] = useState(false);
	const [message, setMessage] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);

	// Fetch subjects
	const fetchSubjects = async () => {
		try {
			const res = await api.get(`/subjects?instructorEmail=${instructorEmail}`);
			setSubjects(res.data);
		} catch (err) {
			console.error("Failed to fetch subjects", err);
		}
	};

	useEffect(() => {
		fetchSubjects();
	}, []);

	// Handle input change
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Handle form submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingId) {
				// Edit mode
				await api.put(`/subjects/${editingId}`, {
					...form,
					instructor_email: instructorEmail,
				});
				setEditingId(null);
				setMessage("Subject updated successfully!");
			} else {
				// Create mode
				await api.post("/subjects/", {
					...form,
					instructor_email: instructorEmail,
				});
				setMessage("Subject created successfully!");
			}
			setForm({ name: "", code: "", description: "", number_of_students: 0 });
			setShowForm(false);
			fetchSubjects();
		} catch (err) {
			console.error("Failed to save subject", err);
			setMessage("Failed to save subject");
		}
	};

	return (
		<div className="flex flex-col h-screen">
			<h1 className="bg-[#FEFFF4] font-sans text-3xl text-black font-extrabold p-9">
				Subjects
			</h1>
			<hr className="h-1 w-full bg-black" />

			<div className="bg-white flex flex-col w-3/4 h-3/4 pb-4 mx-auto my-auto rounded-lg shadow-lg overflow-hidden">
				<div className="flex justify-between p-4 shrink-0">
					<h1 className="text-2xl font-bold font-sans text-black">
						Subject List
					</h1>

					<button
						onClick={() => setShowForm(!showForm)}
						className=" bg-[#87FDA8] hover:bg-emerald-400 cursor-pointer border-2 border-black text-black font-sans px-4 py-2 rounded-lg font-semibold"
					>
						{showForm ? "Cancel" : "Add Subject"}
					</button>
				</div>

				{/* Subject List Container */}
				<div className="flex-1 overflow-hidden">
					{subjects.length === 0 ? (
						<p className="text-black mx-auto my-auto text-center">
							No subjects found. Click "Add Subject" to create one!
						</p>
					) : (
						<ul className="max-h-full overflow-y-auto text-black p-2 pb-4 grid grid-cols-3">
							{subjects.map((s) => (
								<li
									key={s.id}
									className="p-3 m-2 border-2 bg-[#87FDA8] rounded-2xl shadow hover:shadow-lg transition relative"
								>
									<div className="flex flex-col h-full">
										{/* Top row: Name/code on left, student count on right */}
										<div className="flex justify-between items-start mb-2">
											<div className="text-left">
												<strong className="text-lg">{s.name}</strong> ({s.code})
											</div>
											<div className="text-right">
												<p className="text-sm">
													Students: {s.number_of_students}
												</p>
											</div>
										</div>

										{/* Bottom row: Description on left, buttons on right */}
										<div className="flex justify-between items-end flex-1">
											<div className="text-left flex-1">
												{s.description && (
													<p className="text-sm text-black">{s.description}</p>
												)}
											</div>
											<div className="flex gap-2 ml-2">
												<button
													onClick={() => {
														setForm({
															name: s.name,
															code: s.code,
															description: s.description || "",
															number_of_students: s.number_of_students,
														});
														setShowForm(true);
														setEditingId(s.id); // track which subject is being edited
													}}
													className="bg-white text-black rounded border-2 border-black cursor-pointer hover:bg-green-100 text-sm px-2 py-1"
												>
													Edit
												</button>

												<button
													onClick={async () => {
														if (
															!confirm(
																`Are you sure you want to delete ${s.name}?`
															)
														)
															return;
														try {
															await api.delete(`/subjects/${s.id}`);
															fetchSubjects();
														} catch (err) {
															console.error("Failed to delete", err);
														}
													}}
													className="bg-red-500 text-white rounded border-2 border-black cursor-pointer hover:bg-red-700 text-sm px-2 py-1"
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				{showForm && (
					<div className="fixed bottom-20 right-6 w-80 bg-[#87FDA8] p-4 border-2 border-black text-black font-sans rounded shadow-md z-50">
						<h2 className="text-lg font-semibold mb-3">Create New Subject</h2>
						<form onSubmit={handleSubmit} className="flex flex-col gap-3">
							<div className="flex flex-col">
								<label className="text-sm font-medium mb-1">Subject Name</label>
								<input
									type="text"
									name="name"
									placeholder="Enter subject name"
									value={form.name}
									onChange={handleChange}
									required
									className="border p-2 rounded"
								/>
							</div>

							<div className="flex flex-col">
								<label className="text-sm font-medium mb-1">Subject Code</label>
								<input
									type="text"
									name="code"
									placeholder="Enter subject code"
									value={form.code}
									onChange={handleChange}
									required
									className="border p-2 rounded"
								/>
							</div>

							<div className="flex flex-col">
								<label className="text-sm font-medium mb-1">
									Subject Description
								</label>
								<textarea
									name="description"
									placeholder="Enter subject description"
									value={form.description}
									onChange={handleChange}
									className="border p-2 rounded resize-none"
								/>
							</div>

							<div className="flex flex-col">
								<label className="text-sm font-medium mb-1">
									Number of Students
								</label>
								<span className="text-xs text-gray-500 mb-1">
									(max no. of student that can enroll is 60)
								</span>
								<input
									type="number"
									name="number_of_students"
									placeholder="Enter number of students"
									value={form.number_of_students}
									onChange={handleChange}
									min={0}
									max={60}
									className="border p-2 rounded"
								/>
							</div>

							<button
								type="submit"
								className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
							>
								Create
							</button>

							{message && (
								<p className="text-sm text-green-600 mt-1">{message}</p>
							)}
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
