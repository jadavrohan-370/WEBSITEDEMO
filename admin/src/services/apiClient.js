// src/services/apiClient.js
import axios from "axios";

// Use environment variable if available, otherwise fallback to localhost (or remote if preferred)
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

export const BACKEND_URL = API_URL.replace("/api", "");

export const getImageUrl = (path) => {
  if (!path) return "";
  if (
    path.startsWith("http") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  return `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// Request interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to unwrap response data
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("authToken");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  register: (data) => apiClient.post("/auth/register", data),
  getProfile: () => apiClient.get("/auth/profile"),
  logout: () => apiClient.post("/auth/logout"),
};

export const productService = {
  getAll: () => apiClient.get("/products"),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post("/products", data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

export const messageService = {
  getAll: () => apiClient.get("/messages"),
  getById: (id) => apiClient.get(`/messages/${id}`),
  reply: (id, reply) => apiClient.put(`/messages/${id}/reply`, { reply }),
  markAsRead: (id) => apiClient.put(`/messages/${id}/read`),
  delete: (id) => apiClient.delete(`/messages/${id}`),
};

export const orderService = {
  getAll: () => apiClient.get("/orders"),
  updateStatus: (id, status) =>
    apiClient.patch(`/orders/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/orders/${id}`),
};

export const imageService = {
  upload: (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return apiClient.post("/images/upload", formData);
  },
  delete: (filename) =>
    apiClient.delete("/images/delete", { data: { filename } }),
};

export default apiClient;
