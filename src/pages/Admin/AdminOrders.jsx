// ==============================================
// ADMIN ORDERS LIST
// ==============================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEye, FiSearch, FiChevronDown } from "react-icons/fi";
import adminOrderService from "../../services/adminOrderService";

// ✅ Import the confirmation hook and modal - FIXED PATHS
import useConfirm from "../../hooks/useConfirm";
import ConfirmModal from "../../components/common/ConfirmModal";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // ✅ Use the confirmation hook
  const { showConfirm, getConfirmProps } = useConfirm();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await adminOrderService.getAllOrders();
        console.log("Orders received:", response.data);
        console.log("Orders count:", response.data?.length);

        setOrders(response.data || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Handle status update with professional confirmation
  const handleStatusUpdate = async (orderId, newStatus) => {
    // ✅ Show professional confirmation
    const confirmed = await showConfirm({
      title: "Update Order Status",
      message: `Are you sure you want to update this order to "${newStatus}"?`,
      confirmText: "Yes, Update Status",
      cancelText: "No, Cancel",
      type: "warning",
    });

    if (confirmed) {
      try {
        setUpdatingOrderId(orderId);
        await adminOrderService.updateOrderStatus(orderId, newStatus);
        toast.success(`Order status updated to ${newStatus}`);

        // Refresh orders
        const response = await adminOrderService.getAllOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error("Error updating order:", error);
        toast.error(error.response?.data?.message || "Failed to update order");
      } finally {
        setUpdatingOrderId(null);
      }
    }
  };

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

  // Safe filtering with debug
  const filteredOrders = orders.filter((order) => {
    // Safely get values
    const orderNumber = order.orderNumber || order._id || "";
    const userName = order.user?.name || "";
    const userEmail = order.user?.email || "";

    const matchesSearch =
      search === "" ||
      orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      userEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  console.log("Total orders:", orders.length);
  console.log("Filtered orders:", filteredOrders.length);

  // ✅ Quick status update dropdown
  const StatusDropdown = ({ order }) => {
    const statuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    return (
      <select
        value={order.orderStatus || "pending"}
        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
        disabled={updatingOrderId === order._id}
        className={`px-2 py-1 text-sm rounded-full capitalize font-medium border-0 focus:ring-2 focus:ring-black ${getStatusBadge(order.orderStatus)} disabled:opacity-50 cursor-pointer`}
      >
        {statuses.map((status) => (
          <option key={status} value={status} className="text-gray-800">
            {status}
          </option>
        ))}
      </select>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-500">
            {orders.length} total {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>
        <Link
          to="/admin/dashboard"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-50">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {orders.length === 0
                      ? "No orders found"
                      : "No orders match your filters"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {order.orderNumber || order._id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {order.user?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      {/* ✅ Status dropdown with confirmation */}
                      <StatusDropdown order={order} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
                      >
                        <FiEye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Render the confirmation modal */}
      <ConfirmModal {...getConfirmProps()} />
    </div>
  );
};

export default AdminOrders;
