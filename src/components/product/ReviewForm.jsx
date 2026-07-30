import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const API_URL = "https://shop-co-e-commerce-backend.onrender.com/api/v1";

const ReviewForm = ({ productId, onReviewSubmitted, onReviewUpdated }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // Listen for edit events
  useEffect(() => {
    const handleEdit = (event) => {
      const review = event.detail;
      setEditingReview(review);
      setRating(review.rating);
      setComment(review.comment);
      // Scroll to form
      document.getElementById("review-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    window.addEventListener("editReview", handleEdit);
    return () => window.removeEventListener("editReview", handleEdit);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    if (comment.trim().length < 2) {
      toast.error("Comment must be at least 2 characters");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      setLoading(true);

      const url = editingReview
        ? `${API_URL}/products/${productId}/reviews/${editingReview._id}`
        : `${API_URL}/products/${productId}/reviews`;

      const method = editingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment: comment.trim(),
          userName: user?.name || "Anonymous",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingReview
            ? "Review updated successfully!"
            : "Review submitted successfully!",
        );
        // Reset form
        setRating(5);
        setComment("");
        setEditingReview(null);
        // Refresh product reviews
        if (onReviewSubmitted) onReviewSubmitted();
        if (onReviewUpdated) onReviewUpdated();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(5);
    setComment("");
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center mt-6">
        <p className="text-gray-600">
          Please{" "}
          <a
            href="/login"
            className="text-yellow-600 hover:underline font-medium"
          >
            login
          </a>{" "}
          to write a review
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg p-6 border border-gray-200 mt-6"
      id="review-form"
    >
      <h3 className="text-xl font-bold mb-4">
        {editingReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {rating} out of 5
            </span>
          </div>
        </div>

        {/* Comment Input */}
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            required
          />
          <div className="text-xs text-gray-400 mt-1">
            {comment.length}/2000 characters
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          {editingReview && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {editingReview ? "Updating..." : "Submitting..."}
              </span>
            ) : editingReview ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
