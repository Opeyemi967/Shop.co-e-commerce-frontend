// src/pages/ErrorPages/Error500.jsx
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

const Error500 = ({ error, resetError }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto relative">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Server illustration */}
              <rect
                x="40"
                y="80"
                width="120"
                height="80"
                rx="8"
                fill="#E5E7EB"
              />
              <rect
                x="55"
                y="95"
                width="30"
                height="20"
                rx="4"
                fill="#9CA3AF"
              />
              <rect
                x="95"
                y="95"
                width="30"
                height="20"
                rx="4"
                fill="#9CA3AF"
              />
              <rect
                x="135"
                y="95"
                width="20"
                height="20"
                rx="4"
                fill="#9CA3AF"
              />
              <circle cx="100" cy="55" r="20" fill="#FCD34D" />
              <path
                d="M100 35 L100 45 M100 65 L100 75 M85 55 L95 55 M105 55 L115 55"
                stroke="#F59E0B"
                strokeWidth="3"
              />
              <text x="50" y="180" fontSize="14" fill="#6B7280">
                500
              </text>
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Oops! Something Went Wrong
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          We're experiencing some technical difficulties.
        </p>
        <p className="text-gray-500 mb-8">
          {error?.message ||
            "Our team has been notified and is working on a fix."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetError}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiRefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {/* Support Message */}
        <p className="mt-8 text-sm text-gray-400">
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default Error500;
