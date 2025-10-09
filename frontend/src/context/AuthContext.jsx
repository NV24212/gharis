import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data: fullUser } = await api.get('/login/me');
      setUser(fullUser);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
      setUser(null);
    }
  }, [token, fetchCurrentUser]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};