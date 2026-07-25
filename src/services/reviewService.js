// Review API service - Vite compatible

// Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export const getProductReviews = async (productId, page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/products/${productId}/reviews?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const createReview = async (productId, rating, comment) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/v1/products/${productId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const updateReview = async (productId, reviewId, rating, comment) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/v1/products/${productId}/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (productId, reviewId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/v1/products/${productId}/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const getUserReviews = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/v1/user/reviews?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user reviews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
};
