// ================================================================
// PROTECTED ROUTE - Requires Authentication
// ================================================================

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If adminOnly is true, check if user is admin
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children
  return children;
};

// Make sure default export is correct
export default ProtectedRoute;
