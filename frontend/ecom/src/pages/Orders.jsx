import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders/amy/");
      setOrders(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl text-gray-600 mb-6">You have no orders yet</p>
            <Link
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-800 mb-2">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      📅 Placed on: {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-2xl text-indigo-600 mb-2">₹{order.total_amount}</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status?.toUpperCase() || "UNKNOWN"}
                    </span>
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

                <div className="mt-6">
                  <h4 className="font-bold text-lg text-gray-800 mb-4">Order Items:</h4>
                  <div className="space-y-3">
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

