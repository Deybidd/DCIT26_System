import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StudentRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthdate: "",
    yearSection: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (
      !form.studentNumber ||
      !form.firstName ||
      !form.lastName ||
      !form.birthdate ||
      !form.yearSection
    ) {
      alert("Please fill all required fields");
      return;
    }

    // temporary save before next step (email/password page)
    localStorage.setItem("studentRegisterData", JSON.stringify(form));
    navigate("/student/register/credentials");
  };

  return (
    <div className="relative h-screen bg-[#FCFDE8] overflow-hidden">

      <img src="/blobs/blob1.svg" className="absolute -top-10 -left-10 w-[560px]" />

      <div className="absolute top-6 left-8">
       <img src="/logo/QuizappLogo.svg" className="w-18" />
</div>

      {/* Form Section */}
      <div className="relative z-10 left-16 flex h-full items-center px-20 font-sans text-black">
        <div className="w-[400px]">

          <h2 className="text-2xl text-black font-bold mb-6">Create an account</h2>

          <input
            name="studentNumber"
            value={form.studentNumber}
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded border-2 text-black bg-white"
            placeholder="Student Number"
          />

          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded border-2 bg-white"
            placeholder="First Name"
          />

          <input
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded border-2 bg-white"
            placeholder="Middle Name (optional)"
          />

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded border-2 bg-white"
            placeholder="Last Name"
          />

          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded border-2 bg-white"
          />

          <select
            name="yearSection"
            value={form.yearSection}
            onChange={handleChange}
            className="w-full p-2 mb-6 rounded border-2 bg-white"
          >
            <option value="">Year & Section</option>
            <option value="3-1">3-1</option>
            <option value="3-2">3-2</option>
            <option value="3-3">3-3</option>
            <option value="3-4">3-4</option>
            <option value="3-5">3-5</option>
          </select>

          <button
            onClick={handleNext}
            className="w-full bg-[#87FDA8] text-black font-semibold border-2 border-black py-3 rounded-xl hover:bg-emerald-400 transition"
          >
            Next
          </button>
        </div>

        {/* Illustration Panel */}
        <div className="ml-auto bg-[#87FDA8] p-30 m-3 rounded-4xl border-3 border-black ">
          {/* Container SVG background */}
    
          <img src="/illustrations/scientist.svg" className="w-[450px]" />
        </div>
      </div>
    </div>
  );
}
