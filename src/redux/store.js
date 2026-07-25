// Import configureStore from Redux Toolkit
// This helps us create the main global Redux store

import { configureStore } from "@reduxjs/toolkit";

// Import auth reducer
// This connects authentication state into the store

import authReducer from "./slices/authSlice";

// Import product reducer
// Handles fetching + storing products

import productReducer from "./slices/productSlice";

// NEW
// Import wishlist reducer
// Handles wishlist state
// Example:
// store.wishlist.wishlistItems
// store.wishlist.loading
// store.wishlist.error
import wishlistReducer from "./slices/wishlistSlice";

// NEW
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
    // PRODUCT STATE
    // =====================================
    //
    // Example:
    // store.product.products
    // store.product.loading
    // store.product.error

    product: productReducer,

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
