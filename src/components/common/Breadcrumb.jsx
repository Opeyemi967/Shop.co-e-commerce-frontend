// ==============================================
// IMPORTS
// ==============================================

import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

// ==============================================
// BREADCRUMB COMPONENT
// ==============================================

function Breadcrumb({ items = [] }) {
  return (
    <div className="flex items-center gap-3 text-gray-500 text-sm mb-8 flex-wrap">
      {/* ================================= */}
      {/* DYNAMIC ITEMS */}
      {/* ================================= */}

      {(items || []).map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          {/* Professional Arrow Icon */}

          <FaChevronRight className="text-xs text-gray-400" />

          {/* Clickable breadcrumb */}

          {item.path ? (
            <Link to={item.path} className="hover:text-black transition">
              {item.name}
            </Link>
          ) : (
            <span className="text-black font-medium">{item.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Breadcrumb;
