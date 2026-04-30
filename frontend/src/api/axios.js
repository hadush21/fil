import axios from "axios";

// Backend URL (Vite env or fallback)
const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach token automatically for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;