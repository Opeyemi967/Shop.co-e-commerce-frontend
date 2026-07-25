// ==============================================
// ORDER HISTORY PAGE - NO WINDOW.CONFIRM
// ==============================================

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import orderService from "../services/orderService";

// Import components
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ConfirmModal from "../components/common/ConfirmModal";

// ✅ Import the hook
import useConfirm from "../hooks/useConfirm";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ✅ Use the confirmation hook
  const { showConfirm, getConfirmProps } = useConfirm();

  // ================================================================
  // FETCH ORDERS
  // ================================================================
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your orders");
      const timer = setTimeout(() => {
        navigate("/login", { state: { from: "/orders" } });
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (!user) {
      const timer = setTimeout(() => {
        navigate("/login", { state: { from: "/orders" } });
      }, 1000);
      return () => clearTimeout(timer);
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderService.getUserOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(
          error.response?.data?.message || "Failed to load order history",
        );
        toast.error("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated, navigate]);

  // ================================================================
  // ✅ HANDLE CANCEL ORDER - NO WINDOW.CONFIRM
  // ================================================================
  const handleCancelOrder = async (orderId) => {
    // ✅ Show professional modal instead of window.confirm
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
        setCancellingOrderId(orderId);
        // ✅ Just call the API - no confirm in the service
        await orderService.cancelOrder(orderId);

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: "cancelled" }
              : order,
          ),
        );

        toast.success("Order cancelled successfully");
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error(error.response?.data?.message || "Failed to cancel order");
      } finally {
        setCancellingOrderId(null);
      }
    }
  };

  // ================================================================
  // LOADING & ERROR STATES
  // ================================================================
  if (loading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading your orders..."
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            const refetch = async () => {
              try {
                const response = await orderService.getUserOrders();
                setOrders(response.data || []);
              } catch (err) {
                setError(
                  err.response?.data?.message || "Failed to load orders",
                );
                toast.error("Failed to load orders");
              } finally {
                setLoading(false);
              }
            };
            refetch();
          }}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No Orders Yet"
        description="You haven't placed any orders yet. Start shopping!"
        buttonText="Start Shopping"
        buttonLink="/products"
      />
    );
  }

  // ================================================================
  // GET ORDER STATUS STYLE
  // ================================================================
  const getStatusStyle = (status) => {
    const styles = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <FiClock size={16} />,
        label: "Pending",
        cancelable: true,
      },
      processing: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <FiPackage size={16} />,
        label: "Processing",
        cancelable: false,
      },
      shipped: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: <FiTruck size={16} />,
        label: "Shipped",
        cancelable: false,
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FiCheckCircle size={16} />,
        label: "Delivered",
        cancelable: false,
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FiXCircle size={16} />,
        label: "Cancelled",
        cancelable: false,
      },
    };
    return styles[status] || styles.pending;
  };

  // ================================================================
  // ✅ RENDER ORDERS
  // ================================================================
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-akira-super">Order History</h1>
        <p className="text-gray-500 mt-2">
          View all your past orders and track their status
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const statusStyle = getStatusStyle(order.orderStatus);
          const itemCount = order.items?.length || 0;
          const isCancellable =
            statusStyle.cancelable && order.orderStatus !== "cancelled";

          return (
            <div
              key={order._id}
              className="border rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Left: Order Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <span className="font-bold text-lg">
                      #{order.orderNumber || order._id.slice(-8)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.icon}
                      {statusStyle.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">Items:</span>
                      <span className="ml-2 font-medium">{itemCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-bold">
                        ${order.total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment:</span>
                      <span className="ml-2 font-medium capitalize">
                        {order.paymentMethod || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 flex gap-3">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <img
                            src={item.image || "https://via.placeholder.com/48"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {itemCount > 3 && (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-medium text-gray-500">
                          +{itemCount - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    to={`/orders/${order._id}`}
                    className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-black hover:text-white hover:border-black transition flex items-center gap-2"
                  >
                    <FiEye size={16} />
                    View Details
                  </Link>

                  {/* ✅ Cancel Order Button - Uses professional modal */}
                  {isCancellable && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingOrderId === order._id}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-full text-sm font-medium hover:bg-red-50 hover:border-red-400 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingOrderId === order._id ? (
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
                        <>
                          <FiTrash2 size={16} />
                          Cancel Order
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render the professional confirmation modal */}
      <ConfirmModal {...getConfirmProps()} />
    </section>
  );
};

export default OrderHistoryPage;
