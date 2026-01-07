import { Outlet } from "react-router-dom";
import InstructorSidebar from "@/components/instructor/InstructorSidebar";

export default function InstructorLayout() {
	return (
		<div className="flex h-screen">
			<InstructorSidebar />

			<main className="flex-auto bg-[#FCFDE8] ml-60">
				<Outlet />
			</main>
		</div>
	);
}
