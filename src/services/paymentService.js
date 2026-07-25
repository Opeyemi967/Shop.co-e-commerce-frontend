// ==============================================
// PAYMENT SERVICE
// ==============================================

import api from "./api";

const paymentService = {
  // Initialize payment
  initializePayment: async (orderId) => {
    try {
      const response = await api.post("/payments/initialize", { orderId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to initialize payment" };
    }
  },

  // Verify payment (for callback)
  verifyPayment: async (reference) => {
    try {
      const response = await api.get(`/payments/verify?reference=${reference}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to verify payment" };
    }
  },
};

export default paymentService;
