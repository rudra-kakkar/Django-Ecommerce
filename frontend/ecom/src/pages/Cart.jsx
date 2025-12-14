import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCart, updateCartItem, removeCartItem } from "../api/cart";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowRight } from "react-icons/fa";
import AnimatedPage from "../components/AnimatedPage";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.items || res.data || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
      loadCart();
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const handleRemove = async (itemId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await removeCartItem(itemId);
        loadCart();
      } catch (err) {
        alert("Failed to remove item");
      }
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
          <p className="text-gray-600 text-lg font-medium">Loading cart...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-purple-50/20 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8"
          >
            Shopping Cart
          </motion.h1>

          <AnimatePresence mode="wait">
            {cart.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  🛒
                </motion.div>
                <p className="text-2xl text-gray-600 mb-8 font-medium">Your cart is empty</p>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-2xl"
                  >
                    <FaShoppingCart />
                    Continue Shopping
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 flex flex-col sm:flex-row gap-4 border border-gray-100"
                      >
                        <motion.img
                          src={item.product?.image}
                          alt={item.product?.title}
                          className="w-full sm:w-32 h-32 object-cover rounded-xl"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-800 mb-2">{item.product?.title}</h3>
                          <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            ₹{item.product?.price}
                          </p>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-600"
                              >
                                <FaMinus />
                              </motion.button>
                              <span className="px-6 py-2 font-bold text-gray-800 bg-gray-50">{item.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-600"
                              >
                                <FaPlus />
                              </motion.button>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemove(item.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <FaTrash />
                              Remove
                            </motion.button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{(item.product?.price || 0) * item.quantity}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-1"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Items ({itemCount})</span>
                        <span className="font-semibold">₹{total}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-bold">Free</span>
                      </div>
                      <div className="border-t-2 border-gray-200 pt-4">
                        <div className="flex justify-between text-2xl font-bold">
                          <span className="text-gray-800">Total</span>
                          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{total}
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/checkout"
                        className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-center py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-2xl mb-4 flex items-center justify-center gap-2"
                      >
                        Proceed to Checkout
                        <FaArrowRight />
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/"
                        className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        Continue Shopping
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedPage>
  );
}

