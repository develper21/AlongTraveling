import axios from 'axios';
import { API_BASE_URL, getAuthToken, removeAuthToken } from './config';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      removeAuthToken();
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ 
      success: false,
      error: errorMessage,
      message: errorMessage, 
      status: error.response?.status,
      data: error.response?.data 
    });
  }
);

export default api;
