import { useState } from "react";

export default function Dashboard() {
    const [count, setCount] = useState(0);

    return (
        <div className="pt-4">
            <h1 className="text-2xl text-black font-semibold mb-4">Dashboard</h1>

            <div>
                <button
                    className="px-3 py-1 bg-[#87FDA8] text-black rounded"
                    onClick={() => setCount(c => c + 1)}
                >
                    Increment
                </button>
                <span className="ml-3 text-black">Count: {count}</span>
            </div>
        </div>
    );
}
