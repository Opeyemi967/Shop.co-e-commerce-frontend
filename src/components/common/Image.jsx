// ================================================================
// PROFESSIONAL IMAGE COMPONENT - With Blur-Up & Optimization
// ================================================================

import { useState } from "react";
import { getImage } from "../../config/images";

const Image = ({
  src,
  alt = "",
  width = 600,
  height = 600,
  quality = 70,
  className = "",
  priority = false,
  objectFit = "cover",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no src or error, show fallback
  if (!src || hasError) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  // Generate optimized URLs
  const blurImage = getImage(src, { width: 20, quality: 10 });
  const fullImage = getImage(src, { width, height, quality });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur-up placeholder - loads instantly */}
      {!isLoaded && (
        <img
          src={blurImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          aria-hidden="true"
        />
      )}

      {/* Main image - loads in background */}
      <img
        src={fullImage}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`w-full h-full object-${objectFit} transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default Image;
