// ================================================================
// CUSTOM HOOK: REVIEWS
// ================================================================

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { submitReview, resetReviewState } from "../redux/slices/productSlice";
import { toastMessages } from "../lib/Toast";

export const useReviews = (productId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);

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
            new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id)
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
  // SUBMIT REVIEW HANDLER
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
      await dispatch(
        submitReview({
          productId,
          rating: Number(rating),
          comment: comment.trim(),
          userName: "Customer",
        })
      ).unwrap();

      setRating(5);
      setComment("");

      // FIXED: Using simple toast without JSX
      const { title, message, icon } = toastMessages.reviewSubmitted();
      toast.success(`${icon} ${title} - ${message}`);

      dispatch(resetReviewState());
    } catch (err) {
      toast.error(err || "Failed to submit review. Please try again.");
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
  };
};

export default useReviews;