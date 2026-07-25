// ================================================================
// PRODUCT SERVICE WITH REQUEST DEDUPLICATION
// ================================================================

import axios from "axios";

const API_URL = "https://shop-co-e-commerce-backend.onrender.com/api/v1";

// ✅ Pending request cache to prevent duplicates
const pendingRequests = new Map();

// ================================================================
// GET PRODUCTS (WITH PAGINATION)
// ================================================================

const getProducts = async (style = "", page = 1, limit = 12) => {
  const cacheKey = `products_${style}_${page}_${limit}`;

  // If a request with this key is already in progress, return its promise
  if (pendingRequests.has(cacheKey)) {
    console.log("⏳ Deduplicating request:", cacheKey);
    return pendingRequests.get(cacheKey);
  }

  let url = `${API_URL}/products?page=${page}&limit=${limit}`;
  if (style) {
    url += `&style=${style}`;
  }

  console.log("🔄 Making request:", cacheKey);
  const requestPromise = axios.get(url).then((res) => res.data);
  pendingRequests.set(cacheKey, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    pendingRequests.delete(cacheKey);
  }
};

// ================================================================
// GET TOP SELLING PRODUCTS
// ================================================================

const getTopSelling = async (limit = 4) => {
  const cacheKey = `topSelling_${limit}`;

  if (pendingRequests.has(cacheKey)) {
    console.log("⏳ Deduplicating request:", cacheKey);
    return pendingRequests.get(cacheKey);
  }

  console.log("🔄 Making request:", cacheKey);
  const requestPromise = axios
    .get(`${API_URL}/products/top-selling?limit=${limit}`)
    .then((res) => res.data);
  pendingRequests.set(cacheKey, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    pendingRequests.delete(cacheKey);
  }
};

// ================================================================
// GET SINGLE PRODUCT
// ================================================================

const getSingleProduct = async (id) => {
  const cacheKey = `singleProduct_${id}`;

  if (pendingRequests.has(cacheKey)) {
    console.log("⏳ Deduplicating request:", cacheKey);
    return pendingRequests.get(cacheKey);
  }

  console.log("🔄 Making request:", cacheKey);
  const requestPromise = axios
    .get(`${API_URL}/products/${id}`)
    .then((res) => res.data);
  pendingRequests.set(cacheKey, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    pendingRequests.delete(cacheKey);
  }
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
