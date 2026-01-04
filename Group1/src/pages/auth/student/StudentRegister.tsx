import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/api";

export default function StudentRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/students/register", {
        name,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/student/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="bg-green-200 p-8 rounded-xl shadow w-96 ">
        <h2 className="text-xl text-black font-bold mb-4">Student Registration</h2>

        <input
          className="w-full bg-white text-black border border-black p-2 mb-3 rounded-md"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full bg-white text-black border border-black p-2 mb-3 rounded-md"
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
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white my-5 py-2 rounded"
        >
          Register
        </button>

        <p className="text-sm text-black mt-2 text-center text-gray-600">
  Already have an account?{" "}
  <span
    className="text-blue-600 cursor-pointer hover:underline"
    onClick={() => navigate("/student/login")}
  >
    Login here
  </span>
</p>
      </div>
    </div>
  );
}
