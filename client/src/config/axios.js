import axios from 'axios';

const isProduction = import.meta.env.PROD;
const productionUrl = 'https://digital-e-gram-panchayat-xgvs.onrender.com';

// Log environment information
console.log('Environment Config:', {
  isProduction,
  productionUrl,
  baseURL: isProduction ? `${productionUrl}/api` : '/api'
});

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: isProduction ? `${productionUrl}/api` : '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Always log request in production and development for debugging
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`,
      headers: config.headers,
      isProduction
    });

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
    // Log error details
    const errorDetails = {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullUrl: error.config ? `${error.config.baseURL}${error.config.url}` : null,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers,
      isProduction
    };
    
    console.error('API Error:', errorDetails);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 