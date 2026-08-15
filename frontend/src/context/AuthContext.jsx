import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current authenticated user on app startup
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/me');
        setUser(response.data.user);
      } catch (err) {
        console.error('Failed to authenticate session token:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('taskflow_token', newToken);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  // Register handler
  const register = async (name, email, password, role = 'user') => {
    const response = await API.post('/auth/register', { name, email, password, role });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('taskflow_token', newToken);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  // Update profile details
  const updateProfile = async (name, email) => {
    const response = await API.put('/auth/profile', { name, email });
    const updatedUser = response.data.user;
    setUser((prev) => ({ ...prev, ...updatedUser }));
    localStorage.setItem('taskflow_user', JSON.stringify({ ...user, ...updatedUser }));
    return response.data;
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    const response = await API.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
