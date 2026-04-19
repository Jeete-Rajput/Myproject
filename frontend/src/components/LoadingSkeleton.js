import React from 'react';
import './LoadingSkeleton.css';

/**
 * LoadingSkeleton Component - Skeleton loading animation
 */
const LoadingSkeleton = () => {
  return (
    <div className="book-list">
      <div className="books-grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton skeleton-cover"></div>
            <div className="skeleton-info">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-author"></div>
              <div className="skeleton skeleton-description"></div>
              <div className="skeleton skeleton-footer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
