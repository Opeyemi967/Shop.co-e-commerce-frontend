// HomePage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import { getImage } from "../../config/images";
import ProductCard from "../../components/product/ProductCard";
import { fetchProducts } from "../../redux/slices/productSlice";
import productService from "../../services/productService";

// ✅ Import the BrandBanner component
import BrandBanner from "../../components/common/BrandBanner";

// ✅ Import the useApi hook
import useApi from "../../hooks/useApi";

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
  const dispatch = useDispatch();
  const { products, loading, error, hasFetched } = useSelector(
    (state) => state.product,
  );

  // ✅ Use the API hook for top selling
  const {
    data: topSellingData,
    loading: topSellingLoading,
    isServerError,
    isNetworkError,
    error: topSellingError,
    execute: fetchTopSelling,
  } = useApi(productService.getTopSelling);

  // ✅ Fetch products ONLY ONCE when component mounts and not already fetched
  useEffect(() => {
    if (!hasFetched && !loading) {
      dispatch(fetchProducts());
    }
  }, []); // ← FIXED: Empty dependency array to run ONCE

  // ✅ Fetch Top Selling products ONCE when component mounts
  useEffect(() => {
    fetchTopSelling(4);
  }, []); // ← FIXED: Empty dependency array

  // ================================================================
  // LOADING STATES
  // ================================================================

  if (!hasFetched && loading) {
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
          onClick={() => dispatch(fetchProducts())}
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
    // ✅ Server Error (500)
    if (isServerError) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Server Error
          </h3>
          <p className="text-gray-600 mb-4">
            {topSellingError?.message ||
              "Something went wrong on our end. Please try again later."}
          </p>
          <button
            onClick={() => fetchTopSelling(4)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    // ✅ Network Error
    if (isNetworkError) {
      return (
        <div className="text-center py-12">
          <div className="text-yellow-500 text-5xl mb-4">📶</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Connection Lost
          </h3>
          <p className="text-gray-600 mb-4">
            Please check your internet connection and try again.
          </p>
          <button
            onClick={() => fetchTopSelling(4)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    // ✅ Loading
    if (topSellingLoading) {
      return <TopSellingSkeleton />;
    }

    // ✅ Success - Show Products
    const topProducts = topSellingData?.data || [];
    if (topProducts.length > 0) {
      return (
        <div className="grid md:grid-cols-4 gap-6">
          {topProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );
    }

    // ✅ No Products
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
            <h1 className="font-akira-super text-5xl md:text-5xl lg:text-5xl font-bold mb-6">
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
      {/* BRAND BANNER - Updated with Infinite Scroll */}
      {/* ================================= */}

      <BrandBanner />

      {/* ================================= */}
      {/* NEW ARRIVALS */}
      {/* ================================= */}

      <section className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-4xl font-akira-super text-center mb-12">
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
      {/* TOP SELLING - WITH ERROR HANDLING */}
      {/* ================================= */}

      <section className="max-w-6xl mx-auto px-5 py-20 border-t">
        <h2 className="text-4xl font-akira-super text-center mb-12">
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
          <h2 className="text-4xl font-akira-super text-center mb-12">
            BROWSE BY DRESS STYLE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/products?style=casual"
              className="bg-white rounded-[20px] p-8 h-62.5 relative overflow-hidden"
            >
              <h3 className="text-3xl font-bold text-white z-10 relative">
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
              <h3 className="text-3xl font-bold text-white z-10 relative">
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
              <h3 className="text-3xl font-bold text-white z-10 relative">
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
              <h3 className="text-3xl font-bold text-white z-10 relative">
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
