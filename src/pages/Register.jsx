import React, { useState } from "react";
import { registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="page-enter glass min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white dark:bg-white dark:text-black">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800"/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800"/>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-2 rounded bg-gray-800"/>
        <button type="submit" className="w-full p-2 bg-blue-500 rounded">Register</button>
      </form>
      <p className="mt-3">Already have an account? <a href="/login" className="text-blue-400">Login</a></p>
    </div>
  );
}

export default Register;
