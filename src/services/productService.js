// ================================================================
// PRODUCT SERVICE WITH PAGINATION & TOP SELLING
// ================================================================

import axios from "axios";

const API_URL = "https://shop-co-e-commerce-backend.onrender.com/api/v1";

// ================================================================
// GET PRODUCTS (WITH PAGINATION)
// ================================================================

const getProducts = async (style = "", page = 1, limit = 12) => {
  let url = `${API_URL}/products?page=${page}&limit=${limit}`;
  if (style) {
    url += `&style=${style}`;
  }

  console.log("🔍 Making API request to:", url);

  try {
    const response = await axios.get(url);
    console.log("🔍 API Response status:", response.status);
    console.log("🔍 API Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};

// ================================================================
// GET TOP SELLING PRODUCTS
// ================================================================

const getTopSelling = async (limit = 4) => {
  const url = `${API_URL}/products/top-selling?limit=${limit}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Top selling error:", error);
    throw error;
  }
};

// ================================================================
// GET SINGLE PRODUCT
// ================================================================

const getSingleProduct = async (id) => {
  const url = `${API_URL}/products/${id}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Single product error:", error);
    throw error;
  }
};

// ================================================================
// GET PRODUCT REVIEWS
// ================================================================

const getProductReviews = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/products/${productId}/reviews`,
    );
    return response.data;
  } catch (error) {
    console.error("❌ Get reviews error:", error);
    throw error;
  }
};

// ================================================================
// SUBMIT REVIEW
// ================================================================

const submitReview = async (productId, reviewData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/products/${productId}/reviews`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("❌ Submit review error:", error);
    throw error;
  }
};

// ================================================================
// DELETE REVIEW
// ================================================================

const deleteReview = async (productId, reviewId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/products/${productId}/reviews/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("❌ Delete review error:", error);
    throw error;
  }
};

// ================================================================
// UPDATE REVIEW
// ================================================================

const updateReview = async (productId, reviewId, reviewData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/products/${productId}/reviews/${reviewId}`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("❌ Update review error:", error);
    throw error;
  }
};

// ================================================================
// EXPORT
// ================================================================

const productService = {
  getProducts,
  getTopSelling,
  getSingleProduct,
  getProductReviews,
  submitReview,
  deleteReview,
  updateReview,
};

export default productService;
