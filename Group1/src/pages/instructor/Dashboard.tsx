import { useEffect, useState } from "react";
import { api } from "@/api/api";

export default function InstructorDashboard() {
	const instructorEmail = localStorage.getItem("instructorEmail") || "";
	const [totalQuizzes, setTotalQuizzes] = useState(0);
	const [uncheckedQuizzes, setUncheckedQuizzes] = useState(0);
	const [performanceRate, setPerformanceRate] = useState(0);
	const [scheduledQuizzes, setScheduledQuizzes] = useState<any[]>([]);
	const [reminders, setReminders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboard = async () => {
			if (!instructorEmail) return;

			try {
				setLoading(true);

				// Fetch all quizzes for this instructor
				const quizzesRes = await api.get("/quizzes/instructors", {
					params: { instructor_email: instructorEmail },
				});
				const quizzes = quizzesRes.data;

				// Total quizzes created
				const created = quizzes.length;
				setTotalQuizzes(created);

				// Count unchecked (not released) quizzes and build reminders
				let unchecked = 0;
				const remindersList: any[] = [];
				const scheduledList: any[] = [];

				for (const quiz of quizzes) {
					const quizId = quiz.id || quiz._id;
					try {
						const needsGradingRes = await api.get(
							`/quizzes/${quizId}/needs-grading`
						);
						if (needsGradingRes.data.needs_grading) {
							unchecked++;
							// Add to reminders
							remindersList.push({
								title: quiz.title,
								message: `Release grades for "${quiz.title}" quiz`,
							});
						} else {
							// Add to scheduled quizzes if it's released
							scheduledList.push(quiz);
						}
					} catch (err) {
						console.error(
							`Failed to fetch grading status for quiz ${quizId}:`,
							err
						);
						scheduledList.push(quiz);
					}
				}

				setUncheckedQuizzes(unchecked);
				setScheduledQuizzes(scheduledList);
				setReminders(remindersList);

				// Calculate performance rate
				// 5 points for every quiz created, 3 points for every quiz checked (released)
				const checked = created - unchecked;
				const totalPoints = created * 5 + checked * 3;
				const maxPoints = created * 5; // Max possible if all are just created
				const rate =
					maxPoints > 0 ? Math.round((totalPoints / (maxPoints * 2)) * 100) : 0;
				setPerformanceRate(rate);
			} catch (err) {
				console.error("Failed to fetch dashboard data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboard();
	}, [instructorEmail]);

	if (loading) {
		return (
			<div className="flex-col h-screen">
				<h1 className="bg-[#FEFFF4] font-sans text-3xl text-black font-extrabold p-8 w-full">
					Instructor Dashboard
				</h1>
				<p className="text-center mt-10">Loading dashboard...</p>
			</div>
		);
	}

	return (
		<div className="flex-col h-screen">
			<h1 className="bg-[#FEFFF4] font-sans text-3xl text-black font-extrabold p-9">
				Instructor Dashboard
			</h1>
			<hr className="h-1 w-full bg-black" />

			{/* TOP PART */}
			<div className="flex-1 grid xl:grid-cols-3 bg-white justify-center items-center gap-4 my-4 mx-20 p-1 h-2/7 rounded-2xl shadow-lg divide-x-2 divide-black font-sans font-bold">
				<StatBlob value={totalQuizzes} label="Total Quizzes Created" />
				<StatBlob value={uncheckedQuizzes} label="Unchecked Quizzes" />
				<StatBlob
					value={`${performanceRate}%`}
					label="Overall Performance Rate"
				/>
			</div>

			{/* BOTTOM PART */}
			<div className="flex-1 h-1/2 font-sans grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 justify-center gap-20 my-10 mx-30 p-4">
				{/* SCHEDULED QUIZZES */}
				<div className="flex flex-col text-black">
					<h1 className="pb-4 font-bold text-2xl">Scheduled Quizzes</h1>

					<div className="flex flex-col bg-white rounded-2xl p-2 shadow-lg overflow-hidden h-full relative">
						<div className="flex text-sm justify-between px-5 pt-3 pb-2 border-b">
							<h1 className="font-bold">
								No. of Scheduled: {scheduledQuizzes.length}
							</h1>
							<a
								href="/instructor/quizzes"
								className="cursor-pointer hover:text-green-500 font-semibold"
							>
								See More
							</a>
						</div>
						<div className="relative">
							<ul className="grid grid-cols-1 gap-3 p-4">
								{scheduledQuizzes.slice(0, 3).map((q, index) => (
									<li
										key={q._id || q.id}
										className={`grid grid-cols-1 gap-2 p-3 w-full rounded shadow-sm border-l-4 ${
											index % 2 === 0
												? "bg-[#FFE6B1] border-[#87FDA8]"
												: "bg-[#FFA0E4] border-pink-400"
										}`}
									>
										<div className="flex font-semibold justify-between">
											<h1 className="font-bold text-lg">{q.title}</h1>
											<h1 className="font-medium text-xs bg-[#87FDA8] px-3 py-1 rounded-full">
												{new Date(q.deadline).toLocaleDateString()}
											</h1>
										</div>
										<div className="flex justify-between items-center">
											<h1 className="text-sm">
												{q.questions?.length || 0} Items
											</h1>
											<span className="text-xs text-gray-600">
												Subject: {q.subject_code}
											</span>
										</div>
									</li>
								))}
							</ul>
							{/* Fade overlay at bottom */}
							<div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent pointer-events-none"></div>
						</div>
					</div>
				</div>

				{/* REMINDERS */}
				<div className="flex flex-col text-black">
					<h1 className="pb-4 font-bold text-2xl">Reminders</h1>

					<div className="flex flex-col bg-white rounded-2xl p-2 shadow-lg overflow-hidden relative h-full">
						<div className="relative">
							<ul className="grid grid-cols-1 gap-2 p-3">
								{reminders.slice(0, 3).map((r, i) => (
									<li key={i} className="flex items-center gap-4">
										<svg
											width="32"
											height="32"
											viewBox="0 0 41 41"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											className="shrink-0"
										>
											<svg
												width="32"
												height="32"
												viewBox="0 0 41 41"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className="shrink-0"
											>
												{" "}
												<path
													d="M27.857 2.60101C28.1865 2.68333 28.4699 2.89315 28.6448 3.18435C28.8197 3.47554 28.8718 3.82428 28.7897 4.15389L28.1491 6.71639C28.1116 6.88298 28.0412 7.04039 27.942 7.17938C27.8428 7.31837 27.7168 7.43613 27.5715 7.52574C27.4261 7.61535 27.2643 7.675 27.0956 7.7012C26.9269 7.72739 26.7546 7.71959 26.5889 7.67825C26.4233 7.63692 26.2675 7.56289 26.1309 7.46051C25.9942 7.35813 25.8794 7.22946 25.7932 7.08208C25.707 6.93469 25.6511 6.77156 25.6288 6.60227C25.6065 6.43297 25.6183 6.26094 25.6635 6.09626L26.3041 3.53376C26.3864 3.2042 26.5962 2.92081 26.8874 2.7459C27.1786 2.57099 27.5273 2.51887 27.857 2.60101ZM35.5009 5.50176C35.7411 5.74203 35.876 6.06787 35.876 6.40761C35.876 6.74735 35.7411 7.07318 35.5009 7.31345L32.9384 9.87595C32.8202 9.99832 32.6788 10.0959 32.5225 10.1631C32.3662 10.2302 32.1981 10.2656 32.0279 10.2671C31.8578 10.2685 31.6891 10.2361 31.5316 10.1717C31.3742 10.1073 31.2311 10.0121 31.1108 9.89183C30.9905 9.77153 30.8954 9.62848 30.831 9.47102C30.7665 9.31356 30.7341 9.14484 30.7356 8.97472C30.7371 8.80459 30.7724 8.63647 30.8396 8.48015C30.9067 8.32383 31.0043 8.18246 31.1267 8.06426L33.6892 5.50176C33.9295 5.26157 34.2553 5.12663 34.595 5.12663C34.9348 5.12663 35.2606 5.26157 35.5009 5.50176ZM16.1028 33.3971C16.7458 34.4678 17.7578 35.2668 18.9484 35.644C20.139 36.0211 21.4264 35.9506 22.5686 35.4455C23.7109 34.9405 24.6294 34.0357 25.1516 32.9012C25.6739 31.7667 25.7638 30.4805 25.4046 29.2843L16.1028 33.3971ZM13.7453 34.4375L11.1879 35.5701C10.5262 35.8624 9.79164 35.9479 9.08054 35.8153C8.36944 35.6826 7.71504 35.3382 7.20321 34.827L6.17821 33.8046C5.66637 33.297 5.32059 32.6461 5.18653 31.9378C5.05247 31.2296 5.13646 30.4973 5.42739 29.8378L15.3468 7.26733C15.5819 6.73433 15.9432 6.26659 16.3995 5.90452C16.8558 5.54245 17.3934 5.29694 17.9659 5.18921C18.5383 5.08148 19.1284 5.11477 19.6851 5.2862C20.2418 5.45763 20.7484 5.76204 21.1611 6.17314L34.8244 19.7954C35.236 20.2059 35.5413 20.7107 35.7138 21.2659C35.8862 21.821 35.9207 22.4099 35.8142 22.9814C35.7077 23.5529 35.4634 24.0898 35.1024 24.5456C34.7415 25.0014 34.2749 25.3622 33.743 25.5969L27.7596 28.2414C28.3921 30.0642 28.316 32.0582 27.5464 33.8276C26.7769 35.5969 25.3701 37.0122 23.6054 37.7924C21.8408 38.5726 19.8473 38.6607 18.0206 38.0392C16.194 37.4177 14.6679 36.1321 13.7453 34.4375ZM37.1563 12.8126H34.5938C34.254 12.8126 33.9281 12.9476 33.6878 13.1878C33.4475 13.4281 33.3125 13.754 33.3125 14.0938C33.3125 14.4336 33.4475 14.7595 33.6878 14.9998C33.9281 15.2401 34.254 15.3751 34.5938 15.3751H37.1563C37.4961 15.3751 37.822 15.2401 38.0622 14.9998C38.3025 14.7595 38.4375 14.4336 38.4375 14.0938C38.4375 13.754 38.3025 13.4281 38.0622 13.1878C37.822 12.9476 37.4961 12.8126 37.1563 12.8126ZM17.6941 8.29745L7.77208 30.8679C7.6886 31.0543 7.66423 31.2619 7.70225 31.4625C7.74028 31.6632 7.83888 31.8474 7.98477 31.9903L9.01233 33.0153C9.15876 33.1609 9.34571 33.2588 9.54872 33.2963C9.75173 33.3338 9.96133 33.3091 10.1501 33.2254L32.7052 23.2522C32.8554 23.1857 32.9872 23.0837 33.0891 22.955C33.1911 22.8262 33.2602 22.6746 33.2905 22.5131C33.3208 22.3517 33.3113 22.1853 33.2629 22.0283C33.2145 21.8714 33.1286 21.7286 33.0127 21.6122L19.3546 7.98483C19.237 7.86792 19.0928 7.78129 18.9344 7.73237C18.776 7.68344 18.608 7.67367 18.445 7.70391C18.282 7.73415 18.1287 7.80348 17.9984 7.90597C17.868 8.00846 17.7645 8.14103 17.6966 8.29233"
													fill="black"
												/>{" "}
											</svg>
										</svg>
										<div className="grid grid-cols-1">
											<h1 className="text-base font-semibold">{r.title}</h1>
											<h1 className="text-sm">⚠️ {r.message}</h1>
										</div>
									</li>
								))}
							</ul>
							{/* Fade overlay at bottom */}
							<div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function StatBlob({ value, label }: { value: string | number; label: string }) {
	return (
		<div className="text-black p-4 flex flex-col justify-between text-center relative h-[240px]">
			<div className="flex-1 flex items-center justify-center">
				<div className="relative w-[230px] h-[170px] flex justify-center">
					<svg
						viewBox="0 0 149 113"
						className="absolute w-45 h-full"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M52.25 0.59C60 0.25 68 0.94 76 1.03C84.07 1.12 92.6 0.44 100.35 2.23C109.07 4.25 116.43 9.8 123.17 15.7C130.24 21.89 137.33 28.45 141.77 36.67C146.28 45.02 148.11 54.88 147.01 64.37C145.87 74.15 140.55 82.75 134.01 90.05C127.46 97.37 120.12 104.92 110.75 108.46C101.05 112.13 90.07 111.34 79.53 111.03C68.75 110.71 57.07 111.45 47.13 107.32C37.25 103.21 29.37 95.41 21.83 87.87C14.28 80.32 7.02 72.24 3.25 62.5C-0.52 52.76 0.11 41.34 1.05 30.97C1.97 20.86 3.8 10.08 11.09 4.46C18.24 -1.04 30.41 1.54 40.33 1.61C44.34 1.64 48.34 0.77 52.25 0.59Z"
							fill="#87FDA8"
							stroke="black"
						/>
					</svg>

					{/* VALUE CENTER */}
					<div className="absolute inset-0 flex items-center justify-center">
						<h1 className="text-6xl font-extrabold">{value}</h1>
					</div>
				</div>
			</div>

			{/* LABEL */}
			<h1 className="text-lg font-bold mt-2">{label}</h1>
		</div>
	);
}
