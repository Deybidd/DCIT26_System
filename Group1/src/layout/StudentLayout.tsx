import { Outlet } from "react-router-dom";
import StudentSidebar from "@/components/student/StudentSidebar";

export default function StudentLayout() {
	return (
		<div className="flex h-screen">
			<StudentSidebar />

			<main className="flex-auto bg-[#FCFDE8] ml-60">
				<Outlet />
			</main>
		</div>
	);
}
