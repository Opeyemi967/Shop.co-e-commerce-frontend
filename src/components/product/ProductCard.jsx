// ==============================================
// IMPORTS
// ==============================================

// React Router Link
// Makes the whole product card clickable

import { Link, useNavigate } from "react-router-dom";

// Import star icons from React Icons

import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
} from "react-icons/fa";

// ==============================================
// SCROLL TO TOP HELPER
// ==============================================

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// ==============================================
// PRODUCT CARD COMPONENT
// ==============================================

function ProductCard({ product }) {
  const navigate = useNavigate();

  // Safety check

  if (!product) return null;

  // =====================================
  // STAR RATING LOGIC
  // =====================================

  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }

    return stars;
  };

  // =====================================
  // HANDLE NAVIGATION WITH SCROLL
  // =====================================

  const handleProductClick = (e) => {
    e.preventDefault();
    scrollToTop();
    navigate(`/products/${product._id}`, {
      state: {
        from: "/products",
        fromName: "Products",
      },
    });
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    scrollToTop();
    navigate(`/products/${product._id}`, {
      state: {
        from: "/products",
        fromName: "Products",
        fromAddToCart: true,
      },
    });
  };

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* ===================================== */}
      {/* PRODUCT IMAGE - Clickable */}
      {/* ===================================== */}

      <div
        onClick={handleProductClick}
        className="block cursor-pointer group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleProductClick(e);
          }
        }}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Discount Badge */}
          {product.discountPercentage && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discountPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* ===================================== */}
      {/* PRODUCT INFO */}
      {/* ===================================== */}

      <div className="p-4">
        {/* PRODUCT NAME */}
        <div
          onClick={handleProductClick}
          className="block cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleProductClick(e);
            }
          }}
        >
          <h3 className="text-base font-bold line-clamp-2 hover:text-black/70 transition">
            {product.name}
          </h3>
        </div>

        {/* PRODUCT RATING */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            {renderStars(product.rating)}
          </div>
          <p className="text-sm text-gray-600">{product.rating}/5</p>
        </div>

        {/* PRODUCT PRICE */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <h2 className="text-xl font-bold">${product.price}</h2>

          {product.oldPrice && (
            <p className="text-gray-400 line-through text-base">
              ${product.oldPrice}
            </p>
          )}

          {product.discountPercentage && (
            <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-0.5 rounded-full">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* ===================================== */}
        {/* ADD TO CART BUTTON */}
        {/* ===================================== */}

        <button
          onClick={handleAddToCartClick}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-medium py-2.5 px-4 rounded-full hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
          aria-label={`Add ${product.name} to cart`}
        >
          <FaShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
