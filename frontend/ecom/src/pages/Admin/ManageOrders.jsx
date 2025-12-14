import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosClient";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await API.get("orders/");
      setOrders(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const response = await API.patch(`orders/update/${orderId}/`, { status: newStatus });
      alert("✅ Order status updated successfully");
      loadOrders();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || err.message || "Failed to update order status";
      alert(`❌ ${errorMsg}`);
      console.error("Order status update error:", err.response?.data || err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Orders</h1>
            <p className="text-gray-600">View and manage all customer orders</p>
          </div>
          <Link
            to="/admin"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            ← Dashboard
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="font-bold text-2xl text-gray-800">Order #{order.id}</h3>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </div>
                    <div className="space-y-1 text-gray-600">
                      <p className="text-sm">
                        <strong className="text-gray-800">Customer:</strong> {order.user?.username || "N/A"}
                      </p>
                      <p className="text-sm">
                        <strong className="text-gray-800">Placed on:</strong>{" "}
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-3xl font-bold text-indigo-600 mb-4">₹{order.total_amount || order.total_price || 0}</p>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value.toUpperCase())}
                        disabled={updatingStatus === order.id}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      {updatingStatus === order.id && (
                        <p className="text-xs text-gray-500">Updating...</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-1">
                    <strong className="text-gray-800">📍 Shipping Address:</strong> {order.shipping_address}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">💳 Payment Method:</strong>{" "}
                    {order.payment_method?.replace("_", " ").toUpperCase() || "N/A"}
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-lg text-gray-800 mb-3">Order Items:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <span className="font-semibold text-gray-800">
                            {item.product?.title || item.product_name}
                          </span>
                          <span className="text-gray-600 ml-2">x {item.quantity}</span>
                        </div>
                        <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

