import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../config/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      setUser(response.data);
    } catch (error) {
      console.error('[Auth] Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('[Auth] Attempting login with:', { email });
      
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      console.log('[Auth] Login response:', response.data);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('[Auth] Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid credentials',
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('[Auth] Attempting registration:', { email: userData.email });
      
      const response = await axiosInstance.post('/auth/register', userData);
      
      console.log('[Auth] Registration response:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('[Auth] Registration error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const response = await axiosInstance.put('/users/profile', data);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('[Auth] Profile update error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed',
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 