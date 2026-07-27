// src/pages/ProductsPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Debug: Log when the module loads
console.log("🔵 ProductsPage module loaded");

const ProductsPage = () => {
  // Debug: Log when the component renders
  console.log("🔵 ProductsPage component rendering");

  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const style = searchParams.get("style") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 12;

  useEffect(() => {
    console.log("🔵 useEffect running for ProductsPage");
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = `https://shop-co-e-commerce-backend.onrender.com/api/v1/products?page=${page}&limit=${limit}${style ? `&style=${style}` : ""}`;
        console.log("📡 Fetching products from:", url);

        const response = await fetch(url);
        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📡 Data received:", data);

        if (data.success) {
          setProducts(data.data || []);
        } else {
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [style, page, limit]);

  // Debug: Log state changes
  console.log("🔵 Products state:", products);
  console.log("🔵 Loading state:", loading);
  console.log("🔵 Error state:", error);

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-black text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Products</h1>
      <p className="text-gray-600 mt-2">Found {products.length} products</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
