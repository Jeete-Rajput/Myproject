import React, { useState, useCallback } from 'react';
import { debounce } from '../utils/helpers';
import './SearchBar.css';

/**
 * SearchBar Component - Handles book search functionality
 * @param {Function} onSearch - Callback function when search query changes
 */
const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce the search to avoid too many calls
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, author, or description..."
          value={searchQuery}
          onChange={handleInputChange}
          aria-label="Search books"
        />
        {searchQuery && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
