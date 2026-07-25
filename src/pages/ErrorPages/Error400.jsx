// src/pages/ErrorPages/Error404.jsx
import { Link } from "react-router-dom";
import { FiHome, FiArrowLeft } from "react-icons/fi";

const Error404 = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto relative">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle cx="100" cy="90" r="50" fill="#F3F4F6" />
              <circle cx="80" cy="80" r="10" fill="#9CA3AF" />
              <circle cx="120" cy="80" r="10" fill="#9CA3AF" />
              <path
                d="M75 105 Q100 120 125 105"
                stroke="#6B7280"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <rect
                x="60"
                y="140"
                width="80"
                height="10"
                rx="5"
                fill="#9CA3AF"
              />
              <text x="50" y="180" fontSize="14" fill="#6B7280">
                404
              </text>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404;
