// src/components/product/ProductInfo.jsx
import StarRating from "../common/StarRating";

const ProductInfo = ({ product }) => {
  if (!product) return null;

  // Calculate discount percentage if not provided
  const discountPercentage =
    product.discountPercentage ||
    (product.oldPrice
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0);

  return (
    <div className="flex flex-col gap-2">
      {/* Product Name - Matches design exactly */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
        {product.name}
      </h1>

      {/* Rating - Matches design: ★★★★★ 4.5/5 */}
      <div className="flex items-center gap-3 mt-1">
        <StarRating rating={product.rating || 4.5} />
        <span className="text-sm md:text-base text-gray-600">
          {product.rating || 4.5}/5
        </span>
      </div>

      {/* Price - Matches design: $260 $300 -40% */}
      <div className="flex items-center gap-3 md:gap-4 mt-1">
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold">
          ${product.price}
        </span>
        {product.oldPrice && (
          <span className="text-xl md:text-2xl lg:text-3xl text-gray-400 line-through">
            ${product.oldPrice}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="bg-red-100 text-red-500 px-3 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-base font-medium">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Description - Matches design exactly */}
      <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-2 md:mt-3">
        {product.description ||
          "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."}
      </p>
    </div>
  );
};

export default ProductInfo;
