// ================================================================
// PRODUCT SLICE WITH PAGINATION - COMPLETE FIX
// ================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

// ================================================================
// ASYNC THUNKS
// ================================================================

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ style = '', page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      console.log("🔄 fetchProducts called with:", { style, page, limit });
      
      const response = await productService.getProducts(style, page, limit);
      
      console.log("🔄 fetchProducts response:", response);
      
      // ✅ Check if response is valid
      if (!response) {
        console.error("❌ No response from API");
        return rejectWithValue("No response from server");
      }
      
      // ✅ Check if response has data
      if (!response.data) {
        console.error("❌ No data in response:", response);
        return rejectWithValue("No data in response");
      }
      
      return {
        data: response.data || [],
        totalProducts: response.totalProducts || 0,
        totalPages: response.totalPages || 1,
        currentPage: response.page || page,
        productsPerPage: limit,
        count: response.count || 0,
      };
    } catch (error) {
      console.error("❌ fetchProducts error:", error);
      
      // ✅ Get the actual error message
      let errorMessage = "Failed to fetch products";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error("❌ Server responded with error:", error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
        console.error("❌ No response from server:", error.request);
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || "Failed to fetch products";
        console.error("❌ Request error:", error.message);
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSingleProduct = createAsyncThunk(
  'product/fetchSingleProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getSingleProduct(id);
      return response.data;
    } catch (error) {
      console.error("❌ fetchSingleProduct error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch product'
      );
    }
  }
);

export const submitReview = createAsyncThunk(
  "product/submitReview",
  async ({ productId, rating, comment, userName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login to submit a review");
      }

      const response = await productService.submitReview(
        productId,
        { rating, comment, userName },
        token,
      );

      return response.data;
    } catch (error) {
      console.error("❌ submitReview error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit review. Please try again.",
      );
    }
  },
);

export const fetchProductReviews = createAsyncThunk(
  "product/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductReviews(productId);
      return response.data;
    } catch (error) {
      console.error("❌ fetchProductReviews error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch reviews",
      );
    }
  },
);

export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Please login to delete a review");
      }

      const response = await productService.deleteReview(
        productId,
        reviewId,
        token,
      );

      return response.data;
    } catch (error) {
      console.error("❌ deleteReview error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete review",
      );
    }
  },
);

// ================================================================
// INITIAL STATE
// ================================================================

const initialState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
  reviewSuccess: false,
  reviewLoading: false,
  reviews: [],
  hasFetched: false,
  totalProducts: 0,
  totalPages: 1,
  currentPage: 1,
  productsPerPage: 12,
};

// ================================================================
// CREATE PRODUCT SLICE
// ================================================================

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.reviewSuccess = false;
      state.reviewLoading = false;
      state.error = null;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasFetched = false;
        console.log("🔄 fetchProducts pending...");
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
        state.totalProducts = action.payload.totalProducts || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.productsPerPage = action.payload.productsPerPage || 12;
        state.hasFetched = true;
        state.error = null;
        console.log("✅ Products loaded:", state.products.length);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
        state.hasFetched = false;
        state.products = [];
        console.error("❌ Products fetch failed:", action.payload);
      })
      
      // ✅ fetchSingleProduct
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.reviews = action.payload.reviews || [];
        state.error = null;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productDetails = null;
      })
      
      // ✅ submitReview
      .addCase(submitReview.pending, (state) => {
        state.reviewLoading = true;
        state.reviewSuccess = false;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess = true;
        state.productDetails = action.payload;
        state.reviews = action.payload.reviews || [];
        state.error = null;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess = false;
        state.error = action.payload;
      })
      
      // ✅ fetchProductReviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ deleteReview
      .addCase(deleteReview.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.productDetails = action.payload;
        state.reviews = action.payload.reviews || [];
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload;
      });
  },
});

// ================================================================
// EXPORT ACTIONS
// ================================================================

export const { resetReviewState, clearProductError } = productSlice.actions;

export default productSlice.reducer;