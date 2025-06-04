import axios from 'axios';

const isProduction = process.env.VITE_ENV === 'production';
const baseURL = isProduction 
  ? 'https://digital-e-gram-panchayat-xgvs.onrender.com'  // Removed /api since we'll add it in routes
  : '';  // Empty string for development to use the proxy

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // Increased timeout to 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add /api prefix to all requests except for full URLs
    if (!config.url.startsWith('http')) {
      config.url = `/api${config.url.startsWith('/') ? config.url : `/${config.url}`}`;
    }
    
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
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 