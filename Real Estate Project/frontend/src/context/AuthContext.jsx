import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('real_estate_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('real_estate_token') || null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'profile'
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Persist user and token
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('real_estate_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('real_estate_user');
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('real_estate_token', token);
      } else {
        localStorage.removeItem('real_estate_token');
      }
    } catch (e) {
      console.error('Failed to save token to localStorage', e);
    }
  }, [token]);

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
  };

  const switchAuthMode = (mode) => {
    setAuthError('');
    setAuthModalMode(mode);
  };

  // Helper for offline fallback user store
  const getOfflineUsers = () => {
    try {
      const data = localStorage.getItem('real_estate_registered_users');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveOfflineUser = (userData) => {
    try {
      const users = getOfflineUsers();
      users.push(userData);
      localStorage.setItem('real_estate_registered_users', JSON.stringify(users));
    } catch (e) {
      console.error('Error saving offline user', e);
    }
  };

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setAuthError('');

    const trimmedEmail = email.trim().toLowerCase();

    try {
      // Attempt backend login with 3s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      closeAuthModal();
      return { success: true, user: data.user };
    } catch (err) {
      // If backend error is a validation error returned by the server, bubble it
      if (err.message && !err.message.includes('fetch') && !err.message.includes('abort') && !err.message.includes('Failed')) {
        setLoading(false);
        setAuthError(err.message);
        return { success: false, error: err.message };
      }

      // Offline / network fallback: Check local storage demo users
      const offlineUsers = getOfflineUsers();
      const localMatch = offlineUsers.find((u) => u.email === trimmedEmail);

      if (localMatch) {
        if (localMatch.password === password) {
          const loggedUser = {
            id: localMatch.id,
            firstName: localMatch.firstName,
            lastName: localMatch.lastName,
            email: localMatch.email,
            role: localMatch.role || 'customer'
          };
          setUser(loggedUser);
          setToken('local_token_' + Date.now());
          setLoading(false);
          closeAuthModal();
          return { success: true, user: loggedUser };
        } else {
          setLoading(false);
          setAuthError('Invalid password. Please check your credentials.');
          return { success: false, error: 'Invalid password' };
        }
      }

      // If user hasn't registered locally or backend is down, allow seamless login demo
      if (password && password.length >= 4) {
        const fallbackName = trimmedEmail.split('@')[0] || 'User';
        const dummyUser = {
          id: 'usr_' + Date.now(),
          firstName: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
          lastName: '',
          email: trimmedEmail,
          role: 'customer'
        };
        setUser(dummyUser);
        setToken('local_token_' + Date.now());
        setLoading(false);
        closeAuthModal();
        return { success: true, user: dummyUser };
      } else {
        setLoading(false);
        setAuthError('Please enter a valid password (minimum 4 characters)');
        return { success: false, error: 'Password too short' };
      }
    }
  };

  // Register handler
  const register = async ({ firstName, lastName, email, password }) => {
    setLoading(true);
    setAuthError('');

    const trimmedEmail = email.trim().toLowerCase();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName ? lastName.trim() : '',
          email: trimmedEmail,
          password
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      closeAuthModal();
      return { success: true, user: data.user };
    } catch (err) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('abort') && !err.message.includes('Failed')) {
        setLoading(false);
        setAuthError(err.message);
        return { success: false, error: err.message };
      }

      // Offline fallback
      const offlineUsers = getOfflineUsers();
      if (offlineUsers.some((u) => u.email === trimmedEmail)) {
        setLoading(false);
        setAuthError('An account with this email already exists.');
        return { success: false, error: 'Email exists' };
      }

      const newLocalUser = {
        id: 'usr_' + Date.now(),
        firstName: firstName.trim(),
        lastName: lastName ? lastName.trim() : '',
        email: trimmedEmail,
        password,
        role: 'customer'
      };

      saveOfflineUser(newLocalUser);

      const loggedUser = {
        id: newLocalUser.id,
        firstName: newLocalUser.firstName,
        lastName: newLocalUser.lastName,
        email: newLocalUser.email,
        role: newLocalUser.role
      };

      setUser(loggedUser);
      setToken('local_token_' + Date.now());
      setLoading(false);
      closeAuthModal();
      return { success: true, user: loggedUser };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        authModalMode,
        loading,
        authError,
        setAuthError,
        openAuthModal,
        closeAuthModal,
        switchAuthMode,
        login,
        register,
        logout,
        updateProfile
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
