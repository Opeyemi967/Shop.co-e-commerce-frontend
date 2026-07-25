// ==============================================
// IMPORTS
// ==============================================

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import { removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartSlice";

import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineChevronRight } from "react-icons/md";
import { HiShoppingCart } from "react-icons/hi";

// ================================================================
// IMPORT TOAST MESSAGES FROM CONFIG
// ================================================================
import { toastMessages } from "../../lib/Toast";

// ==============================================
// WISHLIST PAGE
// ==============================================

function WishlistPage() {
  const dispatch = useDispatch();

  const { wishlistItems } = useSelector((state) => state.wishlist);

  // ================================================================
  // HANDLER: REMOVE FROM WISHLIST WITH TOAST NOTIFICATION
  // ================================================================
  const handleRemoveFromWishlist = (itemId, itemName) => {
    dispatch(removeFromWishlist(itemId));

    const { title, message, icon } = toastMessages.removeFromWishlist(itemName);

    toast.success(
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
    );
  };

  // ================================================================
  // HANDLER: MOVE TO CART WITH TOAST NOTIFICATION
  // ================================================================

  const handleMoveToCart = (item) => {
    // Make sure we have the correct product data
    const productData = {
      _id: item._id, // ← This must match the backend's 'productId'
      name: item.name || "Product",
      price: item.price || 0,
      image: item.image || "",
      quantity: 1,
      selectedColor: item.selectedColor || "",
      selectedSize: item.selectedSize || "",
    };

    console.log("Moving to cart:", productData);

    // Dispatch add to cart
    dispatch(addToCart(productData))
      .unwrap()
      .then(() => {
        // Remove from wishlist after successful add
        dispatch(removeFromWishlist(item._id));

        // Show success toast
        toast.success(
          <div className="flex items-center gap-3">
            <span className="text-2xl"><HiShoppingCart /></span>
            <div>
              <p className="font-medium">Moved to Cart</p>
              <p className="text-sm text-gray-500">{item.name}</p>
            </div>
          </div>
        );
      })
      .catch((error) => {
        console.error("Failed to move to cart:", error);
        toast.error("Failed to move to cart. Please try again.");
      });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* ============================================================ */}
      {/* BREADCRUMB NAVIGATION - Same as Cart page */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/"
          className="text-gray-500 hover:text-black transition-colors"
        >
          Home
        </Link>
        <span className="text-gray-300"><MdOutlineChevronRight /></span>
        <Link
          to="/products"
          className="text-gray-500 hover:text-black transition-colors"
        >
          Products
        </Link>
        <span className="text-gray-300"><MdOutlineChevronRight /></span>
        <span className="text-black font-medium">Wishlist</span>
      </div>

      {/* Page Title */}
      <h1 className="text-5xl font-akira-super uppercase mb-10">Wishlist</h1>

      {/* Empty Wishlist */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-xl">
          Your wishlist is empty
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div key={item._id} className="border rounded-3xl p-5">
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-75 object-cover rounded-[20px] mb-5"
              />

              {/* Product Info */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                  <p className="text-2xl font-bold">${item.price}</p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                  className="text-red-500 text-lg cursor-pointer hover:text-red-700 transition-colors duration-200"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <FaTrashAlt />
                </button>
              </div>

              {/* Move To Cart */}
              <button
                onClick={() => handleMoveToCart(item)}
                className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default WishlistPage;
