// App.jsx - FIXED FOR RENDER 404 ERRORS
import { HashRouter, Routes, Route } from "react-router-dom"; // <--- CHANGED TO HASHROUTER
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CustomToaster } from "./lib/Toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import CartPage from "./pages/Cart/CartPage";
import WishlistPage from "./pages/Wishlist/WishlistPage";
import ContactPage from "./pages/Contact/ContactPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AboutPage from "./pages/About/AboutPage";
import FAQPage from "./pages/FAQPage";
import ShippingPage from "./pages/ShippingPage";
import ReturnsPage from "./pages/ReturnsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/orderHistoryPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminOrderDetails from "./pages/Admin/AdminOrderDetails";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PaymentVerificationPage from "./pages/PaymentVerificationPage";

// Redux Actions
import { getCurrentUser } from "./redux/slices/authSlice";
import { fetchCart, clearCart } from "./redux/slices/cartSlice";
import { fetchWishlist, clearWishlist } from "./redux/slices/wishlistSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    } else if (!token) {
      dispatch(clearCart());
      dispatch(clearWishlist());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <HashRouter>
      {" "}
      {/* <--- CHANGED TO HASHROUTER WRAPPER */}
      <CustomToaster />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/verify"
          element={
            <ProtectedRoute>
              <PaymentVerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-failed"
          element={
            <ProtectedRoute>
              <PaymentVerificationPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrderDetails />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;
