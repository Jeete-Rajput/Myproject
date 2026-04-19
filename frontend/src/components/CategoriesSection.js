import React from 'react';
import './CategoriesSection.css';

/**
 * CategoriesSection Component - Browse books by categories
 */
const CategoriesSection = () => {
  const categories = [
    { id: 1, name: 'Fiction', icon: '📖', color: '#2563eb' },
    { id: 2, name: 'Non-Fiction', icon: '📚', color: '#7c3aed' },
    { id: 3, name: 'Science', icon: '🔬', color: '#16a34a' },
    { id: 4, name: 'History', icon: '📜', color: '#dc2626' },
    { id: 5, name: 'Biography', icon: '👤', color: '#ea580c' },
    { id: 6, name: 'Self-Help', icon: '💡', color: '#2dd4bf' },
  ];

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <h2>Browse by Category</h2>
          <p>Explore different genres and find your favorite books</p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className="category-card"
              style={{ '--delay': `${index * 0.1}s`, '--color': category.color }}
              aria-label={category.name}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
              <div className="category-arrow">→</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
