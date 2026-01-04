import { useEffect, useState } from "react";
import { api } from "@/api/api";

interface Subject {
  subject_code: string;
  subject_name: string;
  instructor: string;
  students: string[];
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    api.get("/subjects").then((res) => setSubjects(res.data));
  }, []);

  return (
    <>
      <h1 className="text-2xl text-black font-bold mb-4">My Subjects</h1>

      <div className="grid grid-cols-3 gap-4">
        {subjects.map((s) => (
          <div key={s.subject_code} className="bg-white text-black p-4 rounded shadow">
            <h2 className="font-bold">{s.subject_name}</h2>
            <p>Code: {s.subject_code}</p>
            <p>Instructor: {s.instructor}</p>
            <p>Students: {s.students.length}</p>
          </div>
        ))}
      </div>
    </>
  );
}
