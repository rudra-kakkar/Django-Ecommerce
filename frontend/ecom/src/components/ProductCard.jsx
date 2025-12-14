import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye } from "react-icons/fa";

export default function ProductCard({ data, index = 0 }) {
  const isNew = data.created_at && new Date(data.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-contain mix-blend-multiply p-4"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {isNew && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
          >
            New
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/5 flex items-center justify-center gap-2"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link
              to={`/product/${data.id}`}
              className="bg-white/90 backdrop-blur-sm text-indigo-600 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <FaEye className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-2"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            In Stock
          </span>
        </motion.div>
        <h2 className="font-bold text-lg leading-tight text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {data.title}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {data.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <span className="text-xs text-gray-400 font-medium">Price</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ₹{data.price}
            </span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={`/product/${data.id}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaEye className="w-4 h-4" />
              View
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
