import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    const userData = response.data;
    
    if (userData.token) {
      localStorage.setItem('userToken', userData.token);
      // Return user data in a consistent format
      return {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: userData.token
      };
    }
    throw new Error('No token received from server');
  } catch (error) {
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const logout = () => {
  localStorage.removeItem('userToken');
};

// Contact APIs
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Something went wrong';
  }
};
