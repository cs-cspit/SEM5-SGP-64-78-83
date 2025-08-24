import axios from "axios";

const API_URL = "/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);
    if (response.data.token) {
      localStorage.setItem("userToken", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong";
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    const userData = response.data;

    if (userData.token) {
      localStorage.setItem("userToken", userData.token);
      // Return user data in a consistent format
      return {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: userData.token,
      };
    }
    throw new Error("No token received from server");
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong";
  }
};

export const logout = () => {
  localStorage.removeItem("userToken");
};

// Contact APIs
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post("/contact", contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong";
  }
};

// Billing APIs (admin)
export const getNextInvoiceNumber = async () => {
  const response = await api.get("/bills/next-invoice");
  return response.data;
};

export const createBill = async (billData) => {
  const response = await api.post("/bills", billData);
  return response.data;
};

export const getAllBills = async () => {
  const response = await api.get("/bills");
  return { bills: response.data.data || [] };
};

export const updateBillStatus = async (billId, status) => {
  const response = await api.patch(`/bills/${billId}/status`, { status });
  return response.data;
};

// Client APIs (admin)
export const getAllClients = async () => {
  const response = await api.get("/clients");
  return response.data;
};

export const getClientDetails = async (userId) => {
  const response = await api.get(`/clients/${userId}`);
  return response.data;
};
