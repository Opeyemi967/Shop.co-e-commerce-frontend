// ================================================================
// CART SLICE - Professional with Backend Sync
// ================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ================================================================
// Format cart items for frontend display
// ================================================================

const formatCartItems = (cartData) => {
  if (!cartData || !Array.isArray(cartData)) {
    return [];
  }

  return cartData.map((item) => {
    // If product is populated (has product object)
    if (item.product && typeof item.product === "object" && item.product._id) {
      const product = item.product;
      return {
        _id: product._id,
        name: product.name || "Unknown Product",
        price: product.price || 0,
        image: product.image || "",
        oldPrice: product.oldPrice || null,
        discountPercentage: product.discountPercentage || null,
        stock: product.stock || 0,
        quantity: item.quantity || 1,
        selectedColor: item.selectedColor || "",
        selectedSize: item.selectedSize || "",
      };
    }

    // Fallback: product is just an ID string
    return {
      _id: item.product || item._id,
      name: "Product",
      price: 0,
      image: "",
      quantity: item.quantity || 1,
      selectedColor: item.selectedColor || "",
      selectedSize: item.selectedSize || "",
    };
  });
};

// ================================================================
// ASYNC THUNKS - API Calls
// ================================================================

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      console.log("Fetch cart response:", response.data);
      const formattedItems = formatCartItems(response.data.data);
      return formattedItems;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (productData, { rejectWithValue, dispatch }) => {
    try {
      console.log("Adding to cart:", productData);

      const response = await api.post("/cart", {
        productId: productData._id,
        quantity: productData.quantity || 1,
        selectedColor: productData.selectedColor || "",
        selectedSize: productData.selectedSize || "",
      });

      console.log("Add to cart response:", response.data);

      // Format the response data
      const formattedItems = formatCartItems(response.data.data);
      console.log("Formatted items:", formattedItems);

      // Return the formatted items
      return formattedItems;
    } catch (error) {
      console.error("Add to cart error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      const formattedItems = formatCartItems(response.data.data);
      return formattedItems;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from cart"
      );
    }
  }
);

export const updateCartQuantityAsync = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, id, quantity }, { rejectWithValue }) => {
    try {
      const finalProductId = productId || id;

      if (!finalProductId) {
        return rejectWithValue("Product ID is required");
      }

      console.log(
        `Updating quantity for product ${finalProductId} to ${quantity}`
      );
      const response = await api.put(`/cart/${finalProductId}`, { quantity });
      console.log("Update quantity response:", response.data);

      const formattedItems = formatCartItems(response.data.data);
      return formattedItems;
    } catch (error) {
      console.error("Update quantity error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/cart");
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

// ================================================================
// INITIAL STATE
// ================================================================

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

// ================================================================
// SLICE
// ================================================================

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.cartItems = [];
        state.loading = false;
      });
  },
});

// ================================================================
// EXPORT
// ================================================================

export const { clearCart } = cartSlice.actions;

// Backward compatibility aliases
export const addToCart = addToCartAsync;
export const removeFromCart = removeFromCartAsync;
export const updateCartQuantity = updateCartQuantityAsync;


export default cartSlice.reducer;
