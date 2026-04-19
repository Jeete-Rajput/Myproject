import React, { useState, useEffect } from 'react';
import './BookList.css';

/**
 * BookList Component - Displays list of books
 * @param {Array} books - Array of book objects to display
 * @param {boolean} isLoading - Loading state
 * @param {string} error - Error message if any
 */
const BookList = ({ books = [], isLoading = false, error = null }) => {
  const [displayBooks, setDisplayBooks] = useState(books);

  useEffect(() => {
    setDisplayBooks(books);
  }, [books]);

  if (isLoading) {
    return (
      <div className="book-list">
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-list">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (displayBooks.length === 0) {
    return (
      <div className="book-list">
        <div className="empty-state">No books found. Try adjusting your search.</div>
      </div>
    );
  }

  return (
    <div className="book-list">
      <div className="books-grid">
        {displayBooks.map((book) => (
          <div key={book.id} className="book-card">
            {book.coverImage && (
              <div className="book-cover">
                <img src={book.coverImage} alt={book.title} />
              </div>
            )}
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              {book.description && (
                <p className="book-description">{book.description}</p>
              )}
              <div className="book-footer">
                {book.price && (
                  <span className="book-price">${book.price.toFixed(2)}</span>
                )}
                {book.rating && (
                  <span className="book-rating">⭐ {book.rating}/5</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
