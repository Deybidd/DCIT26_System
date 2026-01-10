import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { User, Mail, Hash } from "lucide-react"; // Icons

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Student {
  name: string;
  yearSection: string;
  email?: string;
  studentNumber?: string;
}

export default function Students() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const instructorEmail = localStorage.getItem("instructorEmail");
        const res = await api.get(`/subjects?instructorEmail=${instructorEmail}`);
        setSubjects(res.data);
        if (res.data.length > 0) setSelectedSubject(res.data[0].code);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch students and their info when selectedSubject changes
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchStudents = async () => {
      try {
        const studentsRes = await api.get(`/subjects/${selectedSubject}/students`);
        const studentsData: Student[] = studentsRes.data;

        // Fetch email and student number for each student
        const detailedStudents = await Promise.all(
          studentsData.map(async (s: Student) => {
            try {
              const infoRes = await api.get(`/students/me?email=${s.email}`);
              return {
                ...s,
                email: infoRes.data.email || "N/A",
                studentNumber: infoRes.data.studentNumber || "N/A",
              };
            } catch {
              return {
                ...s,
                email: "N/A",
                studentNumber: "N/A",
              };
            }
          })
        );

        setStudents(detailedStudents);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [selectedSubject]);

  return (
    <div className="ml-60 font-sans text-black flex flex-col h-screen">
      <h1 className="bg-[#FEFFF4] text-black font-sans text-3xl font-extrabold p-9">
				Quizzes
			</h1>
			<hr className="h-1 w-full bg-black mb-10" />
    
      <div className="rounded-lg bg-white shadow-lg p-8 h-full mx-30 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Enrolled Students</h2>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border-2 border-black w-50 rounded-lg p-2"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-4 p-4 pr-4 max-h-[600px] overflow-y-auto">
          {students.length === 0 ? (
            <li className="text-gray-500">No students enrolled.</li>
          ) : (
            students.map((s) => (
              <li
                key={s.email || s.studentNumber || Math.random()}
                className="flex justify-between border-2 border-black items-center rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col">
                  <span className="font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-700" />
                    {s.name}
                  </span>
                  <span className="text-gray-700 font-regular">{s.yearSection}</span>
                </div>

                <div className="flex flex-col items-end text-base font-regular text-gray-700">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {s.email || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    {s.studentNumber || "N/A"}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
