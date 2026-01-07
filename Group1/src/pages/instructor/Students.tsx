export default function Students() {
	return (
		<>
			<div className="flex flex-col h-screen">
				<h1 className="bg-[#FEFFF4] text-3xl text-black font-extrabold font-sans p-9">
					Students
				</h1>
				<hr className="h-0.5 w-11/12 bg-black self-center" />

				{/* STATS */}
				<div className="flex-1 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 justify-between gap-40 my-15 mx-30">
					{/* LIST OF STUDENTS CONTAINER */}
					<div className="bg-white rounded-lg shadow-lg px-10 py-6">
						{/* CONTAINER TOP */}
						<div className="flex justify-between items-center mb-6">
							<h1 className="text-black font-bold font-sans"># of Students</h1>
							<div className="flex gap-2">
								<button aria-label="Options" className="cursor-pointer p-4">
									<svg
										width="18"
										height="4"
										viewBox="0 0 18 4"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M1 2C1 2.26522 1.10536 2.51957 1.29289 2.70711C1.48043 2.89464 1.73478 3 2 3C2.26522 3 2.51957 2.89464 2.70711 2.70711C2.89464 2.51957 3 2.26522 3 2C3 1.73478 2.89464 1.48043 2.70711 1.29289C2.51957 1.10536 2.26522 1 2 1C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2ZM8 2C8 2.26522 8.10536 2.51957 8.29289 2.70711C8.48043 2.89464 8.73478 3 9 3C9.26522 3 9.51957 2.89464 9.70711 2.70711C9.89464 2.51957 10 2.26522 10 2C10 1.73478 9.89464 1.48043 9.70711 1.29289C9.51957 1.10536 9.26522 1 9 1C8.73478 1 8.48043 1.10536 8.29289 1.29289C8.10536 1.48043 8 1.73478 8 2ZM15 2C15 2.26522 15.1054 2.51957 15.2929 2.70711C15.4804 2.89464 15.7348 3 16 3C16.2652 3 16.5196 2.89464 16.7071 2.70711C16.8946 2.51957 17 2.26522 17 2C17 1.73478 16.8946 1.48043 16.7071 1.29289C16.5196 1.10536 16.2652 1 16 1C15.7348 1 15.4804 1.10536 15.2929 1.29289C15.1054 1.48043 15 1.73478 15 2Z"
											stroke="black"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
								<button className="bg-[#7CFB83] border-2 border-black rounded-xl text-center px-4 py-2 cursor-pointer">
									<p className="text-black font-sans font-bold">Add Student</p>
								</button>
							</div>
						</div>

						{/* CONTAINER LIST */}
						<div className="flex flex-col">
							<div>
								<ul className="text-black font-sans max-h-125 overflow-y-auto space-y-2">
									<li>
										<div className="flex flex-col-2 justify-between items-center">
											<div className="flex flex-col-1 items-center gap-2">
												<svg
													width="32"
													height="32"
													viewBox="0 0 32 32"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M15.9167 0.5C7.40204 0.5 0.5 7.40204 0.5 15.9167C0.5 24.4313 7.40204 31.3333 15.9167 31.3333C24.4313 31.3333 31.3333 24.4313 31.3333 15.9167C31.3333 7.40204 24.4313 0.5 15.9167 0.5Z"
														stroke="black"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
													<path
														d="M4.00122 25.7001C4.00122 25.7001 7.4376 21.3125 15.9168 21.3125C24.3959 21.3125 27.8338 25.7001 27.8338 25.7001M15.9168 15.9167C17.1434 15.9167 18.3198 15.4294 19.1871 14.5621C20.0545 13.6947 20.5418 12.5183 20.5418 11.2917C20.5418 10.0651 20.0545 8.88867 19.1871 8.02132C18.3198 7.15396 17.1434 6.66669 15.9168 6.66669C14.6901 6.66669 13.5137 7.15396 12.6464 8.02132C11.779 8.88867 11.2918 10.0651 11.2918 11.2917C11.2918 12.5183 11.779 13.6947 12.6464 14.5621C13.5137 15.4294 14.6901 15.9167 15.9168 15.9167Z"
														stroke="black"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
												</svg>
												<h1>Rance Gabrielle Siroy</h1>
											</div>
											<h1>BSCS 3 - 2</h1>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* TOP STUDENTS CONTAINER */}
					<div className="bg-[#F4FFBC] rounded-lg shadow-lg px-10 py-6">
						{/* CONTAINER TOP */}
						<div className="flex justify-center items-center text-center ">
							<svg
								width="29"
								height="29"
								viewBox="0 0 29 29"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M22.1524 1.61999L17.3195 6.45293H14.5L12.4692 4.42212L15.2738 1.61798H22.1524"
									fill="#92D3F5"
								/>
								<path
									d="M22.1524 1.61999L17.3195 6.45293H14.5L12.4692 4.42212L15.2738 1.61798H22.1524"
									stroke="#92D3F5"
									stroke-width="0.5"
									stroke-miterlimit="10"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M9.65971 1.61271L14.4999 6.45289H11.6805L6.83423 1.60626H9.65971"
									fill="#EA5A47"
								/>
								<path
									d="M9.65971 1.61271L14.4999 6.45289H11.6805L6.83423 1.60626H9.65971"
									stroke="#EA5A47"
									stroke-width="0.5"
									stroke-miterlimit="10"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M11.2778 9.0331V6.84723H17.7223V9.0331"
									fill="#FCEA2B"
								/>
								<path
									d="M14.5 27.3973C19.6163 27.3973 23.7639 23.2498 23.7639 18.1335C23.7639 13.0172 19.6163 8.86957 14.5 8.86957C9.38367 8.86957 5.23608 13.0172 5.23608 18.1335C5.23608 23.2498 9.38367 27.3973 14.5 27.3973Z"
									fill="#FCEA2B"
								/>
								<path
									d="M14.4943 11.2778L12.4288 15.4671L7.80615 16.1405L11.1524 19.3998L10.3646 24.0039L14.4983 21.8289L18.6336 24.0011L17.8422 19.3974L21.186 16.1357L16.5633 15.4659L14.4943 11.2778Z"
									fill="#F1B31C"
								/>
								<path
									d="M14.5 27.3973C19.6163 27.3973 23.7639 23.2498 23.7639 18.1335C23.7639 13.0172 19.6163 8.86957 14.5 8.86957C9.38367 8.86957 5.23608 13.0172 5.23608 18.1335C5.23608 23.2498 9.38367 27.3973 14.5 27.3973Z"
									stroke="black"
									stroke-width="0.5"
									stroke-miterlimit="10"
								/>
								<path
									d="M14.5 27.3973C19.6163 27.3973 23.7639 23.2498 23.7639 18.1335C23.7639 13.0172 19.6163 8.86957 14.5 8.86957C9.38367 8.86957 5.23608 13.0172 5.23608 18.1335C5.23608 23.2498 9.38367 27.3973 14.5 27.3973Z"
									stroke="black"
									stroke-width="0.5"
									stroke-miterlimit="10"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M14.5 27.3973C19.6163 27.3973 23.7639 23.2498 23.7639 18.1335C23.7639 13.0172 19.6163 8.86957 14.5 8.86957C9.38367 8.86957 5.23608 13.0172 5.23608 18.1335C5.23608 23.2498 9.38367 27.3973 14.5 27.3973Z"
									stroke="black"
									stroke-width="0.5"
									stroke-miterlimit="10"
								/>
								<path
									d="M11.6805 7.65276V6.45289H17.3193V7.65276M10.4681 5.24012L6.83423 1.60626H9.65971M12.8848 4.83735L9.65971 1.61271M13.6943 3.22221L15.2736 1.61794H22.1523M18.5277 5.2361L22.1523 1.61996"
									stroke="black"
									stroke-width="0.5"
									stroke-miterlimit="10"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M14.5 27.3973C19.6163 27.3973 23.7639 23.2498 23.7639 18.1335C23.7639 13.0172 19.6163 8.86957 14.5 8.86957C9.38367 8.86957 5.23608 13.0172 5.23608 18.1335C5.23608 23.2498 9.38367 27.3973 14.5 27.3973Z"
									stroke="black"
									stroke-width="0.5"
									stroke-miterlimit="10"
								/>
								<path
									d="M14.4943 11.2778L12.4288 15.4671L7.80615 16.1405L11.1524 19.3998L10.3646 24.0039L14.4983 21.8289L18.6336 24.0011L17.8422 19.3974L21.186 16.1357L16.5633 15.4659L14.4943 11.2778Z"
									stroke="black"
									stroke-width="0.5"
									stroke-miterlimit="10"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<h1 className="text-black font-bold font-sans">
								Top Achievers of the Month
							</h1>
							<svg
								width="38"
								height="38"
								viewBox="0 0 38 38"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M21.9476 6.37607L10.6848 6.32013C10.7228 6.49535 11.837 10.964 12.7658 15.6106C12.825 15.9072 12.8925 16.1912 12.9627 16.4635C12.9838 16.5448 13.007 16.6218 13.0292 16.7015C13.1033 16.9713 13.1871 17.2384 13.2804 17.5022C13.3448 17.682 13.4122 17.8561 13.4826 18.0247L13.5601 18.2094C13.6567 18.4274 13.7586 18.6369 13.8673 18.8337L13.8726 18.8438C13.9887 19.0538 14.1155 19.2574 14.2531 19.4544L14.2663 19.4724C14.3884 19.6448 14.5193 19.81 14.659 19.9679L14.7265 20.0413C14.8511 20.1775 14.9825 20.3068 15.1208 20.4292C15.143 20.4493 15.1653 20.469 15.1878 20.4883C16.2672 21.3664 17.6316 21.8172 19.0216 21.755C19.542 21.7566 20.0603 21.7022 20.5685 21.5924C22.8981 16.246 22.8485 11.2638 21.9476 6.37607Z"
									fill="#FCEA2B"
								/>
								<path
									d="M21.9476 6.3761C22.269 11.3573 22.9478 15.6122 20.3052 22.1187C22.7889 21.5766 24.8314 19.0934 25.5418 15.5425C26.3108 11.6993 27.1879 6.76138 27.2275 6.58299L21.9476 6.3761Z"
									fill="#F1B31C"
								/>
								<path
									d="M16.5833 27.0924H14.5408V30.875H20.3236V27.0924H16.5833Z"
									fill="#FCEA2B"
								/>
								<path
									d="M23.1604 27.0924H20.3236V30.875H23.1604V27.0924Z"
									fill="#F1B31C"
								/>
								<path
									d="M19.0196 15.0844C20.1855 15.0844 21.1307 14.1392 21.1307 12.9733C21.1307 11.8074 20.1855 10.8622 19.0196 10.8622C17.8536 10.8622 16.9084 11.8074 16.9084 12.9733C16.9084 14.1392 17.8536 15.0844 19.0196 15.0844Z"
									fill="#F1B31C"
								/>
								<path
									d="M12.1621 16.6139C12.1621 16.6139 12.2044 16.4762 9.30159 14.5408C7.96684 13.6526 6.41992 12.4825 6.41992 10.8765C6.41992 9.27044 7.73937 8.17952 9.34381 8.17952H10.1418M25.7086 16.7654C25.7086 16.7654 25.7508 16.6277 28.6536 14.6923C29.9873 13.8041 31.5775 12.634 31.5775 11.0279C31.5756 10.6585 31.4984 10.2933 31.3505 9.95476C31.2026 9.61619 30.9872 9.31136 30.7175 9.05891C30.4477 8.80646 30.1293 8.61169 29.7817 8.48653C29.4341 8.36137 29.0646 8.30845 28.6958 8.331H27.5585M27.5601 6.24469C27.6435 6.24469 27.7052 6.32122 27.6862 6.40197C27.5775 6.86483 27.1885 8.66772 25.7925 15.6465C24.9544 19.8381 22.8898 22.2817 19.0196 22.2817C15.1494 22.2817 13.0847 19.9067 12.2466 15.7146C10.9725 9.46044 10.3112 6.24469 10.3112 6.24469H27.5601ZM14.0125 26.5641H23.6883V31.4023H14.0125V26.5641Z"
									stroke="black"
									stroke-width="0.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M19.0195 15.6122C20.4769 15.6122 21.6584 14.4307 21.6584 12.9733C21.6584 11.5159 20.4769 10.3344 19.0195 10.3344C17.5621 10.3344 16.3806 11.5159 16.3806 12.9733C16.3806 14.4307 17.5621 15.6122 19.0195 15.6122Z"
									stroke="black"
									stroke-width="0.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M19.0195 26.5641V22.2817"
									stroke="black"
									stroke-width="0.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>

						{/* CONTAINER LIST */}
						<div className="flex flex-col">
							<div>
								<ul className="text-black font-sans max-h-125 overflow-y-auto space-y-2">
									<li>
										<div className="flex flex-col-2 justify-between items-center">
											<div className="flex flex-col-1 items-center gap-2">
												<svg
													width="32"
													height="32"
													viewBox="0 0 32 32"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M15.9167 0.5C7.40204 0.5 0.5 7.40204 0.5 15.9167C0.5 24.4313 7.40204 31.3333 15.9167 31.3333C24.4313 31.3333 31.3333 24.4313 31.3333 15.9167C31.3333 7.40204 24.4313 0.5 15.9167 0.5Z"
														stroke="black"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
													<path
														d="M4.00122 25.7001C4.00122 25.7001 7.4376 21.3125 15.9168 21.3125C24.3959 21.3125 27.8338 25.7001 27.8338 25.7001M15.9168 15.9167C17.1434 15.9167 18.3198 15.4294 19.1871 14.5621C20.0545 13.6947 20.5418 12.5183 20.5418 11.2917C20.5418 10.0651 20.0545 8.88867 19.1871 8.02132C18.3198 7.15396 17.1434 6.66669 15.9168 6.66669C14.6901 6.66669 13.5137 7.15396 12.6464 8.02132C11.779 8.88867 11.2918 10.0651 11.2918 11.2917C11.2918 12.5183 11.779 13.6947 12.6464 14.5621C13.5137 15.4294 14.6901 15.9167 15.9168 15.9167Z"
														stroke="black"
														stroke-linecap="round"
														stroke-linejoin="round"
													/>
												</svg>
												<h1>Rance Gabrielle Siroy</h1>
											</div>
											<h1>1.0</h1>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
