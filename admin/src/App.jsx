import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import MenuManagement from "./pages/MenuManagement";
import Messages from "./pages/Messages";
import Orders from "./pages/Orders";
import Sidebar from "./components/Sidebar";

// Layout wrapper for protected routes
const AdminLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600">
        Loading...
      </div>
    );

  return isAuthenticated ? (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-0">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose={3000}
      />
    </AuthProvider>
  );
};

export default App;
