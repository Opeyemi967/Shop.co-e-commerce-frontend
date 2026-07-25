// ==============================================
// ERROR STATE - Professional Error Component
// ==============================================
// src/components/common/ErrorState.jsx

const ErrorState = ({
  message = "Something went wrong",
  subMessage = "Please try again",
  onRetry,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">{message}</h2>

        {/* Description */}
        <p className="text-gray-500 mb-6">{subMessage}</p>

        {/* Retry Button (optional) */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
