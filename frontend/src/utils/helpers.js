/**
 * Utility helper functions for the application
 */

/**
 * Filter books based on search query
 * @param {Array} books - Array of book objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered books
 */
export const filterBooks = (books, query) => {
  if (!query.trim()) {
    return books;
  }

  const lowerQuery = query.toLowerCase();

  return books.filter(book =>
    book.title?.toLowerCase().includes(lowerQuery) ||
    book.author?.toLowerCase().includes(lowerQuery) ||
    book.description?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort books by property
 * @param {Array} books - Array of book objects
 * @param {string} property - Property to sort by (title, author, price, year)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Array} Sorted books
 */
export const sortBooks = (books, property = 'title', order = 'asc') => {
  const sorted = [...books].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    if (typeof aValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return order === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return sorted;
};

/**
 * Format price as currency
 * @param {number} price - Price in dollars
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format date to readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Debounce function to delay execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 500) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
