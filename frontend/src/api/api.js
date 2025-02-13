import axios from "axios";

// Backend API URL (Replace with your actual Flask API URL)
const BASE_URL = "https://192.168.11.5:5000/api"; 

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

// Log in a user
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};


// Gets user profile
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found. User must log in first.");
    return null;
  }

  try {
    const response = await api.get("/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    throw error;
  }
};

// Tasks Section

// Function to create Tasks
export const createTask = async (taskData, token) => {
  try {
    const response = await api.post("/tasks", taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error;
  }
};


// Function to get tasks (Fixed API_URL issue)
export const getTasks = async (token) => {
  try {
      const response = await axios.get(`${BASE_URL}/tasks`, {  // Changed API_URL to BASE_URL
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
  }
};

export default api;



// Funtion to update tasks
export const updateTask = async (taskId, token) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw error;
  }
};

// Function to delete tasks
export const deleteTask = async (taskId, token) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error.response?.data || error.message);
    throw error;
  }
};



// Expenses Section

// Functoin to get Expenses and add Expenses

export const getExpenses = async (token) => {
  try {
    const response = await api.get("/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error.response?.data || error.message);
    throw error;
  }
};

export const addExpense = async (expenseData, token) => {
  try {
    const response = await api.post("/expenses", expenseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error.response?.data || error.message);
    throw error;
  }
};


// Notes Section

export const getNotes = async (token) => {
  try {
    const response = await api.get("/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error.response?.data || error.message);
    throw error;
  }
};

export const addNote = async (noteData, token) => {
  try {
    const response = await api.post("/notes", noteData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding note:", error.response?.data || error.message);
    throw error;
  }
};

export const updateNote = async (noteId, noteData, token) => {
  try {
    const response = await api.put(`/notes/${noteId}`, noteData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating note:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteNote = async (noteId, token) => {
  try {
    const response = await api.delete(`/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error.response?.data || error.message);
    throw error;
  }
};
