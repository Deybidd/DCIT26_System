import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/api";

export default function InstructorRegister() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!firstName || !lastName || !course || !email || !password || !confirmPassword) {
      alert("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await api.post("/instructors/register", {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        course,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/instructor/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl text-black font-bold mb-6">Instructor Registration</h2>

        <input
          className="w-full border border-black text-black p-2 mb-3 rounded"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="w-full border border-black text-black p-2 mb-3 rounded"
          placeholder="Middle Name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />

        <input
          className="w-full border border-black text-black p-2 mb-3 rounded"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <select
          className="w-full border border-black text-black p-2 mb-3 rounded"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          <option value="BSCS">BSCS</option>
          <option value="BSIT">BSIT</option>
        </select>

        <input
          type="email"
          className="w-full border border-black text-black p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border border-black text-black p-2 mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full border border-black text-black p-2 mb-4 rounded"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500"
        >
          Register
        </button>

        <p
          className="text-sm mt-4 text-center text-black cursor-pointer hover:underline"  
        >
          Already have an account?{" "} 
          <span
          className="text-blue-600 cursor-pointer hover:underline" 
          onClick={() => navigate("/instructor/login")}>
           
            Login here
            </span>
        </p>
      </div>
    </div>
  );
}
