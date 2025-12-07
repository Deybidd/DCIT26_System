const Dashboard = () => {
	return (
		<svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            viewBox="0 0 24 24"
        >
            <path
                fill="none"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5L12 12L19 5M12 12H12M5 19L12 12L19 19"
            >
                <animate
                    fill="freeze"
                    attributeName="d"
                    dur="0.4s"
                    values="M5 5L12 12L19 5M12 12H12M5 19L12 12L19 19;M5 5L12 5L19 5M5 12H19M5 19L12 19L19 19"
                ></animate>
            </path>
        </svg>
	);
};

export default Dashboard;
