// src/components/common/ScrollManager.jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Advanced scroll management with restoration
 * Remembers scroll position per route
 * Professional production-grade solution
 */
const ScrollManager = () => {
  const { pathname, search } = useLocation();
  const scrollPositions = useRef(new Map());

  // Save scroll position before leaving
  useEffect(() => {
    const saveScrollPosition = () => {
      const key = pathname + search;
      scrollPositions.current.set(key, window.scrollY);
    };

    // Save on beforeunload
    window.addEventListener("beforeunload", saveScrollPosition);

    return () => {
      window.removeEventListener("beforeunload", saveScrollPosition);
    };
  }, [pathname, search]);

  // Restore scroll position on route change
  useEffect(() => {
    const key = pathname + search;
    const savedPosition = scrollPositions.current.get(key);

    // Scroll to saved position or top
    const targetPosition = savedPosition || 0;
    
    // Use requestAnimationFrame for smooth scrolling after DOM paint
    requestAnimationFrame(() => {
      window.scrollTo({
        top: targetPosition,
        behavior: savedPosition ? "instant" : "smooth",
      });
    });

    // Clean up old positions (keep last 50)
    if (scrollPositions.current.size > 50) {
      const entries = Array.from(scrollPositions.current.entries());
      const toDelete = entries.slice(0, entries.length - 50);
      toDelete.forEach(([key]) => scrollPositions.current.delete(key));
    }
  }, [pathname, search]);

  return null;
};

export default ScrollManager;