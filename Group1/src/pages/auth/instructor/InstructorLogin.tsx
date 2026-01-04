import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/api";

export default function InstructorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const res = await api.post("/instructors/login", { email, password });

      if (res.data.message === "Login successful") {
        localStorage.setItem("instructorLoggedIn", "true");
        navigate("/instructor");
      } else {
        alert("Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl text-black font-bold mb-6">Instructor Login</h2>

        <input
          type="email"
          className="w-full border border-black text-black p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border border-black text-black p-2 mb-4 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500"
        >
          Login
        </button>

        <p
          className="text-sm mt-4 text-center text-black cursor-pointer hover:underline"  
        >
          Don't have an account?{" "} 
          <span
          className="text-blue-600 cursor-pointer hover:underline" 
          onClick={() => navigate("/instructor/register")}>
           
            Register here
            </span>
        </p>
      </div>
    </div>
  );
}
