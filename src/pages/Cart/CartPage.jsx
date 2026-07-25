// src/pages/Cart/CartPage.jsx

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  removeFromCart,
  updateCartQuantity,
} from "../../redux/slices/cartSlice";

import { usePromoCode } from "../../hooks/usePromoCode";
import { MdChevronRight } from "react-icons/md";

import { FaTrashAlt } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi";
import { toastMessages } from "../../lib/toast";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  // ==========================================
  // PRICE CALCULATIONS
  // ==========================================
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  // ==========================================
  // PROMO CODE HOOK
  // ==========================================
  const {
    promoCode,
    setPromoCode,
    appliedCode,
    isApplying,
    error,
    applyPromoCode,
    removePromoCode,
    discountInfo,
    isFreeShipping,
  } = usePromoCode(subtotal);

  const finalSubtotal = discountInfo.finalSubtotal;
  const discountAmount = discountInfo.discountAmount;

  // ==========================================
  // DELIVERY FEE
  // ==========================================
  const deliveryFee = isFreeShipping ? 0 : (finalSubtotal > 100 ? 0 : 15);
  const total = finalSubtotal + deliveryFee;

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleRemoveFromCart = (itemId, itemName) => {
    dispatch(removeFromCart(itemId));
    const { title, message, icon } = toastMessages.removeFromCart(itemName);
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

  const handleUpdateQuantity = (itemId, newQuantity, itemName) => {
    dispatch(
      updateCartQuantity({
        productId: itemId,
        quantity: newQuantity,
      })
    );
  };

  // ==========================================
  // RENDER
  // ==========================================
  if (cartItems.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center py-20 text-gray-500 text-xl">
          Your cart is empty
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-black transition-colors">
          Home
        </Link>
        <span className="text-gray-300"><MdChevronRight /></span>
        <Link to="/products" className="text-gray-500 hover:text-black transition-colors">
          Products
        </Link>
        <span className="text-gray-300"><MdChevronRight /></span>
        <span className="text-black font-medium">Cart</span>
      </div>

      <h1 className="text-5xl font-akira-super uppercase mb-10">Your Cart</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - Cart Items */}
        <div className="md:col-span-2 lg:col-span-2 border rounded-3xl p-8 h-fit">
          {cartItems.map((item, index) => (
            <div key={item._id}>
              <div className="flex gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-31 h-31 object-cover rounded-2xl bg-[#F5F5F5]"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                      <p className="text-gray-500 mb-1">
                        Size: <span className="text-gray-700">Large</span>
                      </p>
                      <p className="text-gray-500 mb-4">
                        Color: <span className="text-gray-700">White</span>
                      </p>
                      <p className="text-4xl font-bold">${item.price}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.product?._id || item._id, item.name)}
                      className="text-red-500 text-xl cursor-pointer hover:text-red-700 transition-colors duration-200"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>

                  <div className="flex justify-end mt-6">
                    <div className="flex items-center gap-8 bg-[#F5F5F5] px-6 py-4 rounded-full">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            handleUpdateQuantity(
                              item.product?._id || item._id,
                              item.quantity - 1,
                              item.name
                            );
                          }
                        }}
                        className="text-3xl cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      >
                        −
                      </button>
                      <span className="text-lg font-medium">{item.quantity}</span>
                      <button
                        onClick={() => {
                          handleUpdateQuantity(
                            item.product?._id || item._id,
                            item.quantity + 1,
                            item.name
                          );
                        }}
                        className="text-3xl cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {index !== cartItems.length - 1 && <hr className="my-8" />}
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - Order Summary */}
        <div className="md:col-span-2 lg:col-span-1 border rounded-3xl p-8 h-fit">
          <h2 className="text-3xl font-bold mb-8">Order Summary</h2>

          {/* Subtotal */}
          <div className="flex justify-between mb-5 text-xl">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>

          {/* Discount (if promo applied) */}
          {appliedCode && discountAmount > 0 && (
            <div className="flex justify-between mb-5 text-xl text-green-600">
              <span>Discount ({appliedCode.code})</span>
              <span className="font-bold">-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Delivery Fee */}
          <div className="flex justify-between mb-6 text-xl">
            <span className="text-gray-500">Delivery Fee</span>
            <span className="font-bold">{deliveryFee === 0 ? "Free" : `$${deliveryFee}`}</span>
          </div>

          <hr className="mb-8" />

          {/* Total */}
          <div className="flex justify-between mb-8">
            <span className="text-2xl font-medium">Total</span>
            <span className="text-4xl font-bold">${total.toFixed(2)}</span>
          </div>

          {/* Promo Code Input */}
          <div className="flex gap-3 mb-8">
            <div className="flex items-center gap-3 flex-1 bg-[#F5F5F5] px-5 rounded-full">
              <HiOutlineTicket className="text-xl text-gray-500" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder={appliedCode ? `${appliedCode.code} applied ✓` : "Enter promo code"}
                disabled={!!appliedCode}
                className="bg-transparent w-full py-4 outline-none uppercase"
              />
            </div>
            {appliedCode ? (
              <button
                onClick={removePromoCode}
                className="bg-red-500 text-white px-6 rounded-full font-medium hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => applyPromoCode(promoCode)}
                disabled={!promoCode || isApplying}
                className={`px-6 rounded-full font-medium transition-colors ${
                  !promoCode || isApplying
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isApplying ? "..." : "Apply"}
              </button>
            )}
          </div>

          {/* Applied Promo Code Info */}
          {appliedCode && (
            <div className="mb-8 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">
                ✓ "{appliedCode.code}" applied
              </p>
              <p className="text-green-600 text-xs">{appliedCode.description}</p>
              {appliedCode.type === "free_shipping" && (
                <p className="text-green-600 text-xs">✓ Free shipping applied</p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-5 rounded-full text-lg font-medium flex items-center justify-center gap-3 cursor-pointer duration-300 group hover:bg-gray-800 transition-colors"
          >
            Go to Checkout
            <FiArrowRight className="text-xl transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CartPage;