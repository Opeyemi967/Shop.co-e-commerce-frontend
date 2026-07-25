// ==============================================
// ADMIN ORDER SERVICE
// ==============================================

import api from "./api";

const adminOrderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await api.get("/admin/orders");
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || { message: "Failed to fetch orders" };
    }
  },

  // Get single order
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch order" };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, data) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update order" };
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete order" };
    }
  },

  // Get order statistics
  getStats: async () => {
    try {
      const response = await api.get("/admin/orders/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch stats" };
    }
  },
};

export default adminOrderService;
