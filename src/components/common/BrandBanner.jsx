// src/components/common/BrandBanner.jsx
import { useEffect, useRef } from "react";

const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

const BrandBanner = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let position = 0;
    const speed = 0.8; // Adjust for speed

    const animate = () => {
      // Move position
      position += speed;

      // Reset seamlessly when reaching half the width
      if (position >= container.scrollWidth / 2) {
        position = 0;
      }

      // Apply transform
      container.style.transform = `translateX(-${position}px)`;

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="w-full bg-black text-white py-8 overflow-hidden">
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-16 whitespace-nowrap will-change-transform"
          style={{
            transform: "translateX(0)",
          }}
        >
          {/* Double the brands for seamless loop */}
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="font-akira-bold text-2xl md:text-3xl lg:text-4xl tracking-wider shrink-0 transition-opacity duration-300 hover:opacity-70 cursor-default"
            >
              {brand}
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-linear-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-linear-to-l from-black to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default BrandBanner;
