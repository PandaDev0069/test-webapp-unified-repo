import React, { useState, useEffect } from "react";
import { getExpenses, addExpense } from "../api/api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Required for Chart.js to work

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ amount: "", category: "", date: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(token);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.category || !newExpense.date) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await addExpense(newExpense, token);
      setNewExpense({ amount: "", category: "", date: "" });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  // Prepare data for chart
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expense Breakdown",
        data: Object.values(categoryTotals),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"],
      },
    ],
  };

  return (
    <div className="page-enter glass p-5 text-white">
      <h1 className="text-3xl font-bold">Expense Tracker</h1>

      {/* Add Expense Form */}
      <div className="mt-5 p-5 bg-gray-800 rounded shadow-md">
        <h2 className="text-xl font-bold">Add Expense</h2>
        <form onSubmit={handleAddExpense} className="space-y-3">
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Category (e.g. Food, Rent)"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <button type="submit" className="w-full p-2 bg-green-500 rounded">
            Add Expense
          </button>
        </form>
      </div>

      {/* Expense Chart */}
      {expenses.length > 0 && (
        <div className="mt-5 p-5 bg-gray-800 rounded shadow-md">
          <h2 className="text-xl font-bold">Expense Breakdown</h2>
          <div className="w-full max-w-lg mx-auto">
            <Bar 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: {
                      color: "white",
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "white" },
                    grid: { color: "rgba(255, 255, 255, 0.2)" },
                  },
                  y: {
                    ticks: { color: "white" },
                    grid: { color: "rgba(255, 255, 255, 0.2)" },
                  },
                },
              }}
              height={250} // ✅ Adjust height to make it compact
            />
          </div>
        </div>
      )}

      {/* Expense List */}
      {expenses.length > 0 ? (
        <ul className="mt-5">
          {expenses.map((expense) => (
            <li key={expense.id} className="border p-2 my-2 bg-gray-800 rounded">
              {expense.category}: ${expense.amount} - {expense.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses recorded.</p>
      )}
    </div>
  );
}

export default Expenses;
