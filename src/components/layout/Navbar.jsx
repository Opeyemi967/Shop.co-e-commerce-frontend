// ================================================================
// NAVBAR - Main Navigation Component
// ================================================================

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Hamburger from "../hamburger/Hamburger";
import { FiShoppingCart } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

// Import auth actions
import { logout } from "../../redux/slices/authSlice";

// NEW: Import clearCart and clearWishlist to clean up data on logout
import { clearCart } from "../../redux/slices/cartSlice";
import { clearWishlist } from "../../redux/slices/wishlistSlice";

// ================================================================
// NAVBAR COMPONENT
// ================================================================

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Track logout state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Get cart items from Redux
  const { cartItems } = useSelector((state) => state.cart);

  // Get wishlist items from Redux
  const { wishlistItems } = useSelector((state) => state.wishlist);

  /**
   * Calculate total items in cart
   * Only calculate if user is authenticated to prevent showing
   * old data after logout
   */
  const totalItems = isAuthenticated
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  /**
   * PROFESSIONAL: Navigate AFTER state is fully cleared
   * This useEffect watches for logout state and only navigates
   * when the cart and wishlist are completely cleared
   */
  useEffect(() => {
    if (
      isLoggingOut &&
      !isAuthenticated &&
      cartItems.length === 0 &&
      wishlistItems.length === 0
    ) {
      // All data is cleared, now navigate safely
      setIsLoggingOut(false);
      navigate("/");
    }
  }, [
    isLoggingOut,
    isAuthenticated,
    cartItems.length,
    wishlistItems.length,
    navigate,
  ]);

  /**
   * Handle Logout - Clears ALL user data
   *
   * This is CRITICAL for security:
   * 1. Set logging out state
   * 2. Clear auth state (logout)
   * 3. Clear cart state (clearCart)
   * 4. Clear wishlist state (clearWishlist)
   * 5. Clear localStorage
   * 6. useEffect will navigate once data is cleared
   *
   * Without this, a new user would see the previous user's
   * cart and wishlist items (data leakage!)
   */
  const handleLogout = () => {
    // 1. First, FORCE clear everything
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("wishlistItems");

    // 2. Clear Redux state
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());

    // 3. Navigate immediately
    navigate("/");

    // 4. Force reload to clear any cached state
    window.location.reload();
  };

  return (
    <nav className="p-5 border-b border-yellow-600 shadow-sm bg-black">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* ============================================================ */}
        {/* LOGO */}
        {/* ============================================================ */}
        <Link
          to="/"
          className="text-2xl font-akira-super text-white hover:text-gray-300 transition-colors"
        >
          SHOP.CO
        </Link>

        {/* ============================================================ */}
        {/* DESKTOP NAVIGATION - Hidden on mobile */}
        {/* ============================================================ */}
        <div className="hidden md:flex gap-6 items-center text-white font-medium">
          <Link to="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link to="/orders" className="hover:text-gray-300 transition-colors">
            Orders
          </Link>
          <Link
            to="/wishlist"
            className="hover:text-gray-300 transition-colors"
          >
            Wishlist
          </Link>
          <Link to="/about" className="hover:text-gray-300 transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-300 transition-colors">
            Contact
          </Link>

          {/* ============================================================ */}
          {/* AUTH SECTION - Conditional based on login status */}
          {/* ============================================================ */}
          {isAuthenticated ? (
            // LOGGED IN: Show user name and logout button
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-4 text-sm font-medium hover:text-gray-300">
                <FaUserCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />{" "}
                Hi, {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            // NOT LOGGED IN: Show login button
            <Link
              to="/login"
              className="px-4 py-2 bg-gray-700  text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
          )}

          {/* ============================================================ */}
          {/* CART ICON WITH BADGE - Only show badge when logged in */}
          {/* ============================================================ */}
          <Link
            to="/cart"
            className="relative hover:text-gray-300 transition-colors"
          >
            <FiShoppingCart className="w-6 h-6 text-white hover:text-gray-300 transition-colors" />

            {/* Only show badge if:
              - User is authenticated (isAuthenticated)
              - AND there are items in cart (totalItems > 0)
            */}
            {isAuthenticated && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* ============================================================ */}
        {/* MOBILE CONTROLS - Visible only on small screens */}
        {/* ============================================================ */}
        <div className="flex md:hidden items-center space-x-4">
          {/* Mobile Cart Icon */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="w-6 h-6 text-white hover:text-gray-300" />

            {/* Same logic for mobile - only show badge when logged in */}
            {isAuthenticated && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger Menu */}
          <Hamburger />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
