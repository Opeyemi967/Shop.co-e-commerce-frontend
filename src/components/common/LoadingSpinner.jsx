// ================================================================
// LOADING SPINNER COMPONENT
// ================================================================

const LoadingSpinner = ({
  size = "md",
  color = "black",
  text = "",
  fullScreen = false,
  className = "",
}) => {
  // Size variants
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-4",
  };

  // Color variants
  const colorClasses = {
    black: "border-gray-300 border-t-black",
    white: "border-gray-600 border-t-white",
    blue: "border-gray-300 border-t-blue-600",
    primary: "border-gray-300 border-t-blue-600",
  };

  const spinnerClass = `inline-block ${sizeClasses[size] || sizeClasses.md} ${
    colorClasses[color] || colorClasses.black
  } rounded-full animate-spin ${className}`;

  // Full screen loading
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className={spinnerClass} />
          {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  // Inline loading
  return (
    <div className="text-center py-10">
      <div className={spinnerClass} />
      {text && <p className="mt-4 text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
