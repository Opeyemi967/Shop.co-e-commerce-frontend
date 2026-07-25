// ================================================================
// FORMAT CURRENCY UTILITY
// ================================================================

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted currency string
 * 
 * @example
 * formatCurrency(19.99) // "$19.99"
 * formatCurrency(19.99, 'EUR') // "€19.99"
 * formatCurrency(19.99, 'GBP', 'en-GB') // "£19.99"
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  // Handle invalid inputs
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0';
  }

  // Format the currency using Intl.NumberFormat
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number as currency with a specific currency symbol
 * @param {number} amount - The amount to format
 * @param {string} symbol - The currency symbol (default: '$')
 * @returns {string} Formatted currency string
 * 
 * @example
 * formatCurrencyWithSymbol(19.99) // "$19.99"
 * formatCurrencyWithSymbol(19.99, '€') // "€19.99"
 */
export const formatCurrencyWithSymbol = (amount, symbol = '$') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0';
  }
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Parse a currency string back to a number
 * @param {string} currencyString - The currency string to parse
 * @returns {number} The parsed number
 * 
 * @example
 * parseCurrency('$19.99') // 19.99
 * parseCurrency('€19.99') // 19.99
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString || typeof currencyString !== 'string') {
    return 0;
  }
  // Remove all non-numeric characters except decimal point
  const cleaned = currencyString.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

// Default export for convenience
export default formatCurrency;
