// src/utils/errorHandler.js
import { toast } from "react-hot-toast";

export const handleApiError = (error, showToast = true) => {
  let errorMessage = "An unexpected error occurred. Please try again.";

  if (error.code === "ERR_NETWORK") {
    errorMessage = "Network error. Please check your internet connection.";
  } else if (error.code === "ECONNABORTED") {
    errorMessage = "Request timeout. The server is taking too long to respond.";
  } else if (error.response) {
    // Server responded with an error
    switch (error.response.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 401:
        errorMessage = "Unauthorized. Please log in again.";
        break;
      case 403:
        errorMessage = "You don't have permission to access this resource.";
        break;
      case 404:
        errorMessage = "Resource not found.";
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = "Server error. Our team has been notified.";
        break;
      default:
        errorMessage = error.response.data?.message || errorMessage;
    }
  }

  if (showToast) {
    toast.error(errorMessage);
  }

  return errorMessage;
};
