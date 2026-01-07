import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen bg-[#FCFDE8] overflow-hidden">
      
      {/* Blobs */}
      <img src="blobs/blob1.svg" alt="" className="absolute -top-10 -left-10 w-[700px]" />
      <img src="blobs/blob3.svg" alt="" className="absolute -top-10 -right-10 w-[330px]" />
      <img src="blobs/blob2.svg" alt="" className="absolute -bottom-5 w-full" />
      <div className="absolute top-6 left-8">
       <img src="logo/QuizappLogo.svg" alt="" className="w-18" />
</div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">

        <h1 className="text-7xl font-black">
          <span className="text-green-400/80 font-sans ">Welcome to </span>
          <span className="text-black font-sans">Quizapp.</span>
        </h1>

        <p className="mt-4 font-sans font-medium  text-gray-700">
          Think fast, choose wisely, and claim your best score today.
        </p>

        <div className="flex gap-8 mt-8">
          <button
            onClick={() => navigate("/student/login")}
            className="px-8 py-3 bg-[#87FDA8] border-2 text-black font-sans font-medium border-black rounded-xl hover:scale-101 transition"
          >
            Login as Student
          </button>

          <button
            onClick={() => navigate("/instructor/login")}
            className="px-8 py-3 bg-[#87FDA8] text-black font-sans font-medium border-2 border-black rounded-xl hover:scale-101 transition"
          >
            Login as Instructor
          </button>
        </div>
      </div>
    </div>
  );
}
