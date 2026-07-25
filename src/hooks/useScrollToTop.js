// src/hooks/useScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Professional hook for scroll management
 * Can be used on individual pages for custom scroll behavior
 */
const useScrollToTop = (options = {}) => {
  const { pathname } = useLocation();
  const { behavior = "smooth", delay = 0, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: behavior,
      });
    };

    // Immediate scroll
    scrollToTop();

    // Handle dynamic content loading
    const timeoutId = setTimeout(scrollToTop, delay);

    return () => clearTimeout(timeoutId);
  }, [pathname, behavior, delay, enabled]);
};

export default useScrollToTop;
