import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { fetchBooks } from './services/bookService';
import { filterBooks, sortBooks } from './utils/helpers';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
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
  const { isAuthenticated, userType } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [showSearch, setShowSearch] = useState(false);

  // Fetch books on component mount
  useEffect(() => {
    if (isAuthenticated && userType === 'user') {
      loadBooks();
    }
  }, [isAuthenticated, userType]);

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
      console.error('Error loading books:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
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

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show admin dashboard if admin user
  if (userType === 'admin') {
    return <AdminDashboard />;
  }

  // Show user dashboard
  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header onSearchToggle={() => setShowSearch(!showSearch)} />

      <main className="app-main">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Section */}
        <FeaturedSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Books Section */}
        <div className="app-container">
          {showSearch && (
            <>
              {/* Search Bar */}
              <SearchBar onSearch={handleSearch} />

              {/* Sort Controls */}
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
                    <option value="price">Price (Low to High)</option>
                    <option value="rating">Rating (High to Low)</option>
                  </select>
                </div>
                <div className="results-count">
                  {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
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
              />
            )
          )}
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 BookStore Pro. All rights reserved. | Made with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
