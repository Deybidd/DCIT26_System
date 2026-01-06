import { NavLink, useNavigate } from "react-router-dom";

export default function InstructorSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("instructorLoggedIn");
    navigate("/instructor/login");
  };

  return (
    <>
      {/* Fixed Sidebar */}
      <aside className="fixed font-sans top-0 left-0 w-60 bg-[#87FDA8] text-black p-5 flex flex-col justify-between h-screen">
        <div>
           <img src="/logo/QuizappLogo.svg" className="w-18 mb-10" />
          <h2 className="text-xl font-bold mb-8">Instructor Panel</h2>

          <nav className="flex flex-col gap-4">
            <NavLink
              to="/instructor"
              end
              className={({ isActive }) =>
                `p-2 rounded ${isActive ? "bg-green-500" : "hover:bg-green-600"}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/instructor/students"
              className={({ isActive }) =>
                `p-2 rounded ${isActive ? "bg-green-500" : "hover:bg-green-600"}`
              }
            >
              Students
            </NavLink>

            <NavLink
              to="/instructor/quizzes"
              className={({ isActive }) =>
                `p-2 rounded ${isActive ? "bg-green-500" : "hover:bg-green-600"}`
              }
            >
              Quizzes
            </NavLink>

            <NavLink
              to="/instructor/subjects"
              className={({ isActive }) =>
                `p-2 rounded ${isActive ? "bg-green-500" : "hover:bg-green-600"}`
              }
            >
              Subjects
            </NavLink>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full p-2 bg-red-600 rounded hover:bg-red-500"
        >
          Logout
        </button>
      </aside>

      {/* Main Content Spacer */}
      <div className="ml-60">{/* Your page content goes here */}</div>
    </>
  );
}
