// Import configureStore from Redux Toolkit
// This helps us create the main global Redux store

import { configureStore } from "@reduxjs/toolkit";

// Import auth reducer
// This connects authentication state into the store

import authReducer from "./slices/authSlice";

// Import wishlist reducer
// Handles wishlist state
import wishlistReducer from "./slices/wishlistSlice";

// Import cart reducer
// Handles shopping cart state
import cartReducer from "./slices/cartSlice";

// ==============================================
// CREATE GLOBAL REDUX STORE
// ==============================================

export const store = configureStore({
  reducer: {
    // =====================================
    // AUTH STATE
    // =====================================
    //
    // Example:
    // store.auth.userInfo
    // store.auth.loading
    // store.auth.error

    auth: authReducer,

    // =====================================
    // CART STATE
    // =====================================
    //
    // Example:
    // store.cart.cartItems

    cart: cartReducer,

    // =====================================
    // WISHLIST STATE
    // =====================================
    // Example:
    // store.wishlist.wishlistItems
    // store.wishlist.loading
    // store.wishlist.error

    wishlist: wishlistReducer,
  },
});
