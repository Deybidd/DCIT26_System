import { Outlet } from "react-router-dom";
import StudentSidebar from "@/components/student/StudentSidebar";

export default function StudentLayout() {
  return (
    <div className="flex h-screen">
      <StudentSidebar />

      <main className="flex-1 p-6 bg-[#FCFDE8] overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
