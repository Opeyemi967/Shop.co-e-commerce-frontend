// ================================================================
// AUTH SLICE - Redux State Management
// ================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================================================================
// IMPORT CLEAR ACTIONS FROM OTHER SLICES
// ================================================================

import { clearCart } from "./cartSlice";
import { clearWishlist } from "./wishlistSlice";

// ================================================================
// API BASE URL
// ================================================================

const API_URL =
  import.meta.env.VITE_API_URL || "https://shopco-backend.onrender.com/api/v1";
// ================================================================
// ASYNC THUNKS
// ================================================================

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue, dispatch }) => {
    try {
      // Clear old data before registering
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("wishlistItems");

      // Clear Redux states
      dispatch(clearCart());
      dispatch(clearWishlist());

      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user data.",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to send reset email. Please try again.",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    }
  },
);

// ================================================================
// INITIAL STATE
// ================================================================

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null,
  forgotPassword: {
    emailSent: false,
    loading: false,
    error: null,
  },
  resetPassword: {
    success: false,
    loading: false,
    error: null,
  },
};

// ================================================================
// SLICE
// ================================================================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // FIXED: Clear ALL data on logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      state.forgotPassword = { emailSent: false, loading: false, error: null };
      state.resetPassword = { success: false, loading: false, error: null };

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("wishlistItems");
    },

    clearError: (state) => {
      state.error = null;
      state.forgotPassword.error = null;
      state.resetPassword.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearForgotPasswordState: (state) => {
      state.forgotPassword = {
        emailSent: false,
        loading: false,
        error: null,
      };
    },

    clearResetPasswordState: (state) => {
      state.resetPassword = {
        success: false,
        loading: false,
        error: null,
      };
    },

    // ============================================================
    // NEW: Check auth status on app load
    // ============================================================
    checkAuth: (state) => {
      // If token exists but user is null, restore auth state
      if (state.token && !state.user) {
        state.isAuthenticated = true;
      }
      // If no token, ensure isAuthenticated is false
      if (!state.token) {
        state.isAuthenticated = false;
        state.user = null;
      }
    },

    // NEW: Set auth state after user fetch
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token || state.token;
      state.loading = false;
      state.error = null;
    },

    // NEW: Clear auth on error
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================================================
      // LOGIN
      // ============================================================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.token = action.payload.data?.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // ============================================================
      // REGISTER
      // ============================================================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.token = action.payload.data?.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // ============================================================
      // GET CURRENT USER
      // ============================================================
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("wishlistItems");
      })

      // ============================================================
      // FORGOT PASSWORD
      // ============================================================
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.forgotPassword.loading = true;
        state.forgotPassword.emailSent = false;
        state.forgotPassword.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPassword.loading = false;
        state.forgotPassword.emailSent = true;
        state.forgotPassword.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPassword.loading = false;
        state.forgotPassword.emailSent = false;
        state.forgotPassword.error = action.payload;
        state.error = action.payload;
      })

      // ============================================================
      // RESET PASSWORD
      // ============================================================
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.resetPassword.loading = true;
        state.resetPassword.success = false;
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPassword.loading = false;
        state.resetPassword.success = true;
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetPassword.loading = false;
        state.resetPassword.success = false;
        state.resetPassword.error = action.payload;
        state.error = action.payload;
      });
  },
});

// ================================================================
// EXPORT
// ================================================================

export const {
  logout,
  clearError,
  setLoading,
  clearForgotPasswordState,
  clearResetPasswordState,
  checkAuth,
  setAuth,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
