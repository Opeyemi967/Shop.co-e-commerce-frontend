// ================================================================
// PRODUCT SERVICE WITH PAGINATION & TOP SELLING
// ================================================================

import axios from "axios";

const API_URL =  "https://shop-co-e-commerce-backend.onrender.com/api/v1";

// ================================================================
// GET PRODUCTS (WITH PAGINATION)
// ================================================================

const getProducts = async (style = "", page = 1, limit = 12) => {
  let url = `${API_URL}?page=${page}&limit=${limit}`;

  if (style) {
    url += `&style=${style}`;
  }

  const response = await axios.get(url);
  return response.data;
};

// ================================================================
// GET TOP SELLING PRODUCTS (NEW)
// ================================================================

const getTopSelling = async (limit = 4) => {
  const response = await axios.get(`${API_URL}/top-selling?limit=${limit}`);
  return response.data;
};

// ================================================================
// GET SINGLE PRODUCT
// ================================================================

const getSingleProduct = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// ================================================================
// GET PRODUCT REVIEWS
// ================================================================

const getProductReviews = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}/reviews`);
  return response.data;
};

// ================================================================
// SUBMIT REVIEW
// ================================================================

const submitReview = async (productId, reviewData, token) => {
  const response = await axios.post(
    `${API_URL}/${productId}/reviews`,
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
    `${API_URL}/${productId}/reviews/${reviewId}`,
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
    `${API_URL}/${productId}/reviews/${reviewId}`,
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
