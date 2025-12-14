import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProduct } from "../api/products";
import { addToCart } from "../api/cart";
import { AuthContext } from "../context/AuthContext";
import { FaShoppingCart, FaArrowLeft, FaCheck } from "react-icons/fa";
import AnimatedPage from "../components/AnimatedPage";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Failed to load product", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      if (window.confirm("Please login first. Would you like to go to login page?")) {
        navigate("/login");
      }
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({ product_id: id, quantity: 1 });
      alert("✅ Added to cart successfully!");
    } catch {
      alert("❌ Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
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
          <p className="text-gray-600 text-lg font-medium">Loading product...</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-gray-500 text-xl font-medium">Product not found</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="md:flex">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-12 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative w-full max-w-md"
                >
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                  )}
                  <motion.img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-auto object-contain rounded-2xl shadow-xl"
                    onLoad={() => setImageLoaded(true)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="md:w-1/2 p-8 md:p-12"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                    {product.title}
                  </h1>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6 flex items-center gap-3"
                  >
                    <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{product.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through">₹{Math.round(product.price * 1.2)}</span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                      className="text-sm bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full"
                    >
                      20% OFF
                    </motion.span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-8"
                  >
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{product.description || "No description available."}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-4"
                  >
                    <motion.button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      whileHover={{ scale: addingToCart ? 1 : 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-black px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-2xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {addingToCart ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Adding to Cart...
                        </>
                      ) : (
                        <>
                          <FaShoppingCart />
                          Add to Cart
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate("/")}
                      whileHover={{ scale: 1.02, x: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FaArrowLeft />
                      Continue Shopping
                    </motion.button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 pt-8 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: "🚚", text: "Free Shipping" },
                        { icon: "↩️", text: "Easy Returns" },
                        { icon: "🔒", text: "Secure Payment" }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="text-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100"
                        >
                          <div className="text-2xl mb-1">{feature.icon}</div>
                          <p className="text-xs font-medium text-gray-600">{feature.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
