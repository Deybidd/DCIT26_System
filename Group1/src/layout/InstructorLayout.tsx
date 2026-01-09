import { Outlet } from "react-router-dom";
import InstructorSidebar from "@/components/instructor/InstructorSidebar";

export default function InstructorLayout() {
	return (
		<div className="flex">
			<InstructorSidebar />

      <main className="flex-1 h-screen">
        <Outlet />
      </main>
    </div>
  );
}
