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
        localStorage.setItem("studentEmail", email);
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
     <img src="/blobs/blob1.svg" className="absolute -top-10 -left-10 w-[560px]" />
      

      {/* Logo */}
     <div className="absolute top-6 left-8">
       <img src="/logo/QuizappLogo.svg" className="w-18" />
</div>
      
      {/* Login Card */}
     <div className="relative z-10 left-16 flex h-full items-center px-20 font-sans text-black">
        <div className="w-[400px]"> 
          <h2 className="text-xl text-black font-bold mb-4">Student Login</h2>

          <input
            className="w-full text-black bg-white border-2 border-black p-2 mb-3 rounded-md"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full bg-white text-black border-2 border-black p-2 mb-3 rounded-md"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[#87FDA8] mt-5 text-black font-semibold border-2 border-black py-3 rounded-xl hover:bg-emerald-400 transition"
          >
            Login
          </button>

          <p className="text-sm text-black mt-2 text-center">
            Don’t have an account yet?{" "}
            <span
              className="text-green-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/student/register")}
            >
              Register here
            </span>
          </p>
        </div>

         {/* Back Button */}
      <button
        onClick={() => navigate("http://localhost:5173/")}
        className="absolute bottom-6 -left-6 z-10 bg-[#87FDA8] bg-opacity-70 hover:bg-opacity-100 text-black font-semibold py-2 px-4 rounded-lg shadow border-2 cursor-pointer hover:bg-emerald-400"
      >
        &larr; Back to Landing Page
      </button>
       {/* Illustration Panel */}
        <div className="ml-auto bg-[#87FDA8] p-25 m-3 rounded-4xl border-3 border-black ">
    
          <img src="/illustrations/student.svg" className="w-[490px]" />
        </div>
      </div>

      
    </div>
  );
}
