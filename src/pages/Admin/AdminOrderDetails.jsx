// ==============================================
// ADMIN ORDER DETAILS
// ==============================================

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEdit,
} from "react-icons/fi";
import adminOrderService from "../../services/adminOrderService";

// ✅ Import the confirmation hook and modal
import useConfirm from "../../hooks/useConfirm";
import ConfirmModal from "../../components/common/ConfirmModal";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  // ✅ Use the confirmation hook
  const { showConfirm, getConfirmProps } = useConfirm();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await adminOrderService.getOrderById(id);
        setOrder(response.data);
        setStatus(response.data.orderStatus);
        setTrackingNumber(response.data.trackingNumber || "");
        setEstimatedDelivery(response.data.estimatedDelivery || "");
      } catch (error) {
        toast.error("Failed to load order details");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status] || styles.pending;
  };

  // ✅ Handle status update with professional confirmation
  const handleUpdateStatus = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    // ✅ Show professional confirmation instead of window.confirm
    const confirmed = await showConfirm({
      title: "Update Order Status",
      message: `Are you sure you want to update this order to "${status}"?`,
      confirmText: "Yes, Update Status",
      cancelText: "No, Cancel",
      type: "warning",
    });

    if (confirmed) {
      setUpdating(true);
      try {
        await adminOrderService.updateOrderStatus(id, {
          status,
          trackingNumber,
          estimatedDelivery,
        });
        toast.success("Order updated successfully");
        const response = await adminOrderService.getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        toast.error("Failed to update order");
      } finally {
        setUpdating(false);
      }
    }
  };

  // ✅ Handle delete with professional confirmation
  const handleDeleteOrder = async () => {
    // ✅ Show professional confirmation
    const confirmed = await showConfirm({
      title: "Delete Order",
      message:
        "Are you sure you want to delete this order? This action cannot be undone.",
      confirmText: "Yes, Delete Order",
      cancelText: "No, Keep Order",
      type: "danger",
    });

    if (confirmed) {
      try {
        setDeleting(true);
        await adminOrderService.deleteOrder(id);
        toast.success("Order deleted successfully");
        navigate("/admin/orders");
      } catch (error) {
        toast.error("Failed to delete order");
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <Link to="/admin/orders" className="text-blue-600 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition mb-6"
      >
        <FiArrowLeft size={18} />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(
              order.orderStatus,
            )}`}
          >
            {order.orderStatus}
          </span>
          <button
            onClick={handleDeleteOrder}
            disabled={deleting}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deleting ? "Deleting..." : "Delete Order"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="divide-y">
              {order.items &&
                order.items.map((item, index) => (
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

          {/* Customer Info */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.user?.name || "Unknown"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.user?.email || "Unknown"}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                <span
                  className={`capitalize ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <div className="space-y-1 text-gray-600">
              <p>
                {order.shippingAddress?.firstName || ""}{" "}
                {order.shippingAddress?.lastName || ""}
              </p>
              <p>{order.shippingAddress?.address || ""}</p>
              <p>
                {order.shippingAddress?.city || ""},{" "}
                {order.shippingAddress?.state || ""}{" "}
                {order.shippingAddress?.zipCode || ""}
              </p>
              <p>{order.shippingAddress?.country || ""}</p>
              <p className="mt-2">
                Email: {order.shippingAddress?.email || ""}
              </p>
              {order.shippingAddress?.phone && (
                <p>Phone: {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Update Status */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-2xl p-6 sticky top-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiEdit size={18} />
              Update Order
            </h3>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Estimated Delivery */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Update Button */}
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Order"}
              </button>
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2) || "0.00"}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span>${order.deliveryFee?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${order.total?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render the professional confirmation modal */}
      <ConfirmModal {...getConfirmProps()} />
    </div>
  );
};

export default AdminOrderDetails;
