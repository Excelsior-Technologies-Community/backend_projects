import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await api.post('/auth/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout').catch(() => {});
      }
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const hasRole = (roleName) => {
    if (!user || !user.role) return false;
    return typeof user.role === 'string'
      ? user.role === roleName
      : user.role.name === roleName;
  };

  const hasPermission = (permissionName) => {
    if (!user || !user.role) return false;
    if (hasRole('Admin')) return true; // Admins have full access
    const permissions = user.role.permissions || [];
    return permissions.includes(permissionName);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfile,
        hasRole,
        hasPermission,
      }}
    >
      {children}
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
