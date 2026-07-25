// ================================================================
// PROTECTED ACTION - Requires Login for certain actions
// ================================================================

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ProtectedAction = ({
  children,
  action,
  onSuccess,
  message = "Please login to continue",
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show toast notification
      toast.error(
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">Login Required</p>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>,
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            padding: "16px 20px",
            maxWidth: "380px",
          },
        }
      );

      // Redirect to login after toast
      setTimeout(() => {
        navigate("/login", { state: { from: location.pathname } });
      }, 1500);

      return;
    }

    // If authenticated, call the action
    if (action) {
      action();
    }

    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export default ProtectedAction;
