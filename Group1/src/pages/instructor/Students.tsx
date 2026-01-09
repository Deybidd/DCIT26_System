import { useEffect, useState } from "react";
import { api } from "@/api/api";

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Student {
  name: string;
  yearSection: string;
}

interface TopAchiever {
  id: string;
  name: string;
  score?: number;
}

export default function Students() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [topAchievers, setTopAchievers] = useState<TopAchiever[]>([]);

  // Fetch all subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const instructorEmail = localStorage.getItem("instructorEmail");
        const res = await api.get(`/subjects?instructorEmail=${instructorEmail}`);
        setSubjects(res.data);
        if (res.data.length > 0) setSelectedSubject(res.data[0].code);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch students whenever selectedSubject changes
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchStudents = async () => {
  try {
    const res = await api.get(`/subjects/${selectedSubject}/students`);
    // res.data is now an array of student objects with name and yearSection
    setStudents(res.data);
  } catch (err) {
    console.error("Failed to fetch students", err);
    setStudents([]);
  }
};

    const fetchTopAchievers = async () => {
      try {
        const res = await api.get(`/subjects/${selectedSubject}/top-achievers`);
        setTopAchievers(res.data);
      } catch (err) {
        console.error("Failed to fetch top achievers", err);
        setTopAchievers([]);
      }
    };

    fetchStudents();
    fetchTopAchievers();
  }, [selectedSubject]);

  return (
    <div className="flex flex-col h-screen">
      <h1 className="bg-[#FEFFF4] text-3xl text-black font-extrabold font-sans p-9">
        Students
      </h1>
      <hr className="h-1 w-full bg-black" />

      <div className="flex-1 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-40 my-15 mx-30">
        {/* NUMBER OF STUDENTS PANEL */}
        <div className="bg-white rounded-lg shadow-lg px-10 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-black font-bold font-sans">No. of Students</h1>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border-2 rounded p-2"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <ul className="text-black font-sans max-h-125 overflow-y-auto space-y-2">
            {students.length === 0 ? (
              <li>No students enrolled.</li>
            ) : (
              students.map((s, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.9167 0.5C7.40204 0.5 0.5 7.40204 0.5 15.9167C0.5 24.4313 7.40204 31.3333 15.9167 31.3333C24.4313 31.3333 31.3333 24.4313 31.3333 15.9167C31.3333 7.40204 24.4313 0.5 15.9167 0.5Z"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h1>{s.name}</h1>
                  </div>
                  <h1>{s.yearSection}</h1>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* TOP ACHIEVERS PANEL */}
        <div className="bg-[#F4FFBC] rounded-lg shadow-lg px-10 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-black font-bold font-sans">
              Top Achievers of the Month
            </h1>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border-2 rounded p-2 border-black color-black text-black"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <ul className="text-black font-sans max-h-125 overflow-y-auto space-y-2">
            {topAchievers.length === 0 ? (
              <li>No top achievers yet.</li>
            ) : (
              topAchievers.map((s) => (
                <li key={s.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.9167 0.5C7.40204 0.5 0.5 7.40204 0.5 15.9167C0.5 24.4313 7.40204 31.3333 15.9167 31.3333C24.4313 31.3333 31.3333 24.4313 31.3333 15.9167C31.3333 7.40204 24.4313 0.5 15.9167 0.5Z"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h1>{s.name}</h1>
                  </div>
                  <h1>{s.score?.toFixed(2)}</h1>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
