// HomePage.jsx - NO REDUX, DIRECT FETCH
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import { getImage } from "../../config/images";
import ProductCard from "../../components/product/ProductCard";
import BrandBanner from "../../components/common/BrandBanner";

// ==============================================
// TOP SELLING SKELETON
// ==============================================

const TopSellingSkeleton = () => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-xl"></div>
          <div className="h-4 bg-gray-200 mt-3 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 mt-2 rounded w-1/2"></div>
          <div className="h-5 bg-gray-200 mt-2 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};

// ==============================================
// HOME PAGE
// ==============================================

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [topLoading, setTopLoading] = useState(true);
  const [topError, setTopError] = useState(null);

  const API_URL = "https://shop-co-e-commerce-backend.onrender.com/api/v1";

  //  Fetch products directly - NO REDUX
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/products?page=1&limit=4`);
        const data = await response.json();

        if (data.success) {
          setProducts(data.data || []);
        } else {
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //  Fetch top selling directly - NO REDUX
  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        setTopLoading(true);
        setTopError(null);

        const response = await fetch(`${API_URL}/products/top-selling?limit=4`);
        const data = await response.json();

        if (data.success) {
          setTopProducts(data.data || []);
        } else {
          setTopError(data.message || "Failed to fetch top selling");
        }
      } catch (err) {
        console.error("Error fetching top selling:", err);
        setTopError(err.message || "Failed to fetch top selling");
      } finally {
        setTopLoading(false);
      }
    };

    fetchTopSelling();
  }, []);

  // ================================================================
  // LOADING STATES
  // ================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-red-500 text-xl font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">No products available</h1>
      </div>
    );
  }

  // ================================================================
  // RENDER TOP SELLING SECTION
  // ================================================================

  const renderTopSelling = () => {
    if (topError) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Top Selling
          </h3>
          <p className="text-gray-600 mb-4">{topError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (topLoading) {
      return <TopSellingSkeleton />;
    }

    if (topProducts.length > 0) {
      return (
        <div className="grid md:grid-cols-4 gap-6">
          {topProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-gray-500">
        No top selling products available
      </div>
    );
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <>
      {/* ================================= */}
      {/* HERO SECTION */}
      {/* ================================= */}

      <section className="max-w-6xl mx-auto px-5 lg:px-0 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-akira-super text-3xl md:text-5xl lg:text-5xl font-bold mb-6">
              FIND CLOTHES
              <br />
              THAT MATCHES
              <br />
              YOUR STYLE
            </h1>

            <p className="text-gray-600 mb-8">
              Browse through our diverse range of carefully crafted garments
              designed to bring out your individuality.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium duration-300 group"
            >
              Shop Now
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
            </Link>

            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <h2 className="text-2xl font-bold">200+</h2>
                <p className="text-sm text-gray-500">International Brands</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold">2,000+</h2>
                <p className="text-sm text-gray-500">High-Quality Products</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold">30,000+</h2>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
            </div>
          </div>

          <div>
            <img
              src={getImage("hero")}
              alt="Fashion Shopping"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* BRAND BANNER */}
      {/* ================================= */}

      <BrandBanner />

      {/* ================================= */}
      {/* NEW ARRIVALS */}
      {/* ================================= */}

      <section className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-3xl font-akira-super text-center mb-12">
          NEW ARRIVALS
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link
            to="/products"
            className="border border-gray-300 px-12 py-4 rounded-full font-medium hover:bg-black hover:text-white transition"
          >
            View All
          </Link>
        </div>
      </section>

      {/* ================================= */}
      {/* TOP SELLING */}
      {/* ================================= */}

      <section className="max-w-6xl mx-auto px-5 py-20 border-t">
        <h2 className="text-3xl font-akira-super text-center mb-12">
          TOP SELLING
        </h2>
        {renderTopSelling()}
        <div className="flex justify-center mt-12">
          <Link
            to="/products?sort=top"
            className="border border-gray-300 px-12 py-4 rounded-full font-medium hover:bg-black hover:text-white transition"
          >
            View All
          </Link>
        </div>
      </section>

      {/* ================================= */}
      {/* BROWSE BY DRESS STYLE */}
      {/* ================================= */}

      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="bg-[#F0F0F0] rounded-[40px] p-10">
          <h2 className="text-3xl font-akira-super text-center mb-12">
            BROWSE BY DRESS STYLE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/products?style=casual"
              className="bg-white rounded-[20px] p-8 h-62.5 relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-white z-10 relative">
                Casual
              </h3>
              <img
                src={getImage("casual")}
                alt="Casual Style"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </Link>

            <Link
              to="/products?style=formal"
              className="md:col-span-2 bg-white rounded-[20px] p-8 h-62.5 relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-white z-10 relative">
                Formal
              </h3>
              <img
                src={getImage("formal")}
                alt="Formal Style"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </Link>

            <Link
              to="/products?style=party"
              className="md:col-span-2 bg-white rounded-[20px] p-8 h-62.5 relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-white z-10 relative">
                Party
              </h3>
              <img
                src={getImage("party")}
                alt="Party Style"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </Link>

            <Link
              to="/products?style=gym"
              className="bg-white rounded-[20px] p-8 h-62.5 relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-white z-10 relative">
                Gym
              </h3>
              <img
                src={getImage("gym")}
                alt="Gym Style"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
