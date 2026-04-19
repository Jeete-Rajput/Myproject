import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

/**
 * LoginPage Component - Authentication page with user and admin login
 */
const LoginPage = ({ onSwitchToRegistration, isAdminMode = false }) => {
  const { login } = useAuth();
  const loginType = isAdminMode ? 'admin' : 'user';
  
  // Pre-fill demo admin credentials if on admin route
  const [email, setEmail] = useState(isAdminMode ? 'admin@bookstore.com' : '');
  const [password, setPassword] = useState(isAdminMode ? 'admin123' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Call backend API
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-background">
        <div className="floating-books">
          <div className="book book-1">📚</div>
          <div className="book book-2">📖</div>
          <div className="book book-3">📕</div>
          <div className="book book-4">📗</div>
          <div className="book book-5">📘</div>
        </div>
      </div>

      {/* Login Container */}
      <div className="login-container">
        {/* Left Section - Branding */}
        <div className="login-left">
          <div className="brand-section">
            <div className="brand-icon">📚</div>
            <h1 className="brand-title">BookStore Pro</h1>
            <p className="brand-subtitle">Discover Your Next Great Read</p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <span className="feature-text">Browse & Search</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span className="feature-text">Ratings & Reviews</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎁</span>
                <span className="feature-text">Exclusive Offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-right">
          {/* User/Admin Selector */}
          {/* Removed login-type-selector entirely */}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-header">
              <h2 className="form-title">
                {loginType === 'admin' ? 'Admin Dashboard' : 'Welcome Back'}
              </h2>
              <p className="form-subtitle">
                {loginType === 'admin'
                  ? 'Manage books and users'
                  : 'Browse and discover books'}
              </p>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder={loginType === 'admin' ? 'admin@bookstore.com' : 'you@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <span className="btn-icon">→</span>
                  Sign In
                </>
              )}
            </button>

            {/* Demo Login Information (only shown for user mode, admin is pre-filled) */}
            {!isAdminMode && (
              <div className="demo-section">
                <p className="demo-text">📝 First time here?</p>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={onSwitchToRegistration}
                  disabled={loading}
                >
                  📚 Create New Account
                </button>
              </div>
            )}

            {/* Footer Links */}
            <div className="form-footer">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#!" className="forgot-password">
                Forgot password?
              </a>
            </div>
          </form>

          {/* Sign Up Link */}
          {!isAdminMode && (
            <div className="signup-section">
              <p>Don't have an account? <button className="signup-link" onClick={onSwitchToRegistration}>Sign up here</button></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
