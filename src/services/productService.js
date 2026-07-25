// ================================================================
// PRODUCT SERVICE - COMPLETE WORKING VERSION
// ================================================================

import axios from "axios";

const API_URL = "https://shop-co-e-commerce-backend.onrender.com/api/v1";

// ================================================================
// GET PRODUCTS
// ================================================================

const getProducts = async (style = "", page = 1, limit = 12) => {
  let url = `${API_URL}/products?page=${page}&limit=${limit}`;
  if (style) {
    url += `&style=${style}`;
  }

  console.log("📡 REQUEST URL:", url);

  const response = await axios.get(url);

  console.log("📡 RESPONSE DATA:", response.data);

  return response.data;
};

// ================================================================
// GET TOP SELLING
// ================================================================

const getTopSelling = async (limit = 4) => {
  const response = await axios.get(
    `${API_URL}/products/top-selling?limit=${limit}`,
  );
  return response.data;
};

// ================================================================
// GET SINGLE PRODUCT
// ================================================================

const getSingleProduct = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

// ================================================================
// GET PRODUCT REVIEWS
// ================================================================

const getProductReviews = async (productId) => {
  const response = await axios.get(`${API_URL}/products/${productId}/reviews`);
  return response.data;
};

// ================================================================
// SUBMIT REVIEW
// ================================================================

const submitReview = async (productId, reviewData, token) => {
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
};

// ================================================================
// DELETE REVIEW
// ================================================================

const deleteReview = async (productId, reviewId, token) => {
  const response = await axios.delete(
    `${API_URL}/products/${productId}/reviews/${reviewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// ================================================================
// UPDATE REVIEW
// ================================================================

const updateReview = async (productId, reviewId, reviewData, token) => {
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
