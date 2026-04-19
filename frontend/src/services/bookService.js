// Book Service - Handles all API calls to the backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
    const data = await response.json();
    return data;
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
    const data = await response.json();
    return data;
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
    const response = await fetch(
      `${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
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
  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

/**
 * Update a book
 * @param {string} bookId - The book ID
 * @param {Object} bookData - Updated book data
 * @returns {Promise<Object>} Updated book object
 */
export const updateBook = async (bookId, bookData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

/**
 * Delete a book
 * @param {string} bookId - The book ID
 * @returns {Promise<Object>} Response from server
 */
export const deleteBook = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
