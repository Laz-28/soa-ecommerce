import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexa_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;