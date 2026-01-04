import { Outlet } from "react-router-dom";
import InstructorSidebar from "@/components/instructor/InstructorSidebar";

export default function InstructorLayout() {
  return (
    <div className="flex h-screen">
      <InstructorSidebar />

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
