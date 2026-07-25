// ==============================================
// AUTH CHECK HOOK - Reusable authentication check
// ==============================================
// src/hooks/useAuthCheck.js

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export const useAuthCheck = (options = {}) => {
  const {
    redirectTo = "/login",
    requireAuth = true,
    showToast = true,
    toastMessage = "Please login to access this page",
    redirectDelay = 1500,
  } = options;

  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't do anything while checking auth
    if (loading) return;

    // If authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      if (showToast) {
        toast.error(toastMessage);
      }

      // Redirect after a small delay
      const timer = setTimeout(() => {
        navigate(redirectTo, {
          state: { from: location.pathname },
          replace: true,
        });
      }, redirectDelay);

      return () => clearTimeout(timer);
    }

    // If authentication is NOT required and user IS authenticated
    // (for login page, redirect to home)
    if (!requireAuth && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [
    isAuthenticated,
    loading,
    navigate,
    redirectTo,
    requireAuth,
    location,
    showToast,
    toastMessage,
    redirectDelay,
  ]);

  return {
    isAuthenticated,
    loading,
    isRedirecting: !isAuthenticated && requireAuth && !loading,
  };
};

export default useAuthCheck;
