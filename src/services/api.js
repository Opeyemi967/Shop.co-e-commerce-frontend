// ================================================================
// API SERVICE - Centralized API Configuration
// ================================================================

import axios from "axios";

// ================================================================
// API BASE URL - WITH DEBUG LOGGING
// ================================================================
console.log("🔍 Environment Variables:", import.meta.env);
console.log("🔍 VITE_API_URL:", import.meta.env.VITE_API_URL);

// ✅ Use environment variable or fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003/api/v1";

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

// ... rest of your code stays the same
