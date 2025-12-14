import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../api/axiosClient";
import AnimatedPage from "../../components/AnimatedPage";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        API.get("products/"),
        API.get("orders/"),
        API.get("products/categories/"),
      ]);

      // Handle paginated and non-paginated responses
      const products = Array.isArray(productsRes.data.results) 
        ? productsRes.data.results 
        : Array.isArray(productsRes.data) 
        ? productsRes.data 
        : [];
      
      const orders = Array.isArray(ordersRes.data.results) 
        ? ordersRes.data.results 
        : Array.isArray(ordersRes.data) 
        ? ordersRes.data 
        : [];
      
      const categories = Array.isArray(categoriesRes.data.results) 
        ? categoriesRes.data.results 
        : Array.isArray(categoriesRes.data) 
        ? categoriesRes.data 
        : [];

      const revenue = orders.reduce(
        (sum, order) => sum + (parseFloat(order.total_amount || order.total_price || 0)),
        0
      );
      
      // Handle both uppercase and lowercase status values
      const pending = orders.filter((o) => {
        const status = (o.status || "").toLowerCase();
        return status === "pending" || status === "processing";
      }).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCategories: categories.length,
        totalRevenue: revenue,
        pendingOrders: pending,
      });
    } catch (err) {
      console.error("Failed to load stats", err);
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalCategories: 0,
        totalRevenue: 0,
        pendingOrders: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"
          />
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "🛒",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: "📁",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, or delete products",
      icon: "📦",
      link: "/admin/products",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Manage Categories",
      description: "Manage product categories",
      icon: "📁",
      link: "/admin/categories",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Manage Orders",
      description: "View and update order status",
      icon: "🛒",
      link: "/admin/orders",
      color: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Welcome back! Here's an overview of your store.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-between mb-4"
                >
                  <div className={`text-4xl ${stat.bgColor} p-3 rounded-xl`}>
                    {stat.icon}
                  </div>
                </motion.div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link
                    to={action.link}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-indigo-200 block"
                  >
                <div className={`text-5xl mb-4 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}>
                  {action.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600">{action.description}</p>
                    <div className="mt-4 text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Go to {action.title} →
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-gray-500">
              <p>Recent activity will appear here</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}

