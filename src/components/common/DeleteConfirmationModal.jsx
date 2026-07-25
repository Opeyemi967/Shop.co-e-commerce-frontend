// ==============================================
// DELETE CONFIRMATION MODAL
// ==============================================

import React from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-6 mx-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={24} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="text-red-600 text-3xl" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center mb-2">
            {title || "Confirm Delete"}
          </h3>

          {/* Message */}
          <p className="text-gray-500 text-center mb-6">
            {message || "Are you sure you want to delete this item?"}
          </p>

          {/* Item Name Highlight */}
          {itemName && (
            <p className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-4 rounded-lg mb-6">
              "{itemName}"
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;