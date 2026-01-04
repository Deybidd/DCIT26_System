import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/api";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/students/login", { email, password });
      if (res.data.message === "Login successful") {
        localStorage.setItem("studentLoggedIn", "true");
        navigate("/student");
      } else {
        alert("Invalid credentials");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#FCFDE8]">

      {/* Blobs */}
      <img src="/blobs/blob1.svg" className="absolute -top-10 -left-10 w-[700px]" />
      <img src="/blobs/blob3.svg" className="absolute -top-10 -right-10 w-[330px]" />
      <img src="/blobs/blob2.svg" className="absolute -bottom-5 w-full" />

      {/* Logo */}
      <div className="absolute top-6 left-8">
        <img src="/logo/QuizappLogo.svg" className="w-20" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-green-300 p-8 rounded-xl shadow w-96">
          <h2 className="text-xl text-black font-bold mb-4">Student Login</h2>

          <input
            className="w-full text-black bg-white border border-black p-2 mb-3 rounded-md"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full bg-white text-black border border-black p-2 mb-3 rounded-md"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-white text-black my-5 py-2 rounded hover:bg-gray-200"
          >
            Login
          </button>

          <p className="text-sm text-black mt-2 text-center">
            Don’t have an account yet?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/student/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
