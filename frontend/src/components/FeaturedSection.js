import React from 'react';
import './FeaturedSection.css';

/**
 * FeaturedSection Component - Displays featured/trending books
 */
const FeaturedSection = () => {
  const featuredBooks = [
    {
      id: 1,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      badge: 'Trending Now',
      icon: '🔥',
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      badge: 'Best Seller',
      icon: '⭐',
    },
    {
      id: 3,
      title: 'Dune',
      author: 'Frank Herbert',
      badge: 'Classic',
      icon: '👑',
    },
  ];

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-header">
          <h2>Featured Picks</h2>
          <p>Handpicked for you</p>
        </div>

        <div className="featured-books">
          {featuredBooks.map((book, index) => (
            <div key={book.id} className="featured-card" style={{ '--index': index }}>
              <div className="featured-badge">
                <span className="badge-icon">{book.icon}</span>
                <span className="badge-text">{book.badge}</span>
              </div>
              <div className="featured-content">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>
              <button className="featured-btn">Read Now</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
