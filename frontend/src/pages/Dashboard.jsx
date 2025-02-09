import React, { useState, useEffect} from "react";
import { getTasks, getUserProfile, getExpenses } from "../api/api";
import StatsChart from "../components/StatsChart";

function Dashboard() {
    const [user, setUser] = useState(null);

    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem("token"); // Retrive token from local storage


    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const data = await getUserProfile(token); // ✅ Pass token to getUserProfile
            const expensesData = await getExpenses(token); // ✅ Fetch expenses separately
            setUser({ ...data, expenses: expensesData }); // ✅ Merge expenses into user object
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };
    
    

    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token]);

    const fetchTasks = async () => {
        try {
            const data = await getTasks(token);
    
            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split("T")[0];
    
            // Filter tasks to only show today's tasks
            const todaysTasks = data.filter(task => task.due_date.startsWith(today));
    
            setTasks(todaysTasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    return (
        <div className="page-enter glass p-5 text-white dark:bg-white dark:text-black">
            <h1 className="text-3x1 font-bold">Dashboard</h1>
            <p>Welcome to your productivity app!</p>

            {/* User Profile Section */}
            { user ? (
                <div className="mt-5 p-5 bg-gray-800 rounded shadow-md w-80">
                    <h2>User Profile</h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>XP:</strong> {user.xp} 🏆</p>

                    {/* XP Progress Bar */}
                    <div className="mt-3 w-full bg-gray-600 rounded h-4">
                        <div
                        className="bg-green-400 h-4 rounded"
                        style={{ width: `${100 - user.xp_to_next_level}%` }}
                        ></div>
                    </div>
                    <p className="text-sm mt-1">XP to Next Level: {user.xp_to_next_level} XP</p>

                    <p><strong>Streaks:</strong> {user.streaks} 🔥</p>


                </div>
            ) : (
                <p>Loading user data...</p>
            )}

            {/* Tasks section */}
            <h2 className="text-xl mt-5">Your Tasks</h2>
            {tasks.length > 0 ? (
                <ul className="mt-2">
                    {tasks.map((task) => (
                        <li key={task.id} className="border p-2 my-2 bg-gray-800 rounded">
                            {task.title} - {task.completed ? "✅ Completed" : "⏳ Pending"}
                        </li>
                    ))}
                </ul>
                ) : (
                    <p>No Tasks found.</p>
            )}


            {user && <StatsChart user={user} expenses={user.expenses} />}
        </div>
    );
}

export default Dashboard;