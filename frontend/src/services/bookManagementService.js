// Book Management Service - Handles book operations (add, issue, return)

import { getAuthToken } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Add a new book (Admin only)
 * @param {Object} bookData - Book data to add
 * @returns {Promise<Object>} Created book object
 */
export const addBook = async (bookData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/books/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add book');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

/**
 * Issue a book to a user (Admin only)
 * @param {string} bookId - Book ID
 * @param {string} userId - User ID
 * @param {string} dueDate - Due date for the book
 * @returns {Promise<Object>} Updated book object
 */
export const issueBook = async (bookId, userId, dueDate) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/books/issue/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, dueDate }),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to issue book');
    }
    
    return data;
  } catch (error) {
    console.error('Error issuing book:', error);
    throw error;
  }
};

/**
 * Return a book (Admin only)
 * @param {string} bookId - Book ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated book object
 */
export const returnBook = async (bookId, userId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/books/return/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to return book');
    }
    
    return data;
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};

/**
 * Delete a book (Admin only)
 * @param {string} bookId - Book ID
 * @returns {Promise<Object>} Response from server
 */
export const deleteBook = async (bookId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete book');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
