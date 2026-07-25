// ================================================================
// IMPORTS
// ================================================================
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
} from "react-icons/fa";
import {
  resetPassword,
  clearError,
  clearResetPasswordState,
} from "../../redux/slices/authSlice";
import Input from "../../components/common/Input";

// ================================================================
// RESET PASSWORD PAGE
// ================================================================
const ResetPasswordPage = () => {
  // ================================================================
  // HOOKS
  // ================================================================
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get token from URL params or query string
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const token = params.token || queryParams.get("token");

  // ================================================================
  // REDUX STATE
  // ================================================================
  const { loading, error } = useSelector((state) => state.auth);
  const { resetPassword: resetPasswordState } = useSelector(
    (state) => state.auth
  );

  // ================================================================
  // LOCAL STATE
  // ================================================================
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // ================================================================
  // EFFECTS
  // ================================================================
  useEffect(() => {
    // Check if token exists
    if (!token) {
      navigate("/forgot-password");
      return;
    }

    // Clear any previous errors
    dispatch(clearError());

    // Cleanup on unmount
    return () => {
      dispatch(clearResetPasswordState());
    };
  }, [dispatch, navigate, token]);

  // Check if password was reset successfully
  useEffect(() => {
    if (resetPasswordState?.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [resetPasswordState, navigate]);

  // ================================================================
  // HANDLERS
  // ================================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      ).unwrap();
    } catch (err) {
      console.error("Reset password error:", err);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gray-900">
              SHOP<span className="text-yellow-700">.CO</span>
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Set a new password</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Back to Login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>

          {/* ============================================================ */}
          {/* SUCCESS STATE */}
          {/* ============================================================ */}
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Password Reset Successfully!
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your password has been updated. You will be redirected to the
                login page.
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 text-black font-medium hover:text-gray-700 transition"
              >
                Go to Login 
              </Link>
            </div>
          ) : (
            /* ============================================================ */
            /* FORM STATE */
            /* ============================================================ */
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Password
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Please enter your new password below. It must be at least 6
                  characters.
                </p>
              </div>

              {/* Global Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
                  <FaExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Invalid Token Error */}
              {resetPasswordState?.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
                  <FaExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{resetPasswordState.error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={FaLock}
                  error={errors.password}
                  required
                  disabled={loading}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={FaLock}
                  error={errors.confirmPassword}
                  required
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
