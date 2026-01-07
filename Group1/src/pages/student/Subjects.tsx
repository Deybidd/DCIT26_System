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
  const [messageType, setMessageType] = useState<"success" | "error">("success");


  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);
  
  // Handle unenroll
 const handleUnenroll = async (subjectId: string, subjectName: string) => {
  try {
    await api.put(`/subjects/unenroll/${subjectId}`, { student_email: studentEmail });
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

  try {
    const subject = subjects.find((s) => s.code === enrollCode);

    if (!subject) {
      setMessage("Subject code not found.");
      setMessageType("error");
      return;
    }
    if (subject.students.includes(studentEmail)) {
      setMessage("Already enrolled.");
      setMessageType("error");
      return;
    }
    if (subject.number_of_students >= 60) {
      setMessage("This subject is full.");
      setMessageType("error");
      return;
    }

    await api.put(`/subjects/enroll/${subject.id}`, { student_email: studentEmail });

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
    <div className="p-6 ml-65 flex-col h-screen">
      <h1 className="text-2xl text-black font-bold mb-4">My Subjects</h1>

      {/* Enrollment Section */}
      <div className="mb-6 p-4 text-black bg-white rounded shadow flex flex-col w-100 gap-2">
        <h2 className="font-semibold">Enroll in a Subject</h2>
        <input
          type="text"
          placeholder="Enter subject code"
          value={enrollCode}
          onChange={(e) => setEnrollCode(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleEnroll}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-1"
        >
          Enroll
        </button>
        {message && (
  <p
    className={`text-sm mt-1 ${
      messageType === "success" ? "text-green-500" : "text-red-500"
    }`}
  >
    {message}
  </p>
)}
      </div>

      {/* Enrolled Subjects */}
      {subjects.filter((s) => s.students.includes(studentEmail)).length === 0 ? (
        <p>You are not enrolled in any subjects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects
            .filter((s) => s.students.includes(studentEmail))
            .map((s) => (
              <div key={s.id} className="bg-white text-black p-4 rounded shadow relative">
                <h2 className="font-bold text-lg">{s.name}</h2>
                <p>Code: {s.code}</p>
                <p>Instructor: {s.instructor_email}</p>
                <p>Students Enrolled: {s.number_of_students}</p>
                {s.description && <p className="text-sm text-gray-600">{s.description}</p>}

                 <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
    Enrolled
  </span>

  {/* Unenroll Button */}
  <button
    onClick={() => handleUnenroll(s.id, s.name)}
    className="mt-3 bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-500"
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
