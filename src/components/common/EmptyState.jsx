// ==============================================
// EMPTY STATE - Professional Empty State Component
// ==============================================
// src/components/common/EmptyState.jsx

import { Link } from "react-router-dom";

const EmptyState = ({
  title = "Nothing here yet",
  description = "Start exploring to find what you're looking for",
  buttonText = "Get Started",
  buttonLink = "/",
  onButtonClick,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">{title}</h2>

        {/* Description */}
        <p className="text-gray-500 mb-6">{description}</p>

        {/* Button - Link version */}
        {buttonLink && !onButtonClick && (
          <Link
            to={buttonLink}
            className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            {buttonText}
          </Link>
        )}

        {/* Button - Click handler version */}
        {onButtonClick && (
          <button
            onClick={onButtonClick}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
