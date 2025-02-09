import React, { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.access_token); // Store JWT token
      navigate("/"); // Redirect to Dashboard
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="page-enter glass min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white dark:bg-white dark:text-black">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800"/>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800"/>
        <button type="submit" className="w-full p-2 bg-blue-500 rounded">Login</button>
      </form>
      <p className="mt-3">Don't have an account? <a href="/register" className="text-blue-400">Register</a></p>
    </div>
  );
}

export default Login;
