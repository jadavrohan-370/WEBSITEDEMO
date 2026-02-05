import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to unwrap response data
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export const productService = {
  getAll: () => apiClient.get("/products"),
};

export const messageService = {
  sendMessage: (data) => apiClient.post("/messages", data),
};

export const orderService = {
  create: (data) => apiClient.post("/orders", data),
};

export default apiClient;
