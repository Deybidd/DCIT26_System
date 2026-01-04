import { NavLink, useNavigate } from "react-router-dom";

export default function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("studentLoggedIn"); // clear session
  navigate("/student/login");
};

  return (
    <aside className="w-60 bg-blue-800 text-white p-5 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-xl font-bold mb-8">Student Panel</h2>

        <nav className="flex flex-col gap-4">
          <NavLink
            to="/student"
            end
            className={({ isActive }) =>
              `p-2 rounded ${isActive ? "bg-blue-500" : "hover:bg-blue-600"}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/student/subjects"
            className={({ isActive }) =>
              `p-2 rounded ${isActive ? "bg-blue-500" : "hover:bg-blue-600"}`
            }
          >
            Subjects
          </NavLink>

          <NavLink
            to="/student/quizzes"
            className={({ isActive }) =>
              `p-2 rounded ${isActive ? "bg-blue-500" : "hover:bg-blue-600"}`
            }
          >
            Quizzes
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
  );
}
