import axios from 'axios';

const isProduction = process.env.VITE_ENV === 'production';
const baseURL = isProduction 
  ? 'https://digital-e-gram-panchayat-xgvs.onrender.com/api'
  : '/api';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // Increased timeout to 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 