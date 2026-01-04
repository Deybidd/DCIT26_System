import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";

// Student imports
import StudentLogin from "./pages/auth/student/StudentLogin";
import StudentRegister from "./pages/auth/student/StudentRegister";
import StudentLayout from "./layout/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import Subjects from "./pages/student/Subjects";
import Quizzes from "./pages/student/Quizzes";
import ProtectedRoute from "./pages/auth/student/ProtectedRoute";

// Instructor imports
import InstructorLogin from "./pages/auth/instructor/InstructorLogin";
import InstructorRegister from "./pages/auth/instructor/InstructorRegister";
import InstructorLayout from "./layout/InstructorLayout";
import DashboardInstructor from "./pages/instructor/Dashboard";
import Students from "./pages/instructor/Students";
import QuizzesInstructor from "./pages/instructor/Quizzes";
import ProtectedInstructorRoute from "./pages/auth/instructor/ProtectedInstructorRoute"; // create similar to ProtectedRoute

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Student routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="quizzes" element={<Quizzes />} />
        </Route>

        {/* Instructor routes */}
        <Route path="/instructor/login" element={<InstructorLogin />} />
        <Route path="/instructor/register" element={<InstructorRegister />} />

        <Route
          path="/instructor"
          element={
            <ProtectedInstructorRoute>
              <InstructorLayout />
            </ProtectedInstructorRoute>
          }
        >
          <Route index element={<DashboardInstructor />} />
          <Route path="students" element={<Students />} />
          <Route path="quizzes" element={<QuizzesInstructor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
