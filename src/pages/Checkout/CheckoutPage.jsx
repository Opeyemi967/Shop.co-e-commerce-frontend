import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiArrowRight,
  FiTruck,
  FiCreditCard,
  FiUser,
  FiMapPin,
} from "react-icons/fi";
import { HiShoppingCart } from "react-icons/hi";
import orderService from "../../services/orderService";
import { clearCart } from "../../redux/slices/cartSlice";
import paymentService from "../../services/paymentService";
import { MdChevronRight } from "react-icons/md";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { cartItems, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // =============================================
  // Set initial state directly (no useEffect needed!)
  // =============================================
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nigeria",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // =============================================
  // PRICE CALCULATIONS
  // =============================================
  const subtotal =
    cartItems?.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0,
    ) || 0;

  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = subtotal > 100 ? 0 : 15;
  const total = subtotal - discount + deliveryFee;

  // =============================================
  // VALIDATION
  // =============================================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =============================================
  // HANDLE INPUT CHANGE
  // =============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // =============================================
  // FORMAT ITEMS FOR BACKEND
  // =============================================
  const formatOrderItems = () => {
    return cartItems.map((item) => ({
      product: item.product?._id || item._id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image,
    }));
  };

  // =============================================
  // HANDLE SUBMIT - FIXED WITH PAYSTACK CALLBACK
  // =============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: formatOrderItems(),
        shippingAddress: formData,
        paymentMethod,
        subtotal,
        discount,
        deliveryFee,
        total: total,
      };

      const orderResponse = await orderService.createOrder(orderData);
      const order = orderResponse.data;

      console.log("Order created:", order);

      // ✅ Initialize payment with Paystack
      const paymentResponse = await paymentService.initializePayment(order._id);

      console.log("Payment response:", paymentResponse);

      if (paymentResponse.success) {
        // ✅ Clear cart and redirect to Paystack
        dispatch(clearCart());

        // ✅ Store order reference for verification
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: order._id,
            reference: paymentResponse.data.reference,
            email: formData.email,
          }),
        );

        // ✅ Redirect to Paystack
        window.location.href = paymentResponse.data.authorization_url;
      } else {
        toast.error(paymentResponse.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to process order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =============================================
  // EMPTY CART CHECK
  // =============================================
  if ((!cartItems || cartItems.length === 0) && !loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">
          <HiShoppingCart />
        </div>
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">
          Add some items to your cart before checking out.
        </p>
        <Link
          to="/products"
          className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-gray-500 hover:text-black transition">
          Home
        </Link>
        <span className="text-gray-300">
          <MdChevronRight />
        </span>
        <Link to="/cart" className="text-gray-500 hover:text-black transition">
          Cart
        </Link>
        <span className="text-gray-300">
          <MdChevronRight />
        </span>
        <span className="text-black font-medium">Checkout</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-akira-super mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - FORM */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="border rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FiUser className="text-black" />
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FiMapPin className="text-black" />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Lagos"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Lagos"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.zipCode ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="100001"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FiCreditCard className="text-black" />
                Payment Method
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border rounded-lg text-center transition ${
                    paymentMethod === "card"
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`p-4 border rounded-lg text-center transition ${
                    paymentMethod === "bank"
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-4 border rounded-lg text-center transition ${
                    paymentMethod === "wallet"
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  Wallet
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-full text-lg font-medium flex items-center justify-center gap-3 transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
              <FiArrowRight className="text-xl" />
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="lg:col-span-1">
          <div className="border rounded-2xl p-6 md:p-8 sticky top-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="mb-4 text-sm text-gray-500">
              {cartItems?.length || 0} item{cartItems?.length !== 1 ? "s" : ""}{" "}
              in cart
            </div>

            <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
              {cartItems?.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.price || 0) * (item.quantity || 1)}
                  </span>
                </div>
              ))}
              {cartItems?.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{cartItems.length - 3} more items
                </div>
              )}
            </div>

            <hr className="my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount (20%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee}`}</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-500 flex items-center gap-2">
              <FiTruck />
              <span>
                {deliveryFee === 0 ? "Free Delivery" : "Standard Delivery"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
