import { useState } from "react";
import {
	DashboardIcon,
	StudentsIcon,
	InfoIcon,
	LogoutIcon,
	ProfileIcon,
	QuizIcon,
    OpenMenu,
	CloseMenu
} from "./IconSet";

const sidebarItems = [
	{
		icons: <DashboardIcon />,
		label: "Dashboard",
	},
	{
		icons: <StudentsIcon />,
		label: "Students",
	},
	{
		icons: <QuizIcon />,
		label: "Quizzes",
	},
	{
		icons: <InfoIcon />,
		label: "About",
	},
];

const sidebarFooter = [
	{
		icons: <ProfileIcon />,
		label: "Profile",
	},
	{
		icons: <LogoutIcon />,
		label: "Logout",
	},
];

export default function Sidebar() {
	const [menuOpen, setOpen] = useState(false);

	return (
		<nav
			className={`h-screen p-2 bg-[#7CFB83] flex flex-col duration-500 ${
				menuOpen ? "w-80" : "w-20"
			}`}
		>
			<div className="relative">
				<h1
					className={`p-3 text-5xl text-black transition-all duration-500 overflow-hidden ${
						menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
					}`}
				>
					Quiz <br /> app.
				</h1>
				<div onClick={() => setOpen(!menuOpen)} className="absolute top-3 right-2 cursor-pointer ">
					{menuOpen ? <CloseMenu /> : <OpenMenu />}
				</div>
			</div>
			<div className="flex-1">
				<ul>
					{sidebarItems.map((item, index) => {
						return (
							<li
								key={index}
								className="px-2 py-2 my-4 text-black text-2xl font-[Poppins-Regular] hover:bg-green-400 cursor-pointer rounded-md duration-300 flex items-center gap-4"
							>
								<div>{item.icons}</div>
								<p
									className={`transition-all duration-500 overflow-hidden ${
										menuOpen
											? "opacity-100 translate-x-0"
											: "opacity-0 -translate-x-3"
									}`}
								>
									{item.label}
								</p>
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<ul>
					{sidebarFooter.map((item, index) => {
						return (
							<li
								key={index}
								className="px-2 py-2 my-4 text-black text-2xl font-[Poppins-Regular] hover:bg-green-400 cursor-pointer rounded-md duration-300 flex items-center gap-4"
							>
								<div>{item.icons}</div>
								<p
									className={`transition-all duration-500 overflow-hidden ${
										menuOpen
											? "opacity-100 translate-x-0"
											: "opacity-0 -translate-x-3"
									}`}
								>
									{item.label}
								</p>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
}
