import axios from 'axios';

const isProduction = import.meta.env.PROD;
const productionUrl = 'https://digital-e-gram-panchayat-xgvs.onrender.com';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: isProduction ? `${productionUrl}/api` : '/api',
  timeout: 30000, // Increased timeout to 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Remove any duplicate /api prefixes
    if (config.url?.startsWith('/api/')) {
      config.url = config.url.replace('/api/', '/');
    }
    
    // Log request in development
    if (!isProduction) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        fullUrl: `${config.baseURL}${config.url}`
      });
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
    // Log error details
    console.error('API Error:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullUrl: error.config ? `${error.config.baseURL}${error.config.url}` : null,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 