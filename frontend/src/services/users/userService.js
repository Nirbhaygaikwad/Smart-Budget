import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/users';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If the error is 401 Unauthorized, log the user out
      logout();
    }
    return Promise.reject(error);
  }
);

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Profile update failed';
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Password change failed';
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  updateProfile,
  changePassword,
};
