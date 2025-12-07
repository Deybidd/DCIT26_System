import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Modules/Sidebar";
import Dashboard from "./section/Dashboard";
import Students from "./section/StudentsPage";
import Quizzes from "./section/Quizzes";
import About from "./section/About";
import Profile from "./section/Profile";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
