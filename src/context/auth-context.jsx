import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('userToken');
    
    console.log('Checking saved user data:');
    console.log('Saved user:', savedUser);
    console.log('Saved token:', savedToken ? 'Present' : 'Not found');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Parsed user data:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('Setting user data in context:', userData); // Debug log
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User data after setting:', localStorage.getItem('user')); // Debug log
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isClient = () => {
    return user?.role === 'client';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isClient }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
