// ================================================================
// PRODUCT SLICE WITH PAGINATION - COMPLETE FIX
// ================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

// ================================================================
// ASYNC THUNKS
// ================================================================

// ✅ FIXED: fetchProducts using createAsyncThunk
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ style = "", page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(style, page, limit);
      return {
        data: response.data,
        totalProducts: response.totalProducts || response.data?.length || 0,
        totalPages: response.totalPages || 1,
        currentPage: response.page || page,
        productsPerPage: limit,
        count: response.count || response.data?.length || 0,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products",
      );
    }
  },
);

export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getSingleProduct(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch product",
      );
    }
  },
);

// ... other thunks (submitReview, fetchProductReviews, deleteReview) remain the same

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
  productsPerPage: 10,
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
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.productsPerPage = action.payload.productsPerPage;
        state.hasFetched = true;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasFetched = false;
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
      });

    // ... other reducers (submitReview, fetchProductReviews, deleteReview) remain the same
  },
});

// ================================================================
// EXPORT ACTIONS
// ================================================================

export const { resetReviewState, clearProductError } = productSlice.actions;

export default productSlice.reducer;
