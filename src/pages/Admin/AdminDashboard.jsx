// ==============================================
// ADMIN DASHBOARD
// ==============================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiShoppingBag,
} from "react-icons/fi";
import adminOrderService from "../../services/adminOrderService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  // Only fetch stats if user is admin
  useEffect(() => {
    // If not admin, don't fetch stats
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await adminOrderService.getStats();
        setStats(response.data);
      } catch (error) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <FiShoppingBag className="text-2xl" />,
      bg: "bg-blue-500",
    },
    {
      label: "Pending",
      value: stats?.pendingOrders || 0,
      icon: <FiClock className="text-2xl" />,
      bg: "bg-yellow-500",
    },
    {
      label: "Processing",
      value: stats?.processingOrders || 0,
      icon: <FiPackage className="text-2xl" />,
      bg: "bg-purple-500",
    },
    {
      label: "Shipped",
      value: stats?.shippedOrders || 0,
      icon: <FiTruck className="text-2xl" />,
      bg: "bg-indigo-500",
    },
    {
      label: "Delivered",
      value: stats?.deliveredOrders || 0,
      icon: <FiCheckCircle className="text-2xl" />,
      bg: "bg-green-500",
    },
    {
      label: "Cancelled",
      value: stats?.cancelledOrders || 0,
      icon: <FiXCircle className="text-2xl" />,
      bg: "bg-red-500",
    },
    {
      label: "Total Revenue",
      value: `$${stats?.totalRevenue || 0}`,
      icon: <FiDollarSign className="text-2xl" />,
      bg: "bg-black",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // If not admin, show nothing (ProtectedRoute handles redirect)
  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage orders and view statistics</p>
        </div>
        <Link
          to="/admin/orders"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          View All Orders
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition"
          >
            <div
              className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-white mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/orders"
            className="p-6 border rounded-2xl hover:bg-gray-50 transition text-left"
          >
            <FiPackage className="text-2xl mb-2" />
            <h3 className="font-semibold">Manage Orders</h3>
            <p className="text-sm text-gray-500">
              View and update order status
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
