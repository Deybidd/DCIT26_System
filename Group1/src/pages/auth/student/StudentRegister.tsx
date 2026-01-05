import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/api/api";

export default function StudentRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthdate: "",
    yearSection: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (
      !form.studentNumber ||
      !form.firstName ||
      !form.lastName ||
      !form.birthdate ||
      !form.yearSection ||
      !form.email ||
      !form.password
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await api.post("/students/register", form);

      if (res.data.message === "Student registered successfully") {
        alert("Registration successful!");
        navigate("/student/login");
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="relative h-screen bg-[#FCFDE8] overflow-hidden">
      <img src="/blobs/blob1.svg" className="absolute -top-10 -left-10 w-[560px]" />

      <div className="absolute top-6 left-8">
        <img src="/logo/QuizappLogo.svg" className="w-18" />
      </div>

      <div className="relative z-10 left-18 flex h-full items-center px-20 font-sans text-black">
        <div className="w-[400px]">
          <h2 className="text-2xl font-bold mb-6">Create an account</h2>

          <input name="studentNumber" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="Student Number" />
          <input name="firstName" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="First Name" />
          <input name="middleName" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="Middle Name (optional)" />
          <input name="lastName" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="Last Name" />

          <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="w-full p-2 mb-3 rounded border-2 border-black bg-white text-black focus:outline-none focus:ring-0" style={{ colorScheme: "black", }} />

          <select name="yearSection" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white">
            <option value="">Year & Section</option>
            <option value="3-1">3-1</option>
            <option value="3-2">3-2</option>
            <option value="3-3">3-3</option>
            <option value="3-4">3-4</option>
            <option value="3-5">3-5</option>
          </select>

          <input name="email" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="Email" />
          <input type="password" name="password" onChange={handleChange} className="w-full p-2 mb-6 border-2 rounded bg-white" placeholder="Password" />

          <button onClick={handleRegister} className="w-full bg-[#87FDA8] border-2 border-black py-3 rounded-xl font-semibold">
            Register
          </button>
         <p
          className="text-sm mt-4 text-center text-black"  
        >
          Already have an account?{" "} 
          <span
          className="text-green-600 cursor-pointer hover:underline font-medium" 
          onClick={() => navigate("/student/login")}>
           
            Login here
            </span>
        </p>

        </div>

         {/* Back Button */}
      <button
        onClick={() => navigate("http://localhost:5173/")}
        className="absolute bottom-6 -left-8 z-10 bg-[#87FDA8] bg-opacity-70 hover:bg-opacity-100 text-black font-semibold py-2 px-4 rounded-full shadow border-2 cursor-pointer hover:bg-emerald-400     "
      >
        &larr; Back to Landing Page
      </button>
         
        {/* Illustration Panel */}
        <div className="ml-auto bg-[#87FDA8] p-30 mr-5 rounded-4xl border-3 border-black ">
    
          <img src="/illustrations/scientist.svg" className="w-[450px]" />
        </div>
      </div>
    </div>
  );
}
