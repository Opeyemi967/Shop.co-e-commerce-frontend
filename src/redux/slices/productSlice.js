// ================================================================
// PRODUCT SLICE - COMPLETE WORKING VERSION
// ================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

// ================================================================
// FETCH PRODUCTS
// ================================================================

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ style = "", page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      console.log("🔄 FETCHING PRODUCTS...");

      const response = await productService.getProducts(style, page, limit);

      console.log("✅ FETCH RESPONSE:", response);

      if (!response || !response.data) {
        console.error("❌ No data in response");
        return rejectWithValue("No data received from server");
      }

      return {
        data: response.data,
        totalProducts: response.totalProducts || response.data.length,
        totalPages: response.totalPages || 1,
        currentPage: response.page || page,
        productsPerPage: limit,
        count: response.count || response.data.length,
      };
    } catch (error) {
      console.error("❌ FETCH ERROR:", error);
      console.error("❌ ERROR MESSAGE:", error.message);
      console.error("❌ ERROR RESPONSE:", error.response);

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products",
      );
    }
  },
);

// ================================================================
// FETCH SINGLE PRODUCT
// ================================================================

export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getSingleProduct(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ================================================================
// SUBMIT REVIEW
// ================================================================

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
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ================================================================
// FETCH PRODUCT REVIEWS
// ================================================================

export const fetchProductReviews = createAsyncThunk(
  "product/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductReviews(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// ================================================================
// DELETE REVIEW
// ================================================================

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
      return rejectWithValue(error.response?.data?.message || error.message);
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
// SLICE
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.hasFetched = false;
        console.log("🔄 LOADING PRODUCTS...");
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
        console.log("✅ PRODUCTS LOADED:", state.products.length);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
        state.hasFetched = false;
        state.products = [];
        console.error("❌ PRODUCTS FAILED:", action.payload);
      })
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.reviews = action.payload?.reviews || [];
        state.error = null;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productDetails = null;
      })
      .addCase(submitReview.pending, (state) => {
        state.reviewLoading = true;
        state.reviewSuccess = false;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess = true;
        state.productDetails = action.payload;
        state.reviews = action.payload?.reviews || [];
        state.error = null;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess = false;
        state.error = action.payload;
      })
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
      .addCase(deleteReview.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.productDetails = action.payload;
        state.reviews = action.payload?.reviews || [];
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState, clearProductError } = productSlice.actions;
export default productSlice.reducer;
