import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { fetchBooks } from './services/bookService';
import { filterBooks, sortBooks } from './utils/helpers';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedSection from './components/FeaturedSection';
import CategoriesSection from './components/CategoriesSection';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import LoadingSkeleton from './components/LoadingSkeleton';
import NewsletterSection from './components/NewsletterSection';
import './App.css';

/**
 * Main App Component
 */
function App() {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, userType, user, logout, loading: authLoading } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [showSearch, setShowSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeView, setActiveView] = useState('explore'); // 'explore' or 'dashboard'
  const [isAdminRoute] = useState(() => window.location.pathname.startsWith('/admin'));

  // Fetch books only for regular (non-admin) authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated && userType === 'user') {
      loadBooks();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, userType, authLoading]);

  // Load books from backend
  const loadBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError(err.message || 'Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search — also clears active category
  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveCategory('');
    const filtered = filterBooks(books, query);
    const sorted = sortBooks(filtered, sortBy);
    setFilteredBooks(sorted);
  };

  // Handle sort
  const handleSort = (e) => {
    const sortOption = e.target.value;
    setSortBy(sortOption);
    const sorted = sortBooks(filteredBooks, sortOption);
    setFilteredBooks(sorted);
  };

  // Handle category filter — scrolls to book list and filters
  const handleCategoryFilter = (categoryName) => {
    setActiveCategory(categoryName);
    setSearchQuery('');
    setShowSearch(true);

    let filtered;
    if (categoryName) {
      // Match exact category name as stored in Book model
      const catMap = {
        'Self-Help': 'Non-Fiction', // Self-Help maps to Non-Fiction in the model
      };
      const backendCategory = catMap[categoryName] || categoryName;
      filtered = books.filter(
        (b) => b.category && b.category.toLowerCase() === backendCategory.toLowerCase()
      );
    } else {
      filtered = books;
    }

    const sorted = sortBooks(filtered, sortBy);
    setFilteredBooks(sorted);

    // Scroll to book list smoothly
    setTimeout(() => {
      const booksSection = document.getElementById('books-section');
      if (booksSection) booksSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle "Start Exploring" — open search and scroll
  const handleStartExploring = () => {
    setActiveView('explore');
    setShowSearch(true);
    setFilteredBooks(sortBooks(books, sortBy));
    setTimeout(() => {
      const booksSection = document.getElementById('books-section');
      if (booksSection) booksSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle Borrow
  const handleBorrow = async (bookId) => {
    try {
      const { userBorrowBook } = require('./services/bookService');
      await userBorrowBook(bookId);
      alert('Book borrowed successfully for 10 days!');
      loadBooks(); // refresh copies remaining
    } catch (err) {
      alert(err.message || 'Failed to borrow book');
    }
  };

  // Handle "Browse Categories" scroll
  const handleBrowseCategories = () => {
    const catSection = document.getElementById('categories-section');
    if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  // Show registration page if not authenticated and registration is toggled
  if (!isAuthenticated && showRegistration) {
    return (
      <RegistrationPage
        onSwitchToLogin={() => setShowRegistration(false)}
      />
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        onSwitchToRegistration={() => setShowRegistration(true)}
        isAdminMode={isAdminRoute}
      />
    );
  }

  // Show admin dashboard if admin user
  if (userType === 'admin') {
    return <AdminDashboard />;
  }

  // Show user dashboard
  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header onSearchToggle={() => { setShowSearch(!showSearch); if (!showSearch) setFilteredBooks(sortBooks(books, sortBy)); }} />

      {/* User info bar */}
      <div className="user-info-bar">
        <span className="user-welcome">
          👋 Welcome, <strong>{user?.name || user?.email}</strong>
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="user-logout-btn" 
            style={{ background: 'var(--primary-color)', color: 'white', border: 'none' }}
            onClick={() => setActiveView(activeView === 'explore' ? 'dashboard' : 'explore')}
          >
            {activeView === 'explore' ? '📚 My Dashboard' : '🔍 Explore Library'}
          </button>
          <button className="user-logout-btn" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <main className="app-main">
        {activeView === 'dashboard' ? (
          <UserDashboard />
        ) : (
          <>
            {/* Hero Section — passes action callbacks */}
            <HeroSection
          onStartExploring={handleStartExploring}
          onBrowseCategories={handleBrowseCategories}
        />

        {/* Featured Section — passes search trigger */}
        <FeaturedSection onReadNow={handleStartExploring} />

        {/* Categories Section — passes filter callback */}
        <CategoriesSection
          onCategoryClick={handleCategoryFilter}
          activeCategory={activeCategory}
        />

        {/* Stats Section */}
        <StatsSection />

        {/* Books Section */}
        <div className="app-container" id="books-section">
          {showSearch && (
            <>
              {/* Search Bar */}
              <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

              {/* Controls row */}
              <div className="controls-section">
                <div className="sort-control">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={handleSort}
                    className="sort-select"
                  >
                    <option value="title">Title (A-Z)</option>
                    <option value="author">Author (A-Z)</option>
                    <option value="publishedYear">Year</option>
                    <option value="availableCopies">Available Copies</option>
                  </select>
                </div>
                <div className="controls-right">
                  {activeCategory && (
                    <button
                      className="clear-filter-btn"
                      onClick={() => handleCategoryFilter('')}
                    >
                      ✕ {activeCategory}
                    </button>
                  )}
                  <div className="results-count">
                    {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Book List */}
          {showSearch && (
            isLoading ? (
              <LoadingSkeleton />
            ) : (
              <BookList
                books={filteredBooks}
                isLoading={false}
                error={error}
                onBorrowBook={handleBorrow}
              />
            )
          )}
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Newsletter Section */}
        <NewsletterSection />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 BookStore Pro. All rights reserved. | Made with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
