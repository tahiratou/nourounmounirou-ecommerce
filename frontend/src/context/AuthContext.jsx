import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      // Obtenir le CSRF token
      await authService.getCsrfToken();
    } catch (error) {
      console.log('CSRF token obtenu');
    }
    
    // On ne vérifie PAS l'authentification au démarrage
    // Cela évite l'erreur 403 sur la page d'accueil
    setLoading(false);
  };

  const checkAuth = async () => {
    try {
      const response = await authService.getUser();
      setUser(response.data);
      return true;
    } catch (error) {
      setUser(null);
      return false;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};