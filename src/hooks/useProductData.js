// ================================================================
// CUSTOM HOOK: PRODUCT DATA
// ================================================================

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleProduct,
  clearProductError,
} from "@redux/slices/productSlice";

export const useProductData = (productId) => {
  const dispatch = useDispatch();

  const { productDetails, loading, error, reviewLoading, reviewSuccess } =
    useSelector((state) => state.product);

  useEffect(() => {
    if (productId) {
      dispatch(fetchSingleProduct(productId));
      dispatch(clearProductError());
    }
  }, [dispatch, productId]);

  return {
    productDetails,
    loading,
    error,
    reviewLoading,
    reviewSuccess,
  };
};
