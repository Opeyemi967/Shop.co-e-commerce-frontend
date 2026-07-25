// ================================================================
//  Centralized toast configuration
// ================================================================
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

// ================================================================
// Toast Options - Single source of truth
// ================================================================
export const toastOptions = {
  duration: 3000,
  style: {
    background: "#fff",
    color: "#333",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "16px 20px",
    maxWidth: "380px",
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: "#22c55e",
      secondary: "#fff",
    },
  },
  error: {
    duration: 4000,
    iconTheme: {
      primary: "#ef4444",
      secondary: "#fff",
    },
  },
  loading: {
    duration: 2000,
    iconTheme: {
      primary: "#3b82f6",
      secondary: "#fff",
    },
  },
};

// ================================================================
// Custom Toaster Component - Clean and reusable
// ================================================================
export const CustomToaster = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={toastOptions}
      containerStyle={{
        top: 80,
      }}
    />
  );
};

// ================================================================
// Toast Message Helpers - Consistent messages everywhere
// ================================================================
export const toastMessages = {
  // ================================================================
  // CART MESSAGES
  // ================================================================
  addToCart: (productName, size, color) => ({
    title: "Added to Cart",
    message: `${productName} • Size: ${size} • Color: ${color}`,
  }),
  removeFromCart: (productName) => ({
    title: "Removed from Cart",
    message: `${productName} has been removed`,
  }),

  // ================================================================
  // WISHLIST MESSAGES
  // ================================================================
  addToWishlist: (productName) => ({
    title: "Added to Wishlist",
    message: `${productName} has been saved`,
  }),
  removeFromWishlist: (productName) => ({
    title: "Removed from Wishlist",
    message: `${productName} has been removed from wishlist`,
  }),

  // ================================================================
  // 🟢 MOVE TO CART - ADD THIS! (This was missing)
  // ================================================================
  moveToCart: (productName) => ({
    title: "Moved to Cart",
    message: `${productName} moved to cart successfully`,
  }),

  // ================================================================
  // REVIEW MESSAGES
  // ================================================================
  reviewSubmitted: () => ({
    title: "Review Submitted",
    message: "Thank you for your feedback!",
  }),

  // ================================================================
  // AUTH MESSAGES
  // ================================================================
  loginSuccess: () => ({
    title: "Welcome Back!",
    message: "You have successfully logged in",
  }),
  registerSuccess: () => ({
    title: "Account Created!",
    message: "Welcome to SHOP.CO",
  }),
  logoutSuccess: () => ({
    title: "Logged Out",
    message: "You have been logged out",
  }),

  // ================================================================
  // ERROR MESSAGES
  // ================================================================
  error: (message) => ({
    title: "Error",
    message: message || "Something went wrong",
  }),
};

// ================================================================
// Helper function to show toast with consistent styling
// ================================================================
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      ...toastOptions,
      ...options,
    });
  },
  error: (message, options = {}) => {
    return toast.error(message, {
      ...toastOptions,
      duration: 4000,
      ...options,
    });
  },
  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...toastOptions,
      ...options,
    });
  },
};
