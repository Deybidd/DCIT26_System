import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Modules/Sidebar";
import Dashboard from "./section/Dashboard";
import Students from "./section/StudentsPage";
import Quizzes from "./section/Quizzes";
import About from "./section/About";
import Profile from "./section/Profile";
import { UserProvider, useUser } from "./context/UserContext";
import { useState } from "react";
import "./App.css"

function NameModal() {
  const { setUser } = useUser();
  const [tempName, setTempName] = useState("");

  const saveName = () => {
    if (tempName.trim() === "") return;
    setUser((prev) => ({ ...prev, name: tempName }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl text-black font-semibold mb-3 text-center">
          What do you want your name to be?
        </h2>

        <input
          type="text"
          className="w-full p-2 border-2 border-green-500 text-black rounded mb-3 focus:outline-none"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          placeholder="Enter your name"
        />

        <button
          onClick={saveName}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function Layout() {
  const { user } = useUser();

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6">
        {user.name === "" && <NameModal />}

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Layout />
      </UserProvider>
    </BrowserRouter>
  );
}
