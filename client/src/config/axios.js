import axios from 'axios';

const isProduction = import.meta.env.PROD;
const productionUrl = 'https://digital-e-gram-panchayat-xgvs.onrender.com';

// Log environment information
console.log('[Axios Config] Environment:', {
  isProduction,
  productionUrl,
  baseURL: isProduction ? `${productionUrl}/api` : '/api',
  NODE_ENV: process.env.NODE_ENV,
  VITE_ENV: import.meta.env.MODE
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
    console.log('[Axios Request]:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      isProduction
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[Axios Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('[Axios Response]:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
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
      requestData: error.config?.data,
      isProduction
    };
    
    console.error('[Axios Error]:', errorDetails);
    
    if (error.response?.status === 401) {
      // Only clear token and redirect if not on login/register pages
      const currentPath = window.location.pathname;
      if (!['/login', '/register'].includes(currentPath)) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export the configured instance
export default axiosInstance; 