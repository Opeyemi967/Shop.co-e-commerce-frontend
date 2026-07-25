// frontend/src/hooks/useApi.js
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

/**
 * ✅ Custom hook for API calls with error handling
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError(null);
        setIsServerError(false);
        setIsNetworkError(false);

        const result = await apiFunction(...params);
        setData(result);
        return result;
      } catch (err) {
        console.error("API Error:", err);

        // ✅ Categorize error
        const status = err.response?.status || err.status || 0;
        const message =
          err.response?.data?.message || err.message || "An error occurred";

        // Network Error
        if (err.code === "ERR_NETWORK" || err.message?.includes("network")) {
          setIsNetworkError(true);
          toast.error("Network error. Please check your internet connection.");
          setError({
            type: "network",
            message: "Network error. Please check your connection.",
          });
        }
        // Server Error (500, 502, 503, 504)
        else if (status >= 500) {
          setIsServerError(true);
          toast.error(message || "Server error. Please try again later.");
          setError({ type: "server", message, status });
        }
        // Client Error - Don't show toast for 404 (handled by error page)
        else if (status === 404) {
          setError({ type: "notfound", message: "Resource not found", status });
        }
        // Other Client Errors
        else if (status < 500 && status !== 0) {
          toast.error(message);
          setError({ type: "client", message, status });
        }
        // Unknown Error
        else {
          toast.error(message);
          setError({ type: "unknown", message });
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction],
  );

  const resetError = useCallback(() => {
    setError(null);
    setIsServerError(false);
    setIsNetworkError(false);
  }, []);

  return {
    data,
    loading,
    error,
    isServerError,
    isNetworkError,
    execute,
    resetError,
  };
};

export default useApi;
