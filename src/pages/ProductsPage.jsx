// src/pages/ProductsPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ProductsPage = () => {
  console.log("🔴🔴🔴 NEW ProductsPage is rendering");
  
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const style = searchParams.get("style") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 12;

  useEffect(() => {
    console.log("🔴🔴🔴 useEffect running");
    
    const fetchProducts = async () => {
      try {
        console.log("🔴🔴🔴 Fetching...");
        setLoading(true);
        
        const url = `https://shop-co-e-commerce-backend.onrender.com/api/v1/products?page=${page}&limit=${limit}`;
        console.log("🔴🔴🔴 URL:", url);
        
        const response = await fetch(url);
        console.log("🔴🔴🔴 Status:", response.status);
        
        const data = await response.json();
        console.log("🔴🔴🔴 Data:", data);
        
        if (data.success) {
          setProducts(data.data || []);
        } else {
          setError(data.message || "Failed");
        }
      } catch (err) {
        console.error("🔴🔴🔴 Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("🔴🔴🔴 Done");
      }
    };
    
    fetchProducts();
  }, [style, page, limit]);

  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Products ({products.length})</h1>
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