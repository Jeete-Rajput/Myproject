import React from 'react';
import './HeroSection.css';

/**
 * HeroSection Component - Stunning hero banner
 * @param {Function} onStartExploring - Called when "Start Exploring" is clicked
 * @param {Function} onBrowseCategories - Called when "Browse Categories" is clicked
 */
const HeroSection = ({ onStartExploring, onBrowseCategories }) => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="floating-element element-1">📚</div>
        <div className="floating-element element-2">🎓</div>
        <div className="floating-element element-3">✨</div>
        <div className="floating-element element-4">📖</div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Discover Your Next<br />
            <span className="title-gradient">Great Read</span>
          </h1>
          <p className="hero-subtitle">
            Explore thousands of books from around the world, get personalized recommendations, and join our community of book lovers.
          </p>
        </div>

        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={onStartExploring}>
            <span>🔍 Start Exploring</span>
          </button>
          <button className="btn btn-secondary" onClick={onBrowseCategories}>
            <span>📚 Browse Categories</span>
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Books</div>
          </div>
          <div className="stat">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Readers</div>
          </div>
          <div className="stat">
            <div className="stat-number">4.9★</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
