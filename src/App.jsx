// App.jsx - Updated with Data Router
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  Outlet,
} from "react-router-dom";
import { CustomToaster } from "./lib/Toast";

// Layout Components
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
import { fetchProducts } from "./redux/slices/productSlice";

// Layout Component with ScrollRestoration
const Layout = () => {
  return (
    <>
      <CustomToaster />
      <Navbar />
      <ScrollRestoration /> {/* Now works with data router */}
      <Outlet />
      <Footer />
    </>
  );
};

// Create the router
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Public Routes
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/reset-password/:token", element: <ResetPasswordPage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:id", element: <ProductDetailsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/shipping", element: <ShippingPage /> },
      { path: "/returns", element: <ReturnsPage /> },
      { path: "/privacy", element: <PrivacyPage /> },

      // Protected Routes
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/wishlist",
        element: (
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order-confirmation",
        element: (
          <ProtectedRoute>
            <OrderConfirmationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment/verify",
        element: (
          <ProtectedRoute>
            <PaymentVerificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment-failed",
        element: (
          <ProtectedRoute>
            <PaymentVerificationPage />
          </ProtectedRoute>
        ),
      },

      // Admin Routes
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders/:id",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminOrderDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

// App Component with RouterProvider
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ================================================================
  // Fetch products ONCE when app loads
  // ================================================================
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ================================================================
  // Fetch user data if authenticated
  // ================================================================
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

  // ================================================================
  // Fetch current user on app load
  // ================================================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
