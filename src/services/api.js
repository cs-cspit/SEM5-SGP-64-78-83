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

// Get user's own contact submissions
export const getUserContacts = async () => {
  try {
    const response = await api.get("/contact/my-contacts");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong";
  }
};

// Admin: Get all contact submissions
export const getAllContactSubmissions = async () => {
  try {
    const response = await api.get("/contact/all");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong";
  }
};

// Admin: Update contact status
export const updateContactStatus = async (contactId, status) => {
  try {
    const response = await api.patch(`/contact/${contactId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong";
  }
};

// Admin: Reply to contact
export const replyToContact = async (contactId, replyData) => {
  try {
    const response = await api.post(`/contact/${contactId}/reply`, replyData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send reply";
  }
};

// Admin: Get contact with replies
export const getContactWithReplies = async (contactId) => {
  try {
    const response = await api.get(`/contact/${contactId}/replies`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch contact details";
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

export const getBillById = async (billId) => {
  const response = await api.get(`/bills/${billId}`);
  return response.data;
};

export const updateBill = async (billId, billData) => {
  const response = await api.put(`/bills/${billId}`, billData);
  return response.data;
};

export const updateBillStatus = async (billId, status) => {
  const response = await api.patch(`/bills/${billId}/status`, { status });
  return response.data;
};

// Admin dashboard stats
export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get("/bills/admin/dashboard-stats");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching admin dashboard stats:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data?.error ||
      "Failed to fetch admin dashboard statistics"
    );
  }
};

// Client Bills APIs
export const getClientDashboardStats = async () => {
  try {
    const response = await api.get("/bills/my/dashboard-stats");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching dashboard stats:",
      error.response?.data || error.message
    );
    throw error.response?.data?.error || "Failed to fetch dashboard statistics";
  }
};

export const getMyBills = async () => {
  try {
    const response = await api.get("/bills/my/bills");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching client bills:",
      error.response?.data || error.message
    );
    throw error.response?.data?.error || "Failed to fetch your bills";
  }
};

export const getMyBill = async (billId) => {
  try {
    const response = await api.get(`/bills/my/${billId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching bill:",
      error.response?.data || error.message
    );
    throw error.response?.data?.error || "Failed to fetch bill details";
  }
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

// Get current user's client details
export const getMyClientDetails = async () => {
  try {
    const response = await api.get("/clients/my/details");
    console.log("Client details response:", response.data); // Debug log
    return response.data.data || response.data;
  } catch (error) {
    console.error(
      "Error fetching client details:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Failed to fetch client details";
  }
};

// Update current user's client details
export const updateMyClientDetails = async (clientData) => {
  try {
    const response = await api.put("/clients/my/details", clientData);
    return response.data.data || response.data;
  } catch (error) {
    console.error(
      "Error updating client details:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Failed to update client details";
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Failed to send password reset email"
    );
  }
};

// Reset password
export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const response = await api.post(`/users/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to reset password";
  }
};
