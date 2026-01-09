import { useEffect, useState } from "react";
import { api } from "@/api/api";

interface InstructorSubject {
	id: string;
	name: string;
	code: string;
	description?: string;
	number_of_students: number; // this is supposed to count enrolled students
	instructor_email: string;
	students: string[];
}

export default function StudentSubjects() {
	const studentEmail = localStorage.getItem("studentEmail") || "";
	const [subjects, setSubjects] = useState<InstructorSubject[]>([]);
	const [enrollCode, setEnrollCode] = useState("");
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState<"success" | "error">(
		"success"
	);
	const [studentData, setStudentData] = useState<any>(null);

	// Fetch all subjects
	const fetchSubjects = async () => {
		try {
			const res = await api.get("/subjects");
			setSubjects(res.data);
		} catch (err) {
			console.error("Failed to fetch subjects", err);
		}
	};

	// Fetch student data
	const fetchStudentData = async () => {
		try {
			const res = await api.get(`/students/me?email=${studentEmail}`);
			setStudentData(res.data);
		} catch (err) {
			console.error("Failed to fetch student data", err);
		}
	};

	useEffect(() => {
		fetchSubjects();
		fetchStudentData();
	}, []);

	// Handle unenroll
	const handleUnenroll = async (subjectId: string, subjectName: string) => {
		if (!studentData?.studentNumber) {
			setMessage("Unable to unenroll: Student data not loaded");
			setMessageType("error");
			return;
		}

		try {
			await api.put(`/subjects/unenroll/${subjectId}`, {
				student_id: studentData.studentNumber,
			});
			setMessage(`Successfully unenrolled from ${subjectName}`);
			setMessageType("success");
			fetchSubjects(); // refresh subjects list
		} catch (err: any) {
			console.error(err);
			setMessage(err.response?.data?.detail || "Failed to unenroll.");
			setMessageType("error");
		}
	};
	// Handle enrollment by code
	const handleEnroll = async () => {
		if (!enrollCode) {
			setMessage("Please enter a subject code.");
			setMessageType("error");
			return;
		}

		if (!studentData?.studentNumber) {
			setMessage("Unable to enroll: Student data not loaded");
			setMessageType("error");
			return;
		}

		try {
			const subject = subjects.find((s) => s.code === enrollCode);

			if (!subject) {
				setMessage("Subject code not found.");
				setMessageType("error");
				return;
			}
			if (subject.students.includes(studentData.studentNumber)) {
				setMessage("Already enrolled.");
				setMessageType("error");
				return;
			}
			if (subject.number_of_students >= 60) {
				setMessage("This subject is full.");
				setMessageType("error");
				return;
			}

			await api.put(`/subjects/enroll/${subject.id}`, {
				student_id: studentData.studentNumber,
			});

			setMessage(`Successfully enrolled in ${subject.name}!`);
			setMessageType("success");
			setEnrollCode("");
			fetchSubjects();
		} catch (err: any) {
			console.error(err);
			setMessage(err.response?.data?.detail || "Failed to enroll.");
			setMessageType("error");
		}
	};

	return (
		<div className="flex-col h-screen font-sans overflow-y-auto">
			<h1 className="bg-[#FEFFF4] font-sans text-3xl text-black font-extrabold p-8 w-full">
				My Subjects
			</h1>
			<hr className="h-1 w-full bg-black" />

			{/* Enrollment Section */}
			<div className="p-10 mx-auto my-4 text-black bg-white border-2 border-black rounded-lg shadow flex flex-col w-150 gap-2">
				<h2 className="font-semibold">Enroll in a Subject</h2>
				<input
					type="text"
					placeholder="Enter subject code"
					value={enrollCode}
					onChange={(e) => setEnrollCode(e.target.value)}
					className="border-2 border-black p-2 rounded-lg w-full"
				/>
				<button
					onClick={handleEnroll}
					className="bg-[#87FDA8] cursor-pointer font-semibold border-2 border-black text-black p-2 rounded-lg hover:bg-green-400 mt-1"
				>
					Enroll
				</button>
				{message && (
					<p
						className={`text-sm font-semibold mt-1 ${
							messageType === "success" ? "text-green-500" : "text-red-500"
						}`}
					>
						{message}
					</p>
				)}
			</div>

			{/* Enrolled Subjects */}
			{subjects.filter(
				(s) =>
					studentData?.studentNumber &&
					s.students.includes(studentData.studentNumber)
			).length === 0 ? (
				<p>You are not enrolled in any subjects yet.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
					{subjects
						.filter(
							(s) =>
								studentData?.studentNumber &&
								s.students.includes(studentData.studentNumber)
						)
						.map((s) => (
							<div
								key={s.id}
								className="bg-[#FFE7B3] border-2 border-black text-black p-5 w-100 rounded-lg shadow relative"
							>
								<h2 className="font-bold text-lg">{s.name}</h2>
								<p>
									<span className="font-semibold text-base">Code:</span>{" "}
									{s.code}
								</p>
								<p>
									<span className="font-semibold text-base">Instructor:</span>{" "}
									{s.instructor_email}
								</p>
								<p>
									<span className="font-semibold text-base">
										Students Enrolled:
									</span>{" "}
									{s.number_of_students}
								</p>
								{s.description && (
									<p className="text-sm font-regular text-gray-600">
										{s.description}
									</p>
								)}

								<span className="absolute top-3 right-3 border-2 border-black bg-green-500 text-white text-xs px-2 py-1 rounded">
									Enrolled
								</span>

								{/* Unenroll Button */}
								<button
									onClick={() => handleUnenroll(s.id, s.name)}
									className="mt-3 bg-red-400/80 text-black border-2 border-black text-sm px-4 font-semibold py-2 rounded cursor-pointer hover:bg-red-400"
								>
									Unenroll
								</button>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
