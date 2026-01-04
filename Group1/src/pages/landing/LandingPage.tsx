import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <h1 className="text-3xl font-bold">Challenge Your Mind, Track Your Progress</h1>
      <p className="text-gray-600">Choose how you want to continue.</p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/student/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Login as Student
        </button>

        <button
          onClick={() => navigate("/instructor/login")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl"
        >
          Login as Instructor
        </button>
      </div>
    </div>
  );
}
