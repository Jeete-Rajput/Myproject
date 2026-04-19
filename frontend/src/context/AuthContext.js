import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'user' or 'admin'
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setUserType(authData.userType);
        setUser(authData.user);
      } catch (error) {
        console.error('Error restoring auth:', error);
      }
    }
  }, []);

  const login = (email, password, type) => {
    // Simulate login - replace with actual API call
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      type,
    };

    localStorage.setItem(
      'auth',
      JSON.stringify({
        userType: type,
        user: userData,
      })
    );

    setIsAuthenticated(true);
    setUserType(type);
    setUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    setUserType(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, user, login, logout }}>
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
