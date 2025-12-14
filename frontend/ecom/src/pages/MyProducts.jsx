import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axiosClient";
import ProductForm from "../components/ProductForm";

export default function MyProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Refresh products when returning from ListProduct page
  useEffect(() => {
    if (location.pathname === "/my-products" && location.state?.refresh) {
      fetchProducts();
    }
  }, [location.pathname, location.state]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!user) {
        console.error("User not found in localStorage");
        setProducts([]);
        return;
      }

      // Check if user has ID (new logins will have it, old logins won't)
      if (!user.id) {
        console.warn("User ID not found. Please log out and log back in to refresh your session.");
        setProducts([]);
        return;
      }

      const response = await API.get(`products/?created_by=${user.id}`);
      // Handle both paginated and non-paginated responses
      const productsData = response.data.results || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      if (error.response?.status === 401) {
        // Token expired or invalid, will be handled by interceptor
        console.error("Authentication error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get("products/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = (productId) => {
    setDeleteConfirm(productId);
  };

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`products/${deleteConfirm}/`);
      setProducts(products.filter((p) => p.id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category.id === parseInt(filterCategory);
    return matchesSearch && matchesCategory;
  });

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Products</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/my-products/list")}
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              List New Product
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading your products...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {products.length === 0
              ? "You haven't listed any products yet."
              : "No products match your search."}
          </p>
          {products.length === 0 && (
            <button
              onClick={() => navigate("/my-products/list")}
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              List Your First Product
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Product Image */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description || "No description"}
                </p>

                {/* Category and Price */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.category.name}
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    ${product.price}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      product.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Created Info */}
                <p className="text-xs text-gray-500 mb-4">
                  Created: {new Date(product.created_at).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-black font-semibold py-2 px-4 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-black font-semibold py-2 px-4 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm">
            <h2 className="text-xl font-bold mb-4">Delete Product</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-black font-bold py-2 px-4 rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
