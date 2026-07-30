// ================================================================
// CUSTOM HOOK: REVIEWS - NO REDUX
// ================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { toastMessages } from "../lib/Toast";

const API_URL = "https://shop-co-e-commerce-backend.onrender.com/api/v1";

export const useReviews = (productId) => {
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  // ================================================================
  // SORT REVIEWS FUNCTION
  // ================================================================
  const getSortedReviews = (reviews, sortOption) => {
    if (!reviews || reviews.length === 0) return [];

    const sorted = [...reviews];

    switch (sortOption) {
      case "latest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id),
        );
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      case "mostHelpful":
        return sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
      default:
        return sorted;
    }
  };

  // ================================================================
  // FETCH REVIEWS - DIRECT API CALL
  // ================================================================
  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const response = await fetch(`${API_URL}/products/${productId}/reviews`);
      const data = await response.json();

      if (data.success) {
        setReviewList(data.data || []);
        return data.data || [];
      } else {
        toast.error(data.message || "Failed to fetch reviews");
        return [];
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to fetch reviews");
      return [];
    } finally {
      setReviewLoading(false);
    }
  };

  // ================================================================
  // SUBMIT REVIEW - DIRECT API CALL
  // ================================================================
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    try {
      setReviewLoading(true);

      const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment: comment.trim(),
          userName: "Customer",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRating(5);
        setComment("");

        const { title, message, icon } = toastMessages.reviewSubmitted();
        toast.success(`${icon} ${title} - ${message}`);

        // Refresh reviews after submission
        await fetchReviews();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setReviewLoading(false);
    }
  };

  // ================================================================
  // DELETE REVIEW - DIRECT API CALL
  // ================================================================
  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to delete a review");
      navigate("/login");
      return;
    }

    try {
      setReviewLoading(true);

      const response = await fetch(
        `${API_URL}/products/${productId}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Review deleted successfully");
        await fetchReviews(); // Refresh reviews after deletion
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review");
    } finally {
      setReviewLoading(false);
    }
  };

  // ================================================================
  // UPDATE REVIEW - DIRECT API CALL
  // ================================================================
  const handleUpdateReview = async (reviewId, updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to update a review");
      navigate("/login");
      return;
    }

    try {
      setReviewLoading(true);

      const response = await fetch(
        `${API_URL}/products/${productId}/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Review updated successfully");
        await fetchReviews(); // Refresh reviews after update
      } else {
        toast.error(data.message || "Failed to update review");
      }
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Failed to update review");
    } finally {
      setReviewLoading(false);
    }
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    sortBy,
    setSortBy,
    isSortOpen,
    setIsSortOpen,
    getSortedReviews,
    handleSubmitReview,
    handleDeleteReview,
    handleUpdateReview,
    fetchReviews,
    reviewList,
    reviewLoading,
  };
};

export default useReviews;
