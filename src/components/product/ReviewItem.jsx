import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { deleteReview } from "../../redux/slices/productSlice";

// ✅ Import the confirmation hook and modal
import useConfirm from "../../hooks/useConfirm";
import ConfirmModal from "../common/ConfirmModal";

const ReviewItem = ({ review, productId, currentUser, onEdit }) => {
  const [showActions, setShowActions] = useState(false);
  const dispatch = useDispatch();
  const isOwner = currentUser?.id === review.user;

  // ✅ Use the confirmation hook
  const { showConfirm, getConfirmProps } = useConfirm();

  // ✅ Handle delete with professional confirmation
  const handleDelete = async () => {
    // ✅ Show professional modal instead of window.confirm
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
        await dispatch(
          deleteReview({ productId, reviewId: review._id }),
        ).unwrap();
        toast.success("Review deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete review");
      }
    }
  };

  const handleEdit = () => {
    onEdit(review);
    setShowActions(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <strong className="text-gray-800">{review.name}</strong>
          <span className="text-gray-400 text-xs ml-3">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Three Dots - Only show if user owns this review */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Review actions"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showActions && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-gray-700">
        <p>{review.comment}</p>
      </div>

      {/* ✅ Render the confirmation modal */}
      <ConfirmModal {...getConfirmProps()} />
    </div>
  );
};

export default ReviewItem;
