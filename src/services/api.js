// ================================================================
// API SERVICE - Centralized API Configuration
// ================================================================

import axios from "axios";

// ================================================================
// API BASE URL
// ================================================================
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003/api/v1";

// ================================================================
// CREATE AXIOS INSTANCE
// ================================================================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================================================
// REQUEST INTERCEPTOR - Add token to every request
// ================================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ================================================================
// RESPONSE INTERCEPTOR - Handle errors globally
// ================================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
