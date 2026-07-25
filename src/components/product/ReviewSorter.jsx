// ==============================================
// REVIEW SORTER - Mobile Optimized
// ==============================================

import { FaChevronDown } from "react-icons/fa";
import { useEffect, useRef } from "react";

const ReviewSorter = ({
  sortBy,
  setSortBy,
  isSortOpen,
  setIsSortOpen,
  totalReviews = 0, // ✅ Add total reviews prop
}) => {
  const dropdownRef = useRef(null);

  const options = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "highest", label: "Highest Rated" },
    { value: "lowest", label: "Lowest Rated" },
    { value: "mostHelpful", label: "Most Helpful" },
  ];

  const getCurrentLabel = () => {
    const option = options.find((opt) => opt.value === sortBy);
    return option ? option.label : "Latest";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSortOpen]);

  return (
    // ✅ Container with flex to push sort to the right
    <div className="flex items-center justify-between w-full mb-4">
      {/* ✅ Left side: Review count */}
      <div className="text-sm text-gray-600">
        {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
      </div>

      {/* ✅ Right side: Sort dropdown */}
      <div className="relative inline-block" ref={dropdownRef}>
        {/* ============================================================ */}
        {/* DROPDOWN BUTTON */}
        {/* ============================================================ */}
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center gap-2 px-4 h-11 rounded-full bg-[#F5F5F5] font-medium hover:bg-gray-200 transition text-sm"
        >
          <span className="whitespace-nowrap">Sort: {getCurrentLabel()}</span>
          <FaChevronDown
            className={`text-xs transition-transform duration-200 ${
              isSortOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* ============================================================ */}
        {/* DROPDOWN MENU - Right aligned */}
        {/* ============================================================ */}
        {isSortOpen && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-40 sm:hidden"
              onClick={() => setIsSortOpen(false)}
            />

            <div className="absolute right-0 top-full mt-2 min-w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition text-sm ${
                    sortBy === option.value
                      ? "text-black font-medium bg-gray-50"
                      : "text-gray-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewSorter;
