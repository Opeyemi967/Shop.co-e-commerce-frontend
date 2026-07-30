import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

// ✅ Import the confirmation hook and modal
import useConfirm from "../../hooks/useConfirm";
import ConfirmModal from "../common/ConfirmModal";

const API_URL = "https://shop-co-e-commerce-backend.onrender.com/api/v1";

const ReviewList = ({
  reviews,
  loading,
  productId,
  onReviewDeleted,
  onReviewUpdated,
}) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✅ Use the confirmation hook
  const { showConfirm, getConfirmProps } = useConfirm();

  // ✅ Handle delete with professional confirmation - DIRECT API CALL
  const handleDelete = async (reviewId) => {
    const confirmed = await showConfirm({
      title: "Delete Review",
      message:
        "Are you sure you want to delete this review? This action cannot be undone.",
      confirmText: "Yes, Delete Review",
      cancelText: "No, Keep Review",
      type: "danger",
    });

    if (confirmed) {
      try {
        setDeleteLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to delete a review");
          return;
        }

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
          // Refresh product to update reviews
          if (onReviewDeleted) {
            onReviewDeleted();
          }
        } else {
          toast.error(data.message || "Failed to delete review");
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error(error.message || "Failed to delete review");
      } finally {
        setDeleteLoading(false);
      }
    }
    setOpenMenuId(null);
  };

  // Handle edit - set editing state and scroll to form
  const handleEdit = (review) => {
    setEditingReview(review);
    setOpenMenuId(null);
    // Scroll to review form
    const form = document.getElementById("review-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Trigger edit mode in parent via custom event or callback
    window.dispatchEvent(new CustomEvent("editReview", { detail: review }));
    if (onReviewUpdated) {
      onReviewUpdated(review);
    }
  };

  // Toggle menu
  const toggleMenu = (reviewId) => {
    setOpenMenuId(openMenuId === reviewId ? null : reviewId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No reviews yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Be the first to review this product!
        </p>
      </div>
    );
  }

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = isAuthenticated && user?.id === review.user;
        const isMenuOpen = openMenuId === review._id;

        return (
          <div
            key={review._id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            {/* Review Header */}
            <div className="flex justify-between items-start">
              {/* Left: User info */}
              <div>
                <strong className="text-gray-800 text-base">
                  {review.name || "Anonymous"}
                </strong>
                <span className="text-gray-400 text-xs ml-3">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Right: Rating + Actions */}
              <div className="flex items-center gap-3">
                {renderStars(review.rating)}

                {/* Three Dots Menu - Only show for review owner */}
                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(review._id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Review actions"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div
                        className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleEdit(review)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit Review
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          disabled={deleteLoading}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                          Delete Review
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Review Content */}
            <div className="mt-3 text-gray-700 leading-relaxed">
              <p>{review.comment}</p>
            </div>
          </div>
        );
      })}

      {/* ✅ Render the confirmation modal */}
      <ConfirmModal {...getConfirmProps()} />
    </div>
  );
};

export default ReviewList;
