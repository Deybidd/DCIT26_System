import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/api/api";

export default function InstructorRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    course: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.course ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/instructors/register", {
        first_name: form.firstName,
        middle_name: form.middleName,
        last_name: form.lastName,
        course: form.course,
        email: form.email,
        password: form.password,
      });

      if (res.data.message === "Instructor registered successfully") {
        alert("Registration successful!");
        navigate("/instructor/login");
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

          <input name="firstName" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="First Name" />
          <input name="middleName" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="Middle Name (optional)" />
          <input name="lastName" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="Last Name" />

          <select name="course" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white">
            <option value="">Select Course</option>
            <option value="BSCS">BSCS</option>
            <option value="BSIT">BSIT</option>
          </select>

          <input name="email" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="Email" />
          <input type="password" name="password" onChange={handleChange} className="w-full p-2 mb-3 border-2 rounded bg-white" placeholder="Password" />
          <input type="password" name="confirmPassword" onChange={handleChange} className="w-full p-2 mb-6 border-2 rounded bg-white" placeholder="Confirm Password" />

          <button onClick={handleRegister} className="w-full bg-[#87FDA8] border-2 border-black py-3 rounded-xl font-semibold">
            Register
          </button>

          <p className="text-sm mt-4 text-center text-black">
            Already have an account?{" "}
            <span
              className="text-green-600 cursor-pointer hover:underline font-medium"
              onClick={() => navigate("/instructor/login")}
            >
              Login here
            </span>
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("http://localhost:5173/")}
          className="absolute bottom-6 -left-8 z-10 bg-[#87FDA8] bg-opacity-70 hover:bg-opacity-100 text-black font-semibold py-2 px-4 rounded-full shadow border-2 cursor-pointer hover:bg-emerald-400"
        >
          &larr; Back to Landing Page
        </button>

        {/* Illustration Panel */}
        <div className="ml-auto bg-[#87FDA8] p-30 mr-5 rounded-4xl border-3 border-black">
          <img src="/illustrations/teacher.svg" className="w-[450px]" />
        </div>
      </div>
    </div>
  );
}
