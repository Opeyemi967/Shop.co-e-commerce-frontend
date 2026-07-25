// src/pages/PaymentVerificationPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

const PaymentVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState(null);

  console.log("🔍 PaymentVerificationPage RENDERED");
  console.log("🔍 URL:", window.location.href);
  console.log("🔍 Search Params:", Object.fromEntries(searchParams));

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("reference");
        const trxref = searchParams.get("trxref");

        console.log("🔍 Reference:", reference);
        console.log("🔍 Trxref:", trxref);

        const finalReference = reference || trxref;

        if (!finalReference) {
          console.warn("⚠️ No reference found in URL");
          setStatus("failed");
          setError("No payment reference found. Please contact support.");
          setVerifying(false);
          return;
        }

        // ✅ Verify with backend
        const apiUrl =
          import.meta.env.VITE_API_URL ||
          "https://shop-co-e-commerce-backend.onrender.com/api/v1";
        const token = localStorage.getItem("token");

        console.log(
          "🔍 Verifying with API:",
          `${apiUrl}/payments/verify/${finalReference}`,
        );

        const response = await fetch(
          `${apiUrl}/payments/verify/${finalReference}`,
          {
            method: "GET",
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        console.log("🔍 Verification response:", data);

        if (data.success) {
          setStatus("success");
          toast.success("Payment verified successfully!");

          setTimeout(() => {
            navigate("/order-confirmation", {
              state: {
                orderId: data.orderId || data.data?._id,
                reference: finalReference,
              },
            });
          }, 2000);
        } else {
          setStatus("failed");
          setError(data.message || "Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
        setError("Unable to verify payment. Please contact support.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  // ✅ Loading State
  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FiLoader className="w-12 h-12 animate-spin text-black mx-auto" />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
          <p className="mt-2 text-xs text-gray-400">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  // ✅ Success State
  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment has been confirmed. Redirecting to order
            confirmation...
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Failed State
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiXCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Verification Failed
        </h2>
        <p className="text-gray-600 mb-2">
          {error || "We couldn't verify your payment."}
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Reference:{" "}
          {searchParams.get("reference") || searchParams.get("trxref") || "N/A"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationPage;
