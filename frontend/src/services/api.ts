import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travelai_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      (error.response?.data?.errors ? error.response.data.errors[0]?.message : null) ||
      error.message ||
      'An unexpected network error occurred';

    // Auto logout if 401 and token exists
    if (error.response?.status === 401 && localStorage.getItem('travelai_token')) {
      localStorage.removeItem('travelai_token');
      localStorage.removeItem('travelai_user');
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(new Error(customMessage));
  }
);
