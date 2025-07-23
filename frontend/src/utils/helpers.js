// Utility functions for the ShoeBay application

/**
 * Format price to USD currency
 * @param {number} price 
 * @returns {string}
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * Format date to readable string
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

/**
 * Generate placeholder image URL
 * @param {number} width 
 * @param {number} height 
 * @param {string} text 
 * @returns {string}
 */
export const getPlaceholderImage = (width = 300, height = 300, text = 'Shoe') => {
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(text)}`;
};

/**
 * Generate random rating between min and max
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export const generateRating = (min = 3.5, max = 5.0) => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

/**
 * Debounce function
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function}
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Truncate text to specified length
 * @param {string} text 
 * @param {number} length 
 * @returns {string}
 */
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Generate URL slug from text
 * @param {string} text 
 * @returns {string}
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice 
 * @param {number} salePrice 
 * @returns {number}
 */
export const calculateDiscount = (originalPrice, salePrice) => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random ID
 * @returns {string}
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Check if item is in wishlist
 * @param {Array} wishlist 
 * @param {string|number} productId 
 * @returns {boolean}
 */
export const isInWishlist = (wishlist, productId) => {
  return wishlist.some(item => item.id === productId);
};

/**
 * Get item quantity in cart
 * @param {Array} cartItems 
 * @param {string|number} productId 
 * @param {string} size 
 * @returns {number}
 */
export const getCartItemQuantity = (cartItems, productId, size) => {
  const item = cartItems.find(item => item.id === productId && item.size === size);
  return item ? item.quantity : 0;
};

/**
 * Sort array by multiple criteria
 * @param {Array} array 
 * @param {string} sortBy 
 * @returns {Array}
 */
export const sortProducts = (array, sortBy) => {
  const sortedArray = [...array];
  
  switch (sortBy) {
    case 'name-asc':
      return sortedArray.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedArray.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-low':
      return sortedArray.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedArray.sort((a, b) => b.price - a.price);
    case 'rating':
      return sortedArray.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sortedArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    default:
      return sortedArray;
  }
};
