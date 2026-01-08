import { Outlet } from "react-router-dom";
import InstructorSidebar from "@/components/instructor/InstructorSidebar";

export default function InstructorLayout() {
  return (
    <div className="flex h-screen">
      <InstructorSidebar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
