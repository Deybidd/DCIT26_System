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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (editingId) {
      // Edit mode
      await api.put(`/subjects/${editingId}`, { ...form, instructor_email: instructorEmail });
      setEditingId(null);
      setMessage("Subject updated successfully!");
    } else {
      // Create mode
      await api.post("/subjects/", { ...form, instructor_email: instructorEmail });
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
      <div className=" font-sans text-black -mt-10">
        <h1 className="text-2xl font-bold mb-4 bg-white p-8 px-20 border-b-2">  Subjects</h1>
     <div className="bg-white h-130 w-250 absolute left-99 p-6 rounded-2xl shadow-md border mt-10">
       

      {/* Subjects List */}
      <h1 className="text-2xl font-bold mb-4">Subjects List</h1>
      {subjects.length === 0 ? (
        <p>No subjects found. Click "Add Subject" to create one!</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {subjects.map((s) => (
  <li
    key={s.id}
    className="p-4 border bg-[#87FDA8] gap-5 w-2/3 h-7/3 rounded-2xl shadow hover:shadow-lg transition relative"
  >
    <strong className="text-lg">{s.name}</strong> ({s.code})
    
    {s.description && <p className=" mt-6 text-sm text-gray-600">{s.description}</p>}

    {/* Edit & Delete Buttons */}
    <div className="flex gap-2 mt-1 bottom-5 absolute">
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
        className="bg-white text-black px-4 py-1 rounded border-2 border-black hover:bg-green-100 text-sm"
      >
        Edit
      </button>

      <button
        onClick={async () => {
          if (!confirm(`Are you sure you want to delete ${s.name}?`)) return;
          try {
            await api.delete(`/subjects/${s.id}`);
            fetchSubjects();
          } catch (err) {
            console.error("Failed to delete", err);
          }
        }}
        className="bg-red-500 text-white px-3 py-1 rounded border-2 border-black hover:bg-red-700 text-sm"
      >
        Delete
      </button>

      <p className="ml-18 text-sm">Students Enrolled: {s.number_of_students}</p>
    </div>
    
       <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "Add Subject"}
      </button>

  </li>
))}
    
        </ul>
      )}

      {/* Add Subject Button */}
    
      {showForm && (
        <div className="fixed bottom-20 right-6 w-80 bg-white p-4 border rounded shadow-md z-50">
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
              <label className="text-sm font-medium mb-1">Subject Description</label>
              <textarea
                name="description"
                placeholder="Enter subject description"
                value={form.description}
                onChange={handleChange}
                className="border p-2 rounded resize-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Number of Students</label>
              <span className="text-xs text-gray-500 mb-1">(max no. of student that can enroll is 60)</span>
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

            {message && <p className="text-sm text-green-600 mt-1">{message}</p>}
          </form>
        </div>
      )}
    </div>
    </div>
  );
}
