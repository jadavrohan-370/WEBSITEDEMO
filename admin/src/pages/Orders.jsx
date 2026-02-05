import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Phone,
  MapPin,
  Clock,
  Trash2,
  RefreshCw,
  X,
  Eye,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { orderService } from "../services/apiClient";

const STATUS_OPTIONS = ["pending", "preparing", "completed", "cancelled"];

const statusClass = (status) => {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "preparing":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAll();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError("Failed to load orders: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error fetching orders", error);
      setError(error?.message || "Failed to load orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const data = await orderService.updateStatus(id, status);
      if (data.success) {
        toast.success("Status updated");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status } : order,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating status", error);
      toast.error("Could not update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const data = await orderService.delete(id);
      if (data.success) {
        toast.info("Order deleted");
        setOrders((prev) => prev.filter((order) => order._id !== id));
      }
    } catch (error) {
      console.error("Error deleting order", error);
      toast.error("Could not delete order");
    }
  };

  // Order Detail Modal Component
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
              <p className="text-indigo-100 text-sm mt-1">
                Order ID: #{order._id?.slice(-6)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-indigo-500 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Name
                  </p>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    {order.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Phone
                  </p>
                  <p className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-2">
                    <Phone size={18} className="text-indigo-600" />
                    {order.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-indigo-600" />
                Delivery Address
              </h3>
              <p className="text-slate-700 text-base leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                {order.address}
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Items Ordered
              </h3>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <p className="text-slate-700 text-base leading-relaxed">
                  {order.items}
                </p>
              </div>
            </div>

            {/* Order Notes (if available) */}
            {order.notes && (
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Special Instructions
                </h3>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-slate-700 text-base leading-relaxed">
                    {order.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Price Information */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex justify-between items-center">
                <p className="text-slate-600 font-semibold text-lg">
                  Total Amount
                </p>
                <p className="text-3xl font-bold text-indigo-600">
                  ₹{order.price?.toFixed?.(2) ?? order.price}
                </p>
              </div>
            </div>

            {/* Status and Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  Current Status
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${statusClass(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => {
                      handleStatusChange(order._id, e.target.value);
                      setSelectedOrder({
                        ...order,
                        status: e.target.value,
                      });
                    }}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  Order Date & Time
                </p>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Clock size={18} className="text-indigo-600" />
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleDelete(order._id);
                onClose();
              }}
              className="px-6 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Order
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar title="Orders" />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-indigo-600" size={24} />
            <div>
              <p className="text-sm text-slate-500">Live orders overview</p>
              <h1 className="text-2xl font-bold text-slate-800">All Orders</h1>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">Error:</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-2">
              Make sure backend is running and VITE_API_URL is set correctly.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {order.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          #{order._id?.slice(-6)}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate"
                        title={order.items}
                      >
                        {order.items}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        ₹{order.price?.toFixed?.(2) ?? order.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" />
                          <span>{order.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-slate-400 mt-0.5" />
                          <span className="line-clamp-2">{order.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(order.status)}`}
                          >
                            {order.status}
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Clock size={12} />
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
};

export default Orders;
