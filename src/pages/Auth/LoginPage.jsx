// ================================================================
// IMPORTS
// ================================================================
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaGoogle,
  FaFacebook,
  FaArrowRight,
} from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import Input from "../../components/common/Input";
import {
  loginUser,
  registerUser,
  clearError,
} from "../../redux/slices/authSlice";

import { fetchCart } from "../../redux/slices/cartSlice";
import { fetchWishlist } from "../../redux/slices/wishlistSlice";

// ================================================================
// LOGIN PAGE COMPONENT
// ================================================================
const LoginPage = () => {
  // ================================================================
  // HOOKS
  // ================================================================
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // ================================================================
  // REDUX STATE
  // ================================================================
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  // ================================================================
  // LOCAL STATE
  // ================================================================
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // ================================================================
  // EFFECTS
  // ================================================================
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ================================================================
  // HANDLERS
  // ================================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear global error when user types
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================================================================
  // FIXED: handleSubmit
  // ================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { name, email, password } = formData;

    try {
      if (isLogin) {
        const result = await dispatch(loginUser({ email, password }));

        if (result.meta?.requestStatus === "fulfilled") {
          // FORCE FETCH CART AND WISHLIST FOR THE NEW USER
          await dispatch(fetchCart());
          await dispatch(fetchWishlist());
          navigate("/");
        }
      } else {
        const result = await dispatch(registerUser({ name, email, password }));

        if (result.meta?.requestStatus === "fulfilled") {
          await dispatch(fetchCart());
          await dispatch(fetchWishlist());
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    dispatch(clearError());
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
            <h1 className="text-4xl font-akira-super text-gray-900">SHOP.CO</h1>
          </Link>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Welcome back! Please login to your account"
              : "Create your account and start shopping"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isLogin
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                !isLogin
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Global Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-start gap-2">
              <span className="text-red-500 font-bold">
                <IoIosWarning />
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name - Signup only */}
            {!isLogin && (
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={FaUser}
                error={errors.name}
                required
              />
            )}

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={FaEnvelope}
              error={errors.email}
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FaLock}
              error={errors.password}
              required
            />

            {/* Confirm Password - Signup only */}
            {!isLogin && (
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
              />
            )}

            {/* Forgot Password - Login only */}
            {isLogin && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-yellow-600 hover:text-yellow-500 transition"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 duration-300 group cursor-pointer"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Login" : "Create Account"}
                  <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <FaGoogle className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <FaFacebook className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Facebook
              </span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-yellow-600 font-medium hover:text-yellow-500 transition cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-gray-400 text-xs mt-6">
          By continuing, you agree to our{" "}
          <Link
            to="/terms"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
