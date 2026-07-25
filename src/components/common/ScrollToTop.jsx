// src/components/common/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Professional scroll management component
 * Scrolls to top on every route change
 * Production-ready with proper cleanup
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Immediate scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth animation for better UX
    });

    // Double-check scroll after DOM updates
    // This handles cases where content loads after the initial scroll
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant", // Instant for second pass
      });
    }, 150);

    // Cleanup timeout on unmount or route change
    return () => clearTimeout(timeoutId);
  }, [pathname, search]); // ✅ Trigger on path AND query param changes

  return null;
};

export default ScrollToTop;