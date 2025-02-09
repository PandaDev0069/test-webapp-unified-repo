import { useState, useEffect, useRef } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [activeStyle, setActiveStyle] = useState({ left: 0, width: 0 }); 
  const animationRef = useRef(null);

  const handleNavHover = (event) => {
    if (animationRef.current) {
      const { offsetLeft, offsetWidth } = event.target;
      setActiveStyle({ left: offsetLeft, width: offsetWidth });
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white dark:bg-white dark:text-black">

      {/* ✅ Toast Notification Container */}
      <ToastContainer 
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
      theme="dark"
      />
      
      {/* ✅ Improved Navigation Bar */}
      <nav className="nav">
        <div className="nav-container">
          {[
            { path: "/", label: "Dashboard" },
            { path: "/tasks", label: "Tasks" },
            { path: "/notes", label: "Notes" },
            { path: "/expenses", label: "Expenses" },
          ].map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className="nav-item"
              onMouseEnter={handleNavHover}
            >
              {label}
            </NavLink>
          ))}
          <div
            className="animation"
            ref={animationRef}
            style={{ left: activeStyle.left, width: activeStyle.width }}
          ></div>
        </div>

        {/* ✅ Dark Mode & Login/Logout Buttons */}
        <div className="nav-buttons">
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          {token ? (
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="login-button">
              Login
            </NavLink>
          )}
        </div>
      </nav>

      <div className="p-5">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/expenses" element={<Expenses />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
