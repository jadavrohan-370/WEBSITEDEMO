// API Service Configuration
// Use this in your React Admin Frontend

const API_BASE_URL = "http://localhost:5000/api";

// Create an axios instance or use fetch with these configurations
const apiClient = {
  // Auth Endpoints
  auth: {
    register: async (data) => {
      return fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    login: async (email, password) => {
      return fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    },
    getProfile: async (token) => {
      return fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    logout: async (token) => {
      return fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  },

  // Product Endpoints
  products: {
    getAll: async () => {
      return fetch(`${API_BASE_URL}/products`);
    },
    getById: async (id) => {
      return fetch(`${API_BASE_URL}/products/${id}`);
    },
    create: async (data, token) => {
      return fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    update: async (id, data, token) => {
      return fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    delete: async (id, token) => {
      return fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    getByCategory: async (category) => {
      return fetch(`${API_BASE_URL}/products/category/${category}`);
    },
  },

  // Message Endpoints
  messages: {
    create: async (data) => {
      return fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    getAll: async (token) => {
      return fetch(`${API_BASE_URL}/messages`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    getById: async (id, token) => {
      return fetch(`${API_BASE_URL}/messages/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    reply: async (id, reply, token) => {
      return fetch(`${API_BASE_URL}/messages/${id}/reply`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply }),
      });
    },
    markAsRead: async (id, token) => {
      return fetch(`${API_BASE_URL}/messages/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    delete: async (id, token) => {
      return fetch(`${API_BASE_URL}/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  },
};

export default apiClient;

// Example Usage in React Component:
/*
import apiClient from './apiClient';

// Login
const handleLogin = async (email, password) => {
  try {
    const response = await apiClient.auth.login(email, password);
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('authToken', data.token);
      // Redirect to dashboard
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Get all products
const loadProducts = async () => {
  try {
    const response = await apiClient.products.getAll();
    const data = await response.json();
    setProducts(data.products);
  } catch (error) {
    console.error('Failed to load products:', error);
  }
};

// Create product
const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.products.create(productData, token);
    const data = await response.json();
    if (data.success) {
      toast.success('Product created successfully');
      loadProducts(); // Refresh list
    }
  } catch (error) {
    console.error('Failed to create product:', error);
    toast.error('Failed to create product');
  }
};

// Get messages
const loadMessages = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.messages.getAll(token);
    const data = await response.json();
    setMessages(data.messages);
    setMessageStats(data.stats);
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
};
*/
