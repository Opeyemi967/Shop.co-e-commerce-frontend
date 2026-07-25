// ==============================================
// ORDER DETAILS PAGE - PROFESSIONAL VERSION
// ==============================================

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowLeft,
  FiDownload,
  FiAlertCircle,
} from "react-icons/fi";
import orderService from "../services/orderService";

// ✅ Import the confirmation hook and modal
import useConfirm from "../hooks/useConfirm";
import ConfirmModal from "../components/common/ConfirmModal";

// ==============================================
// PROFESSIONAL LOADING COMPONENT
// ==============================================
const LoadingState = ({ message = "Loading order details..." }) => (
  <div className="max-w-4xl mx-auto px-4 py-20 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto" />
    <p className="mt-4 text-gray-500">{message}</p>
  </div>
);

// ==============================================
// PROFESSIONAL ERROR COMPONENT
// ==============================================
const ErrorState = ({ message, onRetry }) => (
  <div className="max-w-4xl mx-auto px-4 py-20 text-center">
    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
    <p className="text-gray-500 mb-6">
      {message || "Unable to load order details"}
    </p>
    <button
      onClick={onRetry}
      className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
    >
      Try Again
    </button>
  </div>
);

// ==============================================
// UNAUTHORIZED STATE
// ==============================================
const UnauthorizedState = () => (
  <div className="max-w-4xl mx-auto px-4 py-20 text-center">
    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
    <p className="text-gray-500 mb-6">
      Please login to view your order details
    </p>
    <Link
      to="/login"
      state={{ from: `/order/${id}` }}
      className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition inline-block"
    >
      Login Now
    </Link>
  </div>
);

// ==============================================
// MAIN COMPONENT
// ==============================================
const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================================================================
  //  AUTH STATE FROM REDUX
  // ================================================================
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // ================================================================
  // LOCAL STATE
  // ================================================================
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // ✅ Use the confirmation hook
  const { showConfirm, getConfirmProps } = useConfirm();

  // ================================================================
  // AUTH CHECK - Redirect if not logged in
  // ================================================================
  useEffect(() => {
    if (!isAuthenticated) {
      setUnauthorized(true);
      setLoading(false);
      toast.error("Please login to view order details");
      // Optional: Redirect after 2 seconds
      const timer = setTimeout(() => {
        navigate("/login", { state: { from: `/order/${id}` } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, id]);

  // ================================================================
  // FETCH ORDER - Only if authenticated
  // ================================================================
  useEffect(() => {
    if (!isAuthenticated || !id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);

        // ============================================================
        //  HANDLE SPECIFIC ERROR TYPES
        // ============================================================
        if (error.response?.status === 401) {
          setUnauthorized(true);
          toast.error("Session expired. Please login again");
          navigate("/login", { state: { from: `/order/${id}` } });
        } else if (error.response?.status === 404) {
          setError("Order not found");
        } else {
          setError(
            error.response?.data?.message || "Failed to load order details",
          );
          toast.error("Failed to load order details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  // ================================================================
  // ✅ HANDLE CANCEL ORDER - Professional Confirmation
  // ================================================================
  const handleCancelOrder = async () => {
    // ✅ Show professional confirmation instead of window.confirm
    const confirmed = await showConfirm({
      title: "Cancel Order",
      message:
        "Are you sure you want to cancel this order? This action cannot be undone.",
      confirmText: "Yes, Cancel Order",
      cancelText: "No, Keep Order",
      type: "danger",
    });

    if (confirmed) {
      try {
        setCancelling(true);
        await orderService.cancelOrder(order._id);
        toast.success("Order cancelled successfully");
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel order");
      } finally {
        setCancelling(false);
      }
    }
  };

  // ================================================================
  //  LOADING STATE
  // ================================================================
  if (loading) {
    return <LoadingState message="Loading order details..." />;
  }

  // ================================================================
  //  UNAUTHORIZED STATE
  // ================================================================
  if (unauthorized) {
    return <UnauthorizedState />;
  }

  // ================================================================
  //  ERROR STATE
  // ================================================================
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          // Refetch logic
          const refetch = async () => {
            try {
              const response = await orderService.getOrderById(id);
              setOrder(response.data);
            } catch (err) {
              setError(err.response?.data?.message || "Failed to load order");
            } finally {
              setLoading(false);
            }
          };
          refetch();
        }}
      />
    );
  }

  // ================================================================
  //  NOT FOUND STATE
  // ================================================================
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">
          The order you're looking for doesn't exist or has been removed
        </p>
        <Link
          to="/orders"
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition inline-block"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  // ================================================================
  //  GET ORDER STATUS STYLE
  // ================================================================
  const getStatusStyle = (status) => {
    const styles = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <FiClock size={16} />,
        label: "Pending",
      },
      processing: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <FiPackage size={16} />,
        label: "Processing",
      },
      shipped: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: <FiTruck size={16} />,
        label: "Shipped",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FiCheckCircle size={16} />,
        label: "Delivered",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FiXCircle size={16} />,
        label: "Cancelled",
      },
    };
    return styles[status] || styles.pending;
  };

  const statusStyle = getStatusStyle(order.orderStatus);

  // ✅ Check if order is cancellable
  const isCancellable =
    order.orderStatus === "pending" || order.orderStatus === "processing";

  // ================================================================
  //  RENDER SUCCESS
  // ================================================================
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition mb-6"
      >
        <FiArrowLeft size={18} />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.icon}
            {statusStyle.label}
          </span>
          <button
            onClick={() => window.print()}
            className="p-2 border rounded-full hover:bg-gray-100 transition"
          >
            <FiDownload size={18} />
          </button>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="border rounded-2xl p-6 mb-8">
        <h3 className="font-semibold mb-4">Order Status</h3>
        <div className="flex items-center gap-4">
          {["pending", "processing", "shipped", "delivered"].map(
            (status, index) => {
              const isComplete = order.orderStatus === status;
              const isPast =
                ["pending", "processing", "shipped", "delivered"].indexOf(
                  status,
                ) <=
                ["pending", "processing", "shipped", "delivered"].indexOf(
                  order.orderStatus,
                );

              return (
                <div key={status} className="flex items-center flex-1">
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                        isComplete || isPast
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isComplete || isPast ? (
                        <FiCheckCircle size={16} />
                      ) : (
                        <FiClock size={16} />
                      )}
                    </div>
                    <span className="text-xs capitalize">{status}</span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        isPast ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="border rounded-2xl p-6 mb-8">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="divide-y">
          {order.items.map((item, index) => (
            <div key={index} className="py-4 flex gap-4">
              <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Address */}
        <div className="border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Shipping Address</h3>
          <div className="space-y-1 text-gray-600 text-sm">
            <p>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-2">Email: {order.shippingAddress.email}</p>
            {order.shippingAddress.phone && (
              <p>Phone: {order.shippingAddress.phone}</p>
            )}
          </div>
        </div>

        {/* Payment & Totals */}
        <div className="border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium capitalize">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status</span>
              <span className="font-medium capitalize">
                {order.paymentStatus}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Cancel Order Button - Uses professional modal */}
      {isCancellable && (
        <div className="mt-8 text-center">
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-6 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {cancelling ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Cancelling...
              </>
            ) : (
              "Cancel Order"
            )}
          </button>
        </div>
      )}

      {/* Render the confirmation modal */}
      <ConfirmModal {...getConfirmProps()} />
    </section>
  );
};

export default OrderDetailsPage;
