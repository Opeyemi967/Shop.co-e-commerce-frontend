// ================================================================
// API SERVICE - Centralized API Configuration
// ================================================================

import axios from "axios";

// ================================================================
// API BASE URL - HARDCODED FOR PRODUCTION
// ================================================================
// ✅ Hardcoded to your Render backend
const API_URL = "https://shopco-backend.onrender.com/api/v1";

console.log("🔍 Using API_URL:", API_URL);

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

// ✅ Make sure this is at the end of the file
export default api;
