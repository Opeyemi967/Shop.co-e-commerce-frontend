// ==============================================
// PRODUCT GALLERY - Thumbnails Left (Desktop) / Below (Mobile)
// ==============================================

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getImage } from "../../config/images";

const ProductGallery = ({
  images,
  productName,
  selectedColor,
  setSelectedColor,
  colors = [],
  onColorSelect,
  showColorPicker = false,
}) => {
  // Filter out empty/invalid images
  const imageArray = Array.isArray(images)
    ? images.filter(
        (img) =>
          img &&
          typeof img === "string" &&
          img.trim() !== "" &&
          img !== "undefined" &&
          img !== "null" &&
          !img.includes("placeholder"),
      )
    : [];

  const [selectedImage, setSelectedImage] = useState(imageArray[0] || "");
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  // Only show navigation arrows if MORE THAN 3 images
  const shouldShowNavigation = imageArray.length > 3;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % imageArray.length);
  };

  const previousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  // ✅ Handle color selection with validation
  const handleColorSelect = (color) => {
    if (!color) {
      toast.error("Please select a valid color");
      return;
    }

    if (onColorSelect) {
      onColorSelect(color);
    } else if (setSelectedColor) {
      setSelectedColor(color);
    }

    // Optional: Show success toast
    toast.success(`${color} selected`);
  };

  // ✅ Validate color selection
  const validateColorSelection = () => {
    if (!selectedColor) {
      toast.error("Please select a color before adding to cart");
      return false;
    }
    return true;
  };

  if (imageArray.length === 0) {
    return (
      <div className="bg-[#F0F0F0] rounded-2xl p-6">
        <div className="w-full h-100 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p>No image available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* ============================================================ */}
      {/* THUMBNAILS - Left side on desktop, below on mobile */}
      {/* ============================================================ */}
      <div className="order-2 md:order-1">
        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-150 pb-2 md:pb-0">
          {imageArray.map((image, index) => {
            // Skip if image is invalid
            if (!image || typeof image !== "string" || image.trim() === "") {
              return null;
            }

            const thumbnailUrl = getImage(image, {
              width: 300,
              height: 300,
              quality: 75,
              crop: "fill",
            });

            const isActive = selectedImage === image;

            return (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`
                  shrink-0
                  w-17.5 h-17.5 md:w-20 md:h-20
                  rounded-xl overflow-hidden
                  border-2 transition-all duration-200
                  ${
                    isActive
                      ? "border-black ring-2 ring-black ring-offset-2"
                      : "border-gray-200 hover:border-gray-400"
                  }
                `}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={thumbnailUrl}
                  alt={`${productName} - view ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.parentElement.style.display = "none";
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN IMAGE - Takes remaining space */}
      {/* ============================================================ */}
      <div className="order-1 md:order-2 flex-1">
        <div className="relative bg-[#F0F0F0] rounded-2xl overflow-hidden aspect-square">
          {/* Loading skeleton */}
          {!mainImageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-linear-to-r from-gray-200 via-gray-300 to-gray-200" />
          )}

          {/* Main image */}
          <img
            src={getImage(selectedImage, {
              width: 600,
              height: 600,
              quality: 80,
              crop: "fill",
            })}
            alt={productName || "Product"}
            className={`
              w-full h-full object-cover
              transition-opacity duration-500
              ${mainImageLoaded ? "opacity-100" : "opacity-0"}
            `}
            onLoad={() => setMainImageLoaded(true)}
            loading="eager"
          />

          {/* ============================================================ */}
          {/* NAVIGATION ARROWS - Only show if MORE THAN 3 images */}
          {/* ============================================================ */}
          {shouldShowNavigation && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Next image"
              >
                <FaChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* ============================================================ */}
        {/* COLOR SELECTION - Below main image */}
        {/* ============================================================ */}
        {showColorPicker && colors && colors.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Color:</span>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all duration-200
                      ${
                        selectedColor === color
                          ? "border-black ring-2 ring-black ring-offset-2"
                          : "border-gray-300 hover:border-gray-500"
                      }
                    `}
                    style={{ backgroundColor: color.toLowerCase() }}
                    aria-label={`Select ${color} color`}
                    title={`Select ${color}`}
                  />
                ))}
              </div>
              {selectedColor && (
                <span className="text-sm text-gray-500 capitalize">
                  {selectedColor}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
