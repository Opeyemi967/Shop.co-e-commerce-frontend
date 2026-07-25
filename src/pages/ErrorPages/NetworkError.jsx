// src/pages/ErrorPages/NetworkError.jsx
import { Link } from "react-router-dom";
import { FiWifiOff, FiRefreshCw, FiHome } from "react-icons/fi";

const NetworkError = ({ onRetry }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto relative">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M40 70 Q100 40 160 70"
                stroke="#9CA3AF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M60 100 Q100 80 140 100"
                stroke="#9CA3AF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M80 130 Q100 115 120 130"
                stroke="#9CA3AF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="100" cy="155" r="10" fill="#F59E0B" />
              <text x="50" y="180" fontSize="14" fill="#6B7280">
                Network Error
              </text>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Connection Lost
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Unable to connect to our servers.
        </p>
        <p className="text-gray-500 mb-8">
          Please check your internet connection and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiRefreshCw className="w-5 h-5" />
            Retry Connection
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
