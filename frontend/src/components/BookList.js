import React, { useState, useEffect } from 'react';
import './BookList.css';

/**
 * BookList Component - Displays list of books
 * @param {Array} books - Array of book objects to display
 * @param {boolean} isLoading - Loading state
 * @param {string} error - Error message if any
 * @param {Function} onBorrowBook - Callback when borrow button is clicked
 */
const BookList = ({ books = [], isLoading = false, error = null, onBorrowBook }) => {
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
        {displayBooks.map((book) => {
          // Handle both id and _id fields from backend
          const bookId = book.id || book._id;
          
          return (
            <div key={bookId} className="book-card">
              {book.coverImage && (
                <div className="book-cover">
                  <img src={book.coverImage} alt={book.title} />
                </div>
              )}
              {!book.coverImage && (
                <div className="book-cover book-cover-placeholder">
                  📚
                </div>
              )}
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                {book.category && (
                  <p className="book-category">
                    <span className="category-badge">{book.category}</span>
                  </p>
                )}
                {book.description && (
                  <p className="book-description">{book.description.substring(0, 100)}...</p>
                )}
                <div className="book-footer">
                  {book.publishedYear && (
                    <span className="book-year">{book.publishedYear}</span>
                  )}
                  {book.availableCopies !== undefined && (
                    <span className={`book-availability ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                      {book.availableCopies > 0 
                        ? `${book.availableCopies} available` 
                        : 'Out of stock'}
                    </span>
                  )}
                  {book.availableCopies > 0 && onBorrowBook && (
                    <button 
                      className="borrow-btn" 
                      onClick={() => onBorrowBook(bookId)}
                      style={{ marginTop: '10px', padding: '8px 12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                    >
                      📖 Borrow Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookList;
