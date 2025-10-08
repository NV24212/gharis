import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;

    try {
      const { data: freshProfileData } = await api.get('/profile');
      const decodedToken = jwtDecode(currentToken);

      setUser((prevUser) => ({
        ...prevUser,
        ...decodedToken,
        ...freshProfileData,
      }));
    } catch (error) {
      console.error('Failed to fetch current user', error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      try {
        jwtDecode(token); // Just to validate
        fetchCurrentUser(); // Fetch full user data
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token, fetchCurrentUser, logout]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};