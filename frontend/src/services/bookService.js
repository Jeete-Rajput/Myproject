// Book Service - Handles all API calls to the backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all books from the backend
 * @returns {Promise<Array>} Array of book objects
 */
export const fetchBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    // Backend returns { success, data, count } - extract the data array
    if (result.success && Array.isArray(result.data)) {
      // Add id field from _id for compatibility with frontend
      return result.data.map(book => ({
        ...book,
        id: book._id || book.id
      }));
    }
    return result.data || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

/**
 * Fetch a single book by ID
 * @param {string} bookId - The book ID
 * @returns {Promise<Object>} Book object
 */
export const fetchBookById = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    // Backend returns { success, data } - extract the data object
    if (result.success && result.data) {
      return {
        ...result.data,
        id: result.data._id || result.data.id
      };
    }
    return result.data || result;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

/**
 * Search books by query
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Array of matching book objects
 */
export const searchBooks = async (query) => {
  try {
    // Backend uses query parameter for search
    const response = await fetch(
      `${API_BASE_URL}/books?search=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    // Backend returns { success, data, count } - extract the data array
    if (result.success && Array.isArray(result.data)) {
      return result.data.map(book => ({
        ...book,
        id: book._id || book.id
      }));
    }
    return result.data || [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

/**
 * Create a new book
 * @param {Object} bookData - Book data object
 * @returns {Promise<Object>} Created book object
 */
export const createBook = async (bookData) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(`${API_BASE_URL}/books/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

/**
 * Delete a book (Admin only)
 * @param {string} bookId - The book ID
 * @returns {Promise<Object>} Response from server
 */
export const deleteBook = async (bookId) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

/**
 * Borrow a book (User)
 * @param {string} bookId - The book ID
 * @returns {Promise<Object>} Response from server
 */
export const userBorrowBook = async (bookId) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(`${API_BASE_URL}/books/borrow/${bookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error borrowing book');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Return a book (User)
 * @param {string} bookId - The book ID
 * @returns {Promise<Object>} Response from server
 */
export const userReturnBook = async (bookId) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await fetch(`${API_BASE_URL}/books/return-book/${bookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error returning book');
    }
    return data;
  } catch (error) {
    throw error;
  }
};
