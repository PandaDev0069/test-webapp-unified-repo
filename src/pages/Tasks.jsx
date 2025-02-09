import React, { useState, useEffect } from "react";
import { getTasks, updateTask, createTask, deleteTask, getUserProfile } from "../api/api";
import { toast } from "react-toastify";
import Tilt from "react-parallax-tilt";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", due_date: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchUserProfile();
    }
  }, [token]);

  useEffect(() => {
    if (tasks) {
      Object.values(tasks).flat().forEach(scheduleTaskNotification); // ✅ Flatten grouped tasks array
    }
  }, [tasks]);
  

  const fetchTasks = async () => {
    try {
        const data = await getTasks(token);

        // Group tasks by date
        const groupedTasks = data.reduce((acc, task) => {
            const date = task.due_date.split(" ")[0]; // Extract YYYY-MM-DD
            if (!acc[date]) acc[date] = [];
            acc[date].push(task);
            return acc;
        }, {});

        setTasks(groupedTasks);
    } catch (error) {
        console.error("Failed to fetch tasks", error);
    }
};


  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile(token);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await updateTask(taskId, token);
      fetchTasks();
      fetchUserProfile();
      toast.success("✅ Task marked as complete!", { icon: "✔️" });
    } catch (error) {
      console.error("Error completing task", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.due_date) {
      alert("Please enter a title and due date.");
      return;
    }

    try {
      await createTask(newTask, token);
      setNewTask({ title: "", due_date: "" }); // Reset form
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
        await deleteTask(taskId, token);
        fetchTasks();
    } catch (error) {
        console.error("Error deleting task", error);
    }
  };

  const scheduleTaskNotification = (task) => {
    if (!task.due_date) return; // ✅ Use `due_date` instead of `dueDate`
  
    const now = new Date();
    const taskDueTime = new Date(task.due_date); // ✅ Corrected
    const reminderTime = new Date(taskDueTime.getTime() - 5 * 60 * 1000); // 5 minutes before
  
    const timeUntilReminder = reminderTime - now;
  
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        toast.info(`⏳ Reminder: "${task.title}" is due soon!`, {
          icon: "🕒",
        });
      }, timeUntilReminder);
    }
  };
  
  



  return (
    <div className="page-enter glass p-5 text-white">
      <h1 className="text-3xl font-bold">Tasks</h1>

      {/* Add Task Form */}
      <div className="mt-5 p-5 bg-gray-800 rounded shadow-md">
        <h2 className="text-xl font-bold">Add New Task</h2>
        <form onSubmit={handleAddTask} className="space-y-3">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <input
            type="datetime-local"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value.replace("T", " ") + ":00" })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <button type="submit" className="w-full p-2 bg-green-500 rounded">
            Add Task
          </button>
        </form>
      </div>

      {/* XP Progress Bar */}
      {user && (
        <div className="mt-5 w-full bg-gray-600 rounded h-4 relative">
          <div
            className="bg-green-400 h-4 rounded"
            style={{ width: `${100 - user.xp_to_next_level}%` }}
          ></div>
          <p className="text-sm mt-2">XP to Next Level: {user.xp_to_next_level} XP</p>
        </div>
      )}

      {/* Task List */}
      {Object.keys(tasks).length > 0 ? (
            Object.entries(tasks).map(([date, tasks]) => (
                <div key={date} className="mt-5 p-5 bg-gray-800 rounded shadow-md">
                    <h2 className="text-lg font-bold">{date}</h2>
                    <ul className="mt-2">
                        {tasks.map((task) => (
                            <li key={task.id} className="border p-2 my-2 bg-gray-700 rounded flex justify-between">
                                <span>{task.title} - {task.completed ? "✅ Completed" : "⏳ Pending"}</span>
                                <div className="space-x-2">
                                    {!task.completed && (
                                        <button className="bg-blue-500 px-3 py-1 rounded" onClick={() => handleCompleteTask(task.id)}>
                                            Complete
                                        </button>
                                    )}
                                    <button className="bg-red-500 px-3 py-1 rounded" onClick={() => handleDeleteTask(task.id)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))
        ) : (
            <p className="mt-5 text-center text-gray-300">No tasks found.</p>
        )}
    </div>
  );
}

export default Tasks;
