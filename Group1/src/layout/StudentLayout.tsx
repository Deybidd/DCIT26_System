import { Outlet } from "react-router-dom";
import StudentSidebar from "@/components/student/StudentSidebar";

export default function StudentLayout() {
  return (
    <div className="flex">
      <StudentSidebar />

      <main className="flex-1 h-screen">
        <Outlet />
      </main>
    </div>
  );
}
