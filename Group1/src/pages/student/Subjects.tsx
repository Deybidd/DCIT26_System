import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { User, Book, Users } from "lucide-react"; // icons

interface InstructorSubject {
	id: string;
	name: string;
	code: string;
	description?: string;
	number_of_students: number;
	instructor_email: string;
	students: string[];
}

export default function StudentSubjects() {
	const studentEmail = localStorage.getItem("studentEmail") || "";
	const [subjects, setSubjects] = useState<InstructorSubject[]>([]);
	const [enrollCode, setEnrollCode] = useState("");
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState<"success" | "error">("success");
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

	// Enroll student by code
	const handleEnroll = async () => {
		if (!enrollCode) return setMessage("Please enter a subject code."), setMessageType("error");
		if (!studentData?.studentNumber)
			return setMessage("Student data not loaded."), setMessageType("error");

		try {
			const subject = subjects.find((s) => s.code === enrollCode);
			if (!subject) return setMessage("Subject code not found."), setMessageType("error");
			if (subject.students.includes(studentData.studentNumber))
				return setMessage("Already enrolled."), setMessageType("error");
			if (subject.number_of_students >= 60)
				return setMessage("This subject is full."), setMessageType("error");

			await api.put(`/subjects/enroll/${subject.id}`, {
				student_id: studentData.studentNumber,
			});
			setMessage(`Successfully enrolled in ${subject.name}!`);
			setMessageType("success");
			setEnrollCode("");
			fetchSubjects();
		} catch (err: any) {
			setMessage(err.response?.data?.detail || "Failed to enroll.");
			setMessageType("error");
		}
	};

	// Unenroll student
	const handleUnenroll = async (subjectId: string, subjectName: string) => {
		if (!studentData?.studentNumber)
			return setMessage("Student data not loaded."), setMessageType("error");

		try {
			await api.put(`/subjects/unenroll/${subjectId}`, {
				student_id: studentData.studentNumber,
			});
			setMessage(`Unenrolled from ${subjectName}`);
			setMessageType("success");
			fetchSubjects();
		} catch (err: any) {
			setMessage(err.response?.data?.detail || "Failed to unenroll.");
			setMessageType("error");
		}
	};

	// Filter enrolled subjects
	const enrolledSubjects = subjects.filter(
		(s) => studentData?.studentNumber && s.students.includes(studentData.studentNumber)
	);

	return (
		<div className="ml-60 text-black flex flex-col h-screen overflow-y-auto font-sans p-6">
			<h1 className="bg-[#FEFFF4] text-3xl font-extrabold p-6 w-full">My Subjects</h1>
			<hr className="h-1 w-full bg-black mb-6" />

			{/* Enrollment Panel */}
			<div className="bg-white p-6 rounded-lg border-2 border-black shadow-md max-w-2xl mx-auto mb-6">
				<h2 className="flex items-center gap-2 font-semibold text-lg mb-2">
					<Book size={20} /> Enroll in a Subject
				</h2>
				<div className="flex flex-col sm:flex-row gap-2">
					<input
						type="text"
						placeholder="Enter subject code"
						value={enrollCode}
						onChange={(e) => setEnrollCode(e.target.value)}
						className="border-2 border-black rounded-lg p-2 flex-1"
					/>
					<button
						onClick={handleEnroll}
						className="bg-[#87FDA8] border-2 border-black rounded-lg p-2 font-semibold hover:bg-green-400"
					>
						Enroll
					</button>
				</div>
				{message && (
					<p
						className={`mt-2 font-semibold ${
							messageType === "success" ? "text-green-600" : "text-red-600"
						}`}
					>
						{message}
					</p>
				)}
			</div>

			{/* Enrolled Subjects Panel */}
			{/* Enrolled Subjects Panel */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-10 rounded-xl shadow-md h-full">
  {enrolledSubjects.length === 0 ? (
    <p className="text-center col-span-full">You are not enrolled in any subjects yet.</p>
  ) : (
    enrolledSubjects.map((s) => (
      <div
        key={s.id}
        className="bg-[#FFE7B3] border-1 border-black rounded-lg p-5 shadow-md relative flex flex-col justify-between min-h-[220px] max-h-[240px]"
      >
        <div className="overflow-hidden">
          <h2 className="font-bold text-xl flex items-center gap-1 mb-2 truncate">
            <Book size={18} /> {s.name}
          </h2>
          <p className="flex items-center gap-1 text-sm truncate">
            <span className="font-semibold">Code:</span> {s.code}
          </p>
          <p className="flex items-center gap-1 text-sm truncate">
            <User size={16} /> <span className="font-semibold">Instructor:</span> {s.instructor_email}
          </p>
          <p className="flex items-center gap-1 text-sm">
            <Users size={16} /> <span className="font-semibold">Students:</span> {s.number_of_students}
		</p>
         <p className="text-sm font-regular mt-3 break-words whitespace-normal">
												{s.description || "No description provided"}
						</p>
        </div>

        {/* Footer with Unenroll */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handleUnenroll(s.id, s.name)}
            className="bg-red-400/80 text-black border-1 border-black px-4 py-2 rounded hover:bg-red-500 font-semibold text-xs"
          >
            Unenroll
          </button>
        </div>

        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded border-1 border-black">
          Enrolled
        </span>
      </div>
    ))
  )}
</div>
		</div>
	);
}
