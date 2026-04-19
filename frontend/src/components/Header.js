import React from 'react';
import ThemeToggle from './ThemeToggle';
import './Header.css';

/**
 * Header Component - Main navigation header
 */
const Header = ({ onSearchToggle }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <h1 className="app-title">📚 BookStore Pro</h1>
        </div>
        <nav className="header-nav">
          <button
            className="search-toggle-btn"
            onClick={onSearchToggle}
            title="Toggle search"
          >
            🔍
          </button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
