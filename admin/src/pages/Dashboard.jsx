import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  MessageSquare,
  Utensils,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import {
  productService,
  messageService,
  orderService,
} from "../services/apiClient";
import { useNavigate } from "react-router-dom";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"];

const data = [
  { name: "Mon", sales: 4000, orders: 24 },
  { name: "Tue", sales: 3000, orders: 18 },
  { name: "Wed", sales: 2000, orders: 12 },
  { name: "Thu", sales: 2780, orders: 16 },
  { name: "Fri", sales: 1890, orders: 11 },
  { name: "Sat", sales: 2390, orders: 14 },
  { name: "Sun", sales: 3490, orders: 20 },
];

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-emerald-500 text-sm font-bold flex items-center">
          <TrendingUp size={14} className="mr-1" /> {change}
        </span>
        <span className="text-slate-400 text-xs">vs last week</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    messages: 0,
    unreadMessages: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsData, messagesData, ordersData] = await Promise.all([
          productService.getAll(),
          messageService.getAll(),
          orderService.getAll(),
        ]);

        const orders = ordersData.orders || [];
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.price || 0),
          0,
        );

        // Get recent orders (last 4)
        const recent = orders.slice(0, 4);

        // Calculate status distribution
        const statusCount = {
          pending: orders.filter((o) => o.status === "pending").length,
          preparing: orders.filter((o) => o.status === "preparing").length,
          completed: orders.filter((o) => o.status === "completed").length,
          cancelled: orders.filter((o) => o.status === "cancelled").length,
        };

        const pieData = [
          { name: "Pending", value: statusCount.pending },
          { name: "Preparing", value: statusCount.preparing },
          { name: "Completed", value: statusCount.completed },
          { name: "Cancelled", value: statusCount.cancelled },
        ].filter((item) => item.value > 0);

        setRecentOrders(recent);
        setStatusData(pieData);
        setStats({
          products: (productsData.products || []).length,
          messages: (messagesData.messages || []).length,
          unreadMessages: (messagesData.messages || []).filter((m) => !m.isRead)
            .length,
          orders: orders.length,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.revenue.toFixed(2)}`}
            change="+0%"
            icon={DollarSign}
            color="bg-indigo-500"
          />
          <StatCard
            title="Menu Items"
            value={stats.products}
            change="Active"
            icon={Utensils}
            color="bg-orange-500"
          />
          <StatCard
            title="Total Messages"
            value={stats.messages}
            change={`${stats.unreadMessages} New`}
            icon={MessageSquare}
            color="bg-pink-500"
          />
          <StatCard
            title="Avg. Order Value"
            value={
              stats.orders > 0
                ? `₹${(stats.revenue / stats.orders).toFixed(2)}`
                : "₹0"
            }
            change="+0%"
            icon={TrendingUp}
            color="bg-emerald-500"
          />
        </div>

        {/* Charts & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              Weekly Revenue & Orders
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="sales"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="orders"
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Recent Orders
              </h3>
              <button
                onClick={() => navigate("/orders")}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    onClick={() => navigate("/orders")}
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                      #{order._id?.slice(-4)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {order.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {order.items}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">
                        ₹{order.price}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === "completed"
                            ? "bg-emerald-100 text-emerald-600"
                            : order.status === "preparing"
                              ? "bg-amber-100 text-amber-600"
                              : order.status === "cancelled"
                                ? "bg-rose-100 text-rose-600"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <ShoppingBag size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        {statusData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Order Status Distribution
              </h3>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Pending Orders</p>
                      <p className="text-xl font-bold text-slate-800">
                        {statusData.find((s) => s.name === "Pending")?.value ||
                          0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Utensils size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Preparing</p>
                      <p className="text-xl font-bold text-slate-800">
                        {statusData.find((s) => s.name === "Preparing")
                          ?.value || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Completed</p>
                      <p className="text-xl font-bold text-slate-800">
                        {statusData.find((s) => s.name === "Completed")
                          ?.value || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Cancelled</p>
                      <p className="text-xl font-bold text-slate-800">
                        {statusData.find((s) => s.name === "Cancelled")
                          ?.value || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
