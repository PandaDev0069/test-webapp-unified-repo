import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const StatsChart = ({ user, expenses }) => {
    if (!user || !expenses || expenses.length === 0) return <p>Loading stats...</p>;

  // 📊 XP & Streaks Chart Data
  const xpChartData = {
    labels: ["XP Earned", "XP to Next Level"],
    datasets: [
      {
        label: "XP Progress",
        data: [user.xp, user.xp_to_next_level],
        backgroundColor: ["#1abc9c", "#34495e"],
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#ffffff",
          font: { size: 14, weight: "bold" }
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff", font: { size: 12, weight: "bold" } },
        grid: { color: "rgba(255, 255, 255, 0.3)" },
      },
      y: {
        ticks: { color: "#ffffff", font: { size: 12, weight: "bold" } },
        grid: { color: "rgba(255, 255, 255, 0.3)" },
        beginAtZero: true, // ✅ Ensures scaling starts at 0
        suggestedMax: 100, // ✅ Set reasonable upper limit
      },
    },
  };
  

  // 🔥 Streaks Progress Chart
  const streaksChartData = {
    labels: ["Current Streak", "Longest Streak"],
    datasets: [
      {
        label: "Streaks",
        data: [user.current_streak, user.longest_streak],
        backgroundColor: ["#f1c40f", "#e74c3c"],
        borderRadius: 10,
      },
    ],
  };

  // 💰 Expenses Chart Data
  const expenseChartData = {
    labels: expenses?.map((e) => e.category),
    datasets: [
      {
        label: "Expenses",
        data: expenses?.map((e) => e.amount),
        backgroundColor: ["#3498db", "#9b59b6", "#e67e22", "#1abc9c"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
      {/* XP Progress Chart */}
      <div className="glass p-5">
        <h2 className="text-lg font-bold text-white">XP Progress</h2>
        <Doughnut data={xpChartData} options={chartOptions} />
      </div>
  
      {/* Streaks Chart */}
      <div className="glass p-5">
        <h2 className="text-lg font-bold text-white">Streaks</h2>
        <Bar data={streaksChartData} options={chartOptions} />
      </div>
  
      {/* Expenses Chart */}
      <div className="glass p-5">
        <h2 className="text-lg font-bold text-white">Expenses</h2>
        <Line data={expenseChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatsChart;
