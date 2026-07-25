// ================================================================
// IMPORTS
// ================================================================
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  forgotPassword,
  clearError,
  clearForgotPasswordState,
} from "../../redux/slices/authSlice";
import Input from "../../components/common/Input";

// ================================================================
// FORGOT PASSWORD PAGE
// ================================================================
const ForgotPasswordPage = () => {
  // ================================================================
  // HOOKS
  // ================================================================
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================================================================
  // REDUX STATE
  // ================================================================
  const { loading, error } = useSelector((state) => state.auth);
  const { forgotPassword: forgotPasswordState } = useSelector(
    (state) => state.auth
  );

  // ================================================================
  // LOCAL STATE
  // ================================================================
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ================================================================
  // EFFECTS
  // ================================================================
  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());

    // Cleanup on unmount
    return () => {
      dispatch(clearForgotPasswordState());
    };
  }, [dispatch]);

  // Check if email was sent successfully
  useEffect(() => {
    if (forgotPasswordState?.emailSent) {
      setIsSubmitted(true);
    }
  }, [forgotPasswordState]);

  // ================================================================
  // HANDLERS
  // ================================================================
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    try {
      await dispatch(forgotPassword({ email })).unwrap();
    } catch (err) {
      // Error is handled by Redux
      console.error("Forgot password error:", err);
    }
  };

  const handleResend = () => {
    setIsSubmitted(false);
    setEmail("");
    dispatch(clearForgotPasswordState());
    dispatch(clearError());
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
    if (error) {
      dispatch(clearError());
    }
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ============================================================ */}
        {/* BRAND HEADER */}
        {/* ============================================================ */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gray-900">
              SHOP.CO
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        {/* ============================================================ */}
        {/* MAIN CARD */}
        {/* ============================================================ */}
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
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We've sent a password reset link to
                <br />
                <span className="font-medium text-gray-800">{email}</span>
              </p>
              <p className="text-gray-500 text-xs mt-4">
                Didn't receive the email? Check your spam folder or
              </p>
              <button
                onClick={handleResend}
                className="text-blue-600 font-medium hover:text-blue-800 transition-colors text-sm mt-1"
              >
                Click here to resend
              </button>
            </div>
          ) : (
            /* ============================================================ */
            /* FORM STATE */
            /* ============================================================ */
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Forgot Password?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Enter the email address associated with your account and we'll
                  send you a link to reset your password.
                </p>
              </div>

              {/* Global Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
                  <FaExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  icon={FaEnvelope}
                  error={emailError}
                  required
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          )}

          {/* ============================================================ */}
          {/* FOOTER */}
          {/* ============================================================ */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-yellow-600 font-medium hover:text-yellow-500 transition"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
