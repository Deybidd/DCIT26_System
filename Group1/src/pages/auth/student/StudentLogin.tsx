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
      // Save login session
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
    <div className="h-screen flex items-center justify-center ">
      <div className="bg-green-300 p-8 rounded-xl shadow w-96 ">
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
          className="w-full bg-white text-black my-5 py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-black mt-2 text-center ">
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

    
  );

  
}
