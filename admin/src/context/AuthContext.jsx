import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/apiClient";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      // Determine success based on API response structure
      // Some APIs might just return the token, others { success: true, token: ... }
      if (data.token || data.success) {
        localStorage.setItem("authToken", data.token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Handle specific HTTP status codes
      if (error.response?.status === 503) {
        return {
          success: false,
          message:
            "Server database is not ready. Please wait a moment and try again.",
        };
      }

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please check your network.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
