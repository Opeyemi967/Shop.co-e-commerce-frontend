// ==============================================
// IMPORTS
// ==============================================

import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// Hooks
import { useReviews } from "../hooks/useReviews";

// Components
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductActions from "../components/product/ProductActions";
import ProductTabs from "../components/product/ProductTabs";
import ReviewSorter from "../components/product/ReviewSorter";
import ReviewForm from "../components/product/ReviewForm";
import ReviewList from "../components/product/ReviewList";
import FAQSection from "../components/product/FAQSection";
import LoadingSpinner from "../components/common/LoadingSpinner";

// ==============================================
// PRODUCT DETAILS PAGE
// ==============================================

function ProductDetailsPage() {
  // ================================================================
  // HOOKS
  // ================================================================
  const { id } = useParams();
  const location = useLocation();

  // ================================================================
  // LOCAL STATE - NO REDUX
  // ================================================================
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_URL = "https://shop-co-e-commerce-backend.onrender.com/api/v1";

  // ================================================================
  // CUSTOM HOOKS
  // ================================================================
  const {
    rating,
    setRating,
    comment,
    setComment,
    sortBy,
    setSortBy,
    isSortOpen,
    setIsSortOpen,
    getSortedReviews,
    handleSubmitReview,
    handleUpdateReview,
    handleDeleteReview,
    handleEditReview,
    handleCancelEdit,
    reviewList,
    reviewLoading: hookReviewLoading,
    isReviewOwner,
    editingReview,
    refreshReviews,
    fetchReviews,
  } = useReviews(id);

  // ================================================================
  // FETCH PRODUCT - DIRECT API CALL (NO REDUX)
  // ================================================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();

        if (data.success) {
          setProductDetails(data.data);
        } else {
          setError(data.message || "Failed to fetch product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, refreshTrigger]);

  // ================================================================
  // HANDLE REVIEW CHANGES - Refresh data
  // ================================================================
  const handleReviewChanged = async () => {
    await fetchReviews();
    // Refresh product details to update rating
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    if (data.success) {
      setProductDetails(data.data);
    }
  };

  // ================================================================
  // DERIVED STATE
  // ================================================================
  const reviews =
    reviewList?.length > 0 ? reviewList : productDetails?.reviews || [];
  const sortedReviews = getSortedReviews(reviews, sortBy);

  // ================================================================
  // GET PRODUCT IMAGES
  // ================================================================
  const getProductImages = () => {
    if (!productDetails) return [];

    if (
      productDetails.images &&
      Array.isArray(productDetails.images) &&
      productDetails.images.length > 0
    ) {
      return productDetails.images;
    }

    if (productDetails.images && typeof productDetails.images === "object") {
      const values = Object.values(productDetails.images);
      if (values.length > 0 && values[0] !== null && values[0] !== undefined) {
        return values;
      }
    }

    if (productDetails.image && typeof productDetails.image === "string") {
      return [productDetails.image];
    }

    if (productDetails.image && typeof productDetails.image === "object") {
      const values = Object.values(productDetails.image);
      if (values.length > 0) {
        return values;
      }
    }

    return [];
  };

  const productImages = getProductImages();
  const productColors = productDetails?.colors || [];
  const productSizes = productDetails?.sizes || ["S", "M", "L", "XL"];

  // ================================================================
  // HANDLERS
  // ================================================================
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    toast.success(`Added ${selectedColor} (${selectedSize}) to cart!`);
  };

  const handleReviewSubmitWrapper = async (e) => {
    e.preventDefault();

    try {
      if (editingReview) {
        await handleUpdateReview(editingReview._id, { rating, comment });
      } else {
        await handleSubmitReview(e);
      }
      await handleReviewChanged();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleReviewDeleteWrapper = async (reviewId) => {
    try {
      await handleDeleteReview(reviewId);
      await handleReviewChanged();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const handleReviewEditWrapper = (review) => {
    handleEditReview(review);
  };

  const handleReviewUpdateWrapper = async () => {
    await handleReviewChanged();
  };

  // ================================================================
  // LOADING & ERROR
  // ================================================================
  if (loading) {
    return <LoadingSpinner size="lg" text="Loading product..." />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h2>
          <Link
            to="/products"
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6 md:mb-8">
        <Link
          to="/"
          className="text-gray-500 hover:text-black transition-colors"
        >
          Home
        </Link>
        <span className="text-gray-300">›</span>
        <Link
          to="/products"
          className="text-gray-500 hover:text-black transition-colors"
        >
          Products
        </Link>
        <span className="text-gray-300">›</span>
        <span className="text-black font-medium">
          {productDetails?.name || "Product"}
        </span>
      </div>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        {/* Left: Gallery */}
        <div className="lg:sticky lg:top-24 self-start">
          <ProductGallery
            images={productImages}
            productName={productDetails.name}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colors={productColors}
            showColorPicker={productColors.length > 0}
          />
        </div>

        {/* Right: Product Info + Actions */}
        <div className="flex flex-col gap-6 md:gap-8">
          <ProductInfo product={productDetails} />
          <ProductActions
            product={productDetails}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12 md:mt-16">
        <ProductTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={["details", "reviews", "faqs"]}
        />

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="mt-6 md:mt-8">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p className="text-gray-600 leading-relaxed">
              {productDetails.description}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-6 md:mt-8">
            <ReviewSorter
              sortBy={sortBy}
              setSortBy={setSortBy}
              isSortOpen={isSortOpen}
              setIsSortOpen={setIsSortOpen}
              totalReviews={reviews.length}
            />

            <ReviewForm
              productId={id}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              onSubmit={handleReviewSubmitWrapper}
              isLoading={hookReviewLoading}
              isEditing={!!editingReview}
              editingReview={editingReview}
              onCancelEdit={handleCancelEdit}
              onUpdate={handleReviewUpdateWrapper}
              onReviewUpdated={handleReviewChanged}
            />

            <ReviewList
              reviews={sortedReviews}
              isLoading={hookReviewLoading}
              isReviewOwner={isReviewOwner}
              onEdit={handleReviewEditWrapper}
              onDelete={handleReviewDeleteWrapper}
              onReviewDeleted={handleReviewChanged}
              onReviewUpdated={handleReviewChanged}
            />
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="mt-6 md:mt-8">
            <FAQSection />
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetailsPage;
