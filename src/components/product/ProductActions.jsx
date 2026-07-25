// src/components/product/ProductActions.jsx
import { useState } from "react";
import { FaHeart, FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist } from "../../redux/slices/wishlistSlice";
import { toastMessages } from "../../lib/toast";
import ProtectedAction from "../common/ProtectedAction";

const ProductActions = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ✅ Local state only for quantity
  const [quantity, setQuantity] = useState(1);

  // ✅ Available options from product
  const colors = product.colors || [
    { name: "Black", hex: "#1A1A1A" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gray", hex: "#808080" },
    { name: "Navy", hex: "#1B2A4A" },
  ];

  const sizes = product.sizes || ["Small", "Medium", "Large", "X-Large"];

  // ================================================================
  // HANDLERS
  // ================================================================
  const handleAddToCart = () => {
    // ✅ Validate size
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    // ✅ Validate color
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const productData = {
      ...product,
      quantity,
      selectedColor: selectedColor?.name || null,
      selectedSize,
    };

    dispatch(addToCart(productData));

    const { title, message, icon } = toastMessages.addToCart(
      productData.name,
      productData.selectedSize,
      productData.selectedColor,
    );

    toast.success(
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>,
    );
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product));
    const { title, message, icon } = toastMessages.addToWishlist(product.name);
    toast.success(
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>,
    );
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Color Selection */}
      <div className="border-t border-gray-200 pt-6 md:pt-8">
        <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-5">
          Select Colors
        </p>
        <div className="flex gap-3 md:gap-4 flex-wrap">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`
                w-10 h-10 md:w-12 md:h-12 rounded-full 
                flex items-center justify-center 
                transition-all duration-200 hover:scale-110
                border-2 ${
                  selectedColor?.name === color.name
                    ? "border-black ring-2 ring-black ring-offset-2"
                    : "border-gray-300"
                }
              `}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select ${color.name} color`}
            >
              {selectedColor?.name === color.name && (
                <FaCheck
                  className={`text-sm ${
                    color.hex === "#FFFFFF" ? "text-black" : "text-white"
                  }`}
                />
              )}
            </button>
          ))}
        </div>
        {selectedColor && (
          <p className="text-sm text-gray-500 mt-2">
            Selected: <span className="font-medium">{selectedColor.name}</span>
          </p>
        )}
      </div>

      {/* Size Selection */}
      <div className="border-t border-gray-200 pt-6 md:pt-8">
        <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-5">
          Choose Size
        </p>
        <div className="flex gap-3 md:gap-4 flex-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`
                px-6 md:px-8 py-3 md:py-4 rounded-full 
                text-sm md:text-base font-medium
                transition-all duration-200
                ${
                  selectedSize === size
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
        {selectedSize && (
          <p className="text-sm text-gray-500 mt-2">
            Selected: <span className="font-medium">{selectedSize}</span>
          </p>
        )}
      </div>

      {/* Quantity + Add to Cart + Wishlist */}
      <div className="border-t border-gray-200 pt-6 md:pt-8">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          {/* Quantity Counter */}
          <div
            className={`
            flex items-center justify-between 
            bg-gray-100 px-6 py-3 rounded-full 
            min-w-35 sm:min-w-40
            ${!isAuthenticated ? "opacity-60" : ""}
          `}
          >
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
                } else {
                  toast.error("Please login to modify quantity");
                }
              }}
              className="text-base hover:text-black transition disabled:opacity-50"
              disabled={!isAuthenticated}
            >
              <FaMinus />
            </button>
            <span className="text-xl font-medium">{quantity}</span>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setQuantity((prev) => prev + 1);
                } else {
                  toast.error("Please login to modify quantity");
                }
              }}
              className="text-base hover:text-black transition disabled:opacity-50"
              disabled={!isAuthenticated}
            >
              <FaPlus />
            </button>
          </div>

          {/* Add to Cart Button */}
          <ProtectedAction
            action={handleAddToCart}
            message="Please login to add items to your cart"
            className="flex-1"
          >
            <button
              className="
              w-full bg-black text-white 
              py-3 md:py-4 px-6 rounded-full 
              text-sm md:text-base font-medium 
              hover:bg-gray-800 transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            >
              Add to Cart
            </button>
          </ProtectedAction>

          {/* Wishlist Button */}
          <ProtectedAction
            action={handleAddToWishlist}
            message="Please login to save items to your wishlist"
          >
            <button
              className="
              w-12.5 md:w-15 h-12.5 md:h-15 
              rounded-full border-2 border-gray-200 
              flex items-center justify-center 
              text-lg md:text-xl 
              hover:bg-gray-50 hover:border-black 
              transition-all duration-200
              shrink-0
            "
            >
              <FaHeart />
            </button>
          </ProtectedAction>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
