import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  DashboardIcon,
  StudentsIcon,
  InfoIcon,
  LogoutIcon,
  ProfileIcon,
  QuizIcon,
  OpenMenu,
  CloseMenu
} from "./IconSet";

const sidebarItems = [
  { to: "/", icons: <DashboardIcon />, label: "Dashboard" },
  { to: "/students", icons: <StudentsIcon />, label: "Students" },
  { to: "/quizzes", icons: <QuizIcon />, label: "Quizzes" },
  { to: "/about", icons: <InfoIcon />, label: "About" },
];

const sidebarFooter = [
  { to: "/profile", icons: <ProfileIcon />, label: "Profile" },
  { to: "/logout", icons: <LogoutIcon />, label: "Logout" },
];

export default function Sidebar() {
  const [menuOpen, setOpen] = useState(false);
  const location = useLocation(); 

  const activeClass = "bg-green-400/50"; 

  return (
    <nav
      className={`h-screen p-2 bg-[#87FDA8] flex flex-col duration-500 ${
        menuOpen ? "w-60" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="relative">
        <h1
          className={`p-3 text-2xl text-black transition-all duration-500 overflow-hidden ${
            menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          Quiz <br /> app.
        </h1>

        <div
          onClick={() => setOpen(!menuOpen)}
          className="absolute top-3 right-6 cursor-pointer "
        >
          {menuOpen ? <CloseMenu /> : <OpenMenu />}
        </div>
      </div>

      {/* MAIN MENU */}
      <div className="flex-1">
        <ul>
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.to;

            return (
              <li key={index}>
                <Link
                  to={item.to}
                  className={`px-2 py-2 my-2 text-black text-1xl font-[Poppins-Regular] cursor-pointer rounded-md duration-300 flex items-center gap-4
                    ${isActive ? activeClass : "hover:bg-green-400/40"}
                  `}
                >
                  <div>{item.icons}</div>

                  <p
                    className={`transition-all duration-500 overflow-hidden ${
                      menuOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-3"
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* FOOTER */}
      <div>
        <ul>
          {sidebarFooter.map((item, index) => {
            const isActive = location.pathname === item.to;

            return (
              <li key={index}>
                <Link
                  to={item.to}
                  className={`px-2 py-2 my-2 text-black text-1xl font-[Poppins-Regular] cursor-pointer rounded-md duration-300 flex items-center gap-4
                    ${isActive ? activeClass : "hover:bg-green-400/40"}
                  `}
                >
                  <div>{item.icons}</div>

                  <p
                    className={`transition-all duration-500 overflow-hidden ${
                      menuOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-3"
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
