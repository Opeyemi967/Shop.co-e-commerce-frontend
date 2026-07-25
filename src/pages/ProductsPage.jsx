// src/pages/ProductsPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import Breadcrumb from "../components/common/Breadcrumb";
import { FaChevronDown } from "react-icons/fa";
import Pagination from "../components/common/Pagination";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const style = searchParams.get("style") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 12;

  // ✅ DIRECT API CALL - NO REDUX
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = `https://shop-co-e-commerce-backend.onrender.com/api/v1/products?page=${page}&limit=${limit}`;
        if (style) {
          url += `&style=${style}`;
        }

        console.log("📡 FETCHING:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("📡 DATA:", data);

        if (data.success) {
          setProducts(data.data || []);
          setTotalProducts(data.totalProducts || 0);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.page || page);
        } else {
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("❌ ERROR:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [style, page, limit]);

  // Filter products by search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { name: "Home", path: "/" },
          { name: style ? `${style} Products` : "Products" },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-akira-super text-gray-800">
          {style
            ? `${style.charAt(0).toUpperCase() + style.slice(1)} Products`
            : "All Products"}
        </h1>
        <p className="text-gray-500 text-sm mt-2 md:mt-0">
          {filteredProducts.length} products found
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition"
          />
        </div>

        <div className="sm:w-48 relative">
          <select
            value={style}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                window.location.href = `/products?style=${value}`;
              } else {
                window.location.href = "/products";
              }
            }}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition bg-white appearance-none cursor-pointer"
          >
            <option value="">All Styles</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="party">Party</option>
            <option value="gym">Gym</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <FaChevronDown className="w-4 h-4" />
          </div>
        </div>

        {(style || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm("");
              window.location.href = "/products";
            }}
            className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Clear Filters ✕
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              window.location.href = "/products";
            }}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalProducts}
          itemsPerPage={limit}
          onPageChange={(page) => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            const params = new URLSearchParams(searchParams);
            params.set("page", page);
            window.location.href = `/products?${params.toString()}`;
          }}
        />
      )}

      {filteredProducts.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-8">
          Showing {filteredProducts.length} of {totalProducts} products
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
