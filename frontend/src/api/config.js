// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Token management
export const getAuthToken = () => localStorage.getItem('token');

export const setAuthToken = (token) => localStorage.setItem('token', token);

export const removeAuthToken = () => localStorage.removeItem('token');

// Auth headers helper
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
