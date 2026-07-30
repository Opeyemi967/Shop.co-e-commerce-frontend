// ================================================================
// TEMPORARY PLACEHOLDER - To be removed after refactoring
// ================================================================

// Export empty functions to prevent build errors
export const fetchProducts = () => () => {};
export const fetchSingleProduct = () => () => {};
export const submitReview = () => () => {};
export const resetReviewState = () => ({ type: 'reset' });
export const clearProductError = () => ({ type: 'clear' });
export const deleteReview = () => () => {};
export const fetchProductReviews = () => () => {};

// Default export for the reducer
const productSlice = {
  reducer: (state = {}) => state,
  actions: {},
};

export default productSlice.reducer;
