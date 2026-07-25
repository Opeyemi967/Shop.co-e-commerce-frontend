// Import React hooks and external libraries
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { FaUserCircle } from "react-icons/fa";

const Hamburger = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Track whether menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // ================================================================
  // Get auth state from Redux
  // ================================================================
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Toggle menu state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu (used when clicking links or overlay)
  const closeMenu = () => {
    setIsOpen(false);
  };

  // ================================================================
  // Handle logout
  // ================================================================
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    closeMenu();
  };

  // Reusable glass effect - matches navbar styling
  const glassEffect = "bg-white/95 backdrop-blur-sm";

  return (
    <>
      {/* ============================================================ */}
      {/* HAMBURGER BUTTON - visible only on mobile */}
      {/* ============================================================ */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-white hover:text-gray-300 focus:outline-none transition-colors duration-200 cursor-pointer"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX className="w-8 h-8" /> : <FiMenu className="w-8 h-8" />}
      </button>

      {/* ============================================================ */}
      {/* DARK OVERLAY - behind menu, click to close */}
      {/* ============================================================ */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* ============================================================ */}
      {/* MENU PANEL - Glass effect + shadow ALWAYS when open */}
      {/* ============================================================ */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } 
        ${glassEffect} shadow-2xl`}
      >
        {/* ============================================================ */}
        {/* MENU HEADER */}
        {/* ============================================================ */}
        <div className={`p-4 border-b border-gray-200 ${glassEffect}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-akira-super text-gray-800">Menu</h2>
            <button
              onClick={closeMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close menu"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* USER INFO - Show when logged in */}
        {/* ============================================================ */}
        {isAuthenticated && user && (
          <div className={`px-4 py-3 border-b border-gray-100 ${glassEffect}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
              <FaUserCircle className="w-14 h-14" />
              </div>
              <div>
                <p className="font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* NAVIGATION LINKS */}
        {/* ============================================================ */}
        <nav className={`p-4 ${glassEffect}`}>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                onClick={closeMenu}
                className="block py-3 px-4 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                onClick={closeMenu}
                className="block py-3 px-4 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center justify-between py-3 px-4 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span>Cart</span>
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="block py-3 px-4 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={closeMenu}
                className="block py-3 px-4 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={closeMenu}
                className="block py-3 px-4 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Contact
              </Link>
            </li>

            {/* ============================================================ */}
            {/*  AUTH SECTION - Conditional */}
            {/* ============================================================ */}
            {isAuthenticated ? (
              //  Logged in: Show Logout button
              <li className="pt-4 mt-2 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full block text-center py-3 px-4 bg-black text-white rounded-lg hover:bg-grey-900 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            ) : (
              // Not logged in: Show Login button
              <li className="pt-4 mt-2 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full block text-center py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Hamburger;
