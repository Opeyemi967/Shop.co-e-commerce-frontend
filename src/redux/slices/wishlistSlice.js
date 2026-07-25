// ================================================================
// WISHLIST SLICE - Professional with Backend Sync
// ================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ================================================================
//  Format wishlist items for frontend display
// ================================================================

const formatWishlistItems = (wishlistData) => {
  if (!wishlistData || !Array.isArray(wishlistData)) {
    return [];
  }

  return wishlistData.map((item) => {
    // If product is populated (has product object)
    if (item.product && typeof item.product === "object") {
      const product = item.product;
      return {
        _id: product._id || item._id,
        name: product.name || "Unknown Product",
        price: product.price || 0,
        image: product.image || "",
        oldPrice: product.oldPrice || null,
        discountPercentage: product.discountPercentage || null,
        stock: product.stock || 0,
        addedAt: item.addedAt || new Date().toISOString(),
      };
    }

    // Fallback: product is just an ID
    return {
      _id: item.product || item._id,
      name: "Product",
      price: 0,
      image: "",
      addedAt: item.addedAt || new Date().toISOString(),
    };
  });
};

// ================================================================
// ASYNC THUNKS - API Calls
// ================================================================

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wishlist");
      const formattedItems = formatWishlistItems(response.data.data);
      return formattedItems;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post("/wishlist", { productId });
      const formattedItems = formatWishlistItems(response.data.data);
      return formattedItems;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to wishlist",
      );
    }
  },
);

export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      const formattedItems = formatWishlistItems(response.data.data);
      return formattedItems;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist",
      );
    }
  },
);

// ================================================================
// INITIAL STATE
// ================================================================

const initialState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

// ================================================================
// SLICE
// ================================================================

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload || [];
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload || [];
        state.error = null;
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.wishlistItems = action.payload || [];
      });
  },
});

// ================================================================
// EXPORT
// ================================================================

export const { clearWishlist } = wishlistSlice.actions;

// Backward compatibility aliases
export const addToWishlist = addToWishlistAsync;
export const removeFromWishlist = removeFromWishlistAsync;

export default wishlistSlice.reducer;
