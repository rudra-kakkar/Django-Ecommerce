import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { FaShoppingBag, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(path)
      ? "bg-white/20 text-white shadow-sm"
      : "text-indigo-100 hover:bg-white/10 hover:text-white"
    }`;

  const mobileNavLinkClass = (path) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${isActive(path)
      ? "bg-indigo-700 text-white"
      : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
    }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-indigo-600 shadow-lg border-b border-indigo-500/50 backdrop-blur-md bg-opacity-95 supports-[backdrop-filter]:bg-opacity-80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-pink-400 rounded-lg flex items-center justify-center shadow-lg"
              >
                <FaShoppingBag className="text-white text-lg" />
              </motion.div>
              <span className="text-xl font-bold text-white tracking-tight">ShopHub</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { path: "/", label: "Home" },
              ...(user ? [
                { path: "/orders", label: "Orders" },
                { path: "/cart", label: "Cart" },
                { path: "/my-products", label: "My Products" },
                ...(user.is_admin ? [{ path: "/admin", label: "Admin Panel" }] : [])
              ] : [])
            ].map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link to={item.path} className={navLinkClass(item.path)}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full"
                >
                  <FaUser className="text-white text-sm" />
                  <span className="text-sm text-white font-medium">
                    Hi, {user.username}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ring-1 ring-white/20 hover:ring-white/40"
                >
                  <FaSignOutAlt />
                  Logout
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-indigo-100 hover:bg-white/10 hover:text-white transition-all"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-indigo-100 hover:text-white p-2 rounded-md focus:outline-none transition-colors"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaTimes className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaBars className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-800 shadow-inner">
              {[
                { path: "/", label: "Home" },
                { path: "/cart", label: "Cart" },
                ...(user ? [
                  { path: "/orders", label: "My Orders" },
                  { path: "/my-products", label: "My Products" },
                  ...(user.is_admin ? [{ path: "/admin", label: "Admin Panel" }] : [])
                ] : [])
              ].map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={item.path} className={mobileNavLinkClass(item.path)}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {user ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 pb-3 border-t border-indigo-700 mt-4"
                >
                  <div className="flex items-center px-3 mb-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex-shrink-0"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-300 to-pink-400 flex items-center justify-center text-white font-bold border-2 border-indigo-400 shadow-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    </motion.div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{user.username}</div>
                      <div className="text-sm font-medium leading-none text-indigo-300 mt-1">{user.email || 'User'}</div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-300 hover:text-white hover:bg-red-600/20 transition-colors"
                  >
                    <FaSignOutAlt />
                    Sign out
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4 border-t border-indigo-700 mt-2 grid grid-cols-2 gap-2 p-2"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="text-center block px-3 py-2 rounded-md text-base font-medium text-black bg-indigo-700 hover:bg-indigo-600">
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="text-center block px-3 py-2 rounded-md text-base font-medium text-indigo-700 bg-white hover:bg-indigo-50">
                      Sign Up
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
