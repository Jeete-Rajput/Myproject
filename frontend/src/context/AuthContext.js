import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as loginUserAPI, registerUser as registerUserAPI, logoutUser, getStoredUser, getAuthToken } from '../services/authService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'user' or 'admin'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUserType(storedUser.role);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await loginUserAPI(email, password);

      if (response.success && response.user) {
        setIsAuthenticated(true);
        setUserType(response.user.role);
        setUser(response.user);
        return { success: true };
      } else {
        const msg = response.message || 'Login failed';
        setError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await registerUserAPI(userData);

      if (response.success && response.user) {
        setIsAuthenticated(true);
        setUserType(response.user.role);
        setUser(response.user);
        return { success: true };
      } else {
        const msg = response.message || 'Registration failed';
        setError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setUserType(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
