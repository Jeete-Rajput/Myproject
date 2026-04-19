import React from 'react';
import './StatsSection.css';

/**
 * StatsSection Component - Display platform statistics
 */
const StatsSection = () => {
  const stats = [
    { number: '50K+', label: 'Books Available', icon: '📚', delay: 0 },
    { number: '10K+', label: 'Happy Readers', icon: '😊', delay: 0.1 },
    { number: '4.9★', label: 'Average Rating', icon: '⭐', delay: 0.2 },
    { number: '24/7', label: 'Customer Support', icon: '💬', delay: 0.3 },
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-header">
          <h2>By The Numbers</h2>
          <p>Why readers love BookStore Pro</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item"
              style={{ '--delay': `${stat.delay}s` }}
            >
              <div className="stat-icon-box">
                <div className="stat-icon">{stat.icon}</div>
              </div>
              <div className="stat-value">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
