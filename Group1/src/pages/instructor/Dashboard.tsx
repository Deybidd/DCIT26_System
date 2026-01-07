import { useEffect, useState } from "react";
import { api } from "@/api/api";

export default function Dashboard() {
	const [totalQuizzes, setTotalQuizzes] = useState(0);
	const [uncheckedQuizzes, setUncheckedQuizzes] = useState(0);
	const [performanceRate, setPerformanceRate] = useState(0);

	const [scheduledQuizzes, setScheduledQuizzes] = useState<any[]>([]);
	const [reminders, setReminders] = useState<string[]>([]);

	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				// Top panel stats
				const res = await api.get("/instructors/dashboard");
				const { total_quizzes, unchecked_quizzes, performance_rate } = res.data;
				setTotalQuizzes(total_quizzes);
				setUncheckedQuizzes(unchecked_quizzes);
				setPerformanceRate(performance_rate);

				// Bottom panels
				const res2 = await api.get("/instructors/dashboard/panels");
				setScheduledQuizzes(res2.data.scheduled_quizzes);
				setReminders(res2.data.reminders);
			} catch (err) {
				console.error(err);
			}
		};

		fetchDashboard();
	}, []);

	return (
		<div className="flex flex-col h-screen">
			<h1 className="bg-[#FEFFF4] text-3xl text-black font-extrabold font-sans p-9">
				Dashboard
			</h1>
			<hr className="h-0.5 w-11/12 bg-black self-center" />

			{/* Top Stats Panels */}
			<div className="flex-1 grid xl:grid-cols-3 lg:grid-cols-3 mg:grid-cols-1 sm:grid-cols-1 gap-4 my-4 mx-20 p-1 h-60">
				<div className="bg-white shadow-lg p-4 rounded-lg flex flex-col items-center">
					<h2 className="text-black">Total Quizzes Created</h2>
					<p className="text-3xl font-bold">{totalQuizzes}</p>
				</div>

				<div className="bg-white shadow-lg p-4 rounded-lg flex flex-col items-center">
					<h2 className="text-black">Unchecked Quizzes</h2>
					<p className="text-3xl font-bold">{uncheckedQuizzes}</p>
				</div>

				<div className="bg-white shadow-lg p-4 rounded-lg flex flex-col items-center">
					<h2 className="text-black">Overall Performance Rate</h2>
					<p className="text-3xl font-bold">{performanceRate}%</p>
				</div>
			</div>

			{/* Bottom Panels */}
			<div className="flex-1 font-sans grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 justify-center gap-20 my-10 mx-30 p-4">
				{/* Scheduled Quizzes */}
				<div className="flex flex-col text-black">
					<h1 className="pb-4 font-bold text-2xl">Scheduled Quizzes</h1>
					{/* SCHEDULED QUIZZES CONTAINER */}
					<div className="flex-1 font-medium bg-white grid grid-cols-1 rounded-2xl p-2 shadow-lg">
						<div className="flex text-sm justify-between px-5 pt-3">
							<h1>No. of Missed Quizzes</h1>
							<a href="" className="underline cursor-pointer">
								See More
							</a>
						</div>
						<div className="p-4">
							{scheduledQuizzes.length > 0 ? (
								<ul className="space-y-2">
									{scheduledQuizzes.map((quiz) => (
										<li key={quiz._id} className="border p-2 rounded">
											<p className="font-semibold">{quiz.name}</p>
											<p className="text-sm text-gray-500">
												Deadline: {new Date(quiz.deadline).toLocaleString()}
											</p>
										</li>
									))}
								</ul>
							) : (
								<div className="flex justify-center items-center">
									<p>No scheduled quizzes.</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Reminders */}
				<div className="flex flex-col text-black">
					<h2 className="pb-4 font-bold text-2xl">Reminders</h2>
					<div className="flex-1 bg-white grid grid-cols-1 rounded-2xl p-2 shadow-lg">
						{reminders.length > 0 ? (
							<ul className="space-y-2 list-disc list-inside">
								{reminders.map((r, idx) => (
									<li key={idx}>{r}</li>
								))}
							</ul>
						) : (
							<div className="flex justify-center items-center">
								<p>No reminders.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
