import axios from 'axios';

// Create axios instance with custom config
const instance = axios.create({
  baseURL: 'http://localhost:5000', // Update this with your backend server port
  timeout: 30000, // Increased timeout to 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
instance.interceptors.request.use(
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

export default instance; 