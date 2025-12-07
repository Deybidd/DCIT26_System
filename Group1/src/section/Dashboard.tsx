import { useUser } from "../context/UserContext";

export default function Dashboard() {
    const { user } = useUser();

    return (
        <div className="pt-4">
            <h1 className="text-2xl text-black font-semibold mb-4">
                Welcome, {user.name}!
            </h1>

            <div>
                {/* your content here */}
            </div>
        </div>
    );
}
