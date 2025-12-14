import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/products";
import API from "../../api/axiosClient";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    category: "",
    is_active: true,
  });
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to load products";
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await API.get("products/categories/");
      setCategories(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category_id", form.category);
      formData.append("is_active", form.is_active);

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingProduct) {
        await API.patch(`products/${editingProduct.id}/`, formData, config);
        alert("✅ Product updated successfully");
      } else {
        await API.post("products/", formData, config);
        alert("✅ Product created successfully");
      }

      setShowForm(false);
      setEditingProduct(null);
      setForm({ title: "", description: "", price: "", image: null, category: "", is_active: true });
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.response?.data ? JSON.stringify(err.response.data) : err.message) ||
        "Failed to save product";
      alert(`❌ Failed to save product: ${errorMsg}`);
      console.error("Product save error:", err.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image: product.image, // Keep existing image URL primarily for preview if we handled that logic
      category: product.category?.id || product.category || "",
      is_active: product.is_active !== undefined ? product.is_active : true,
    });
    // Note: We can't set the file input value programmatically for security reasons
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      await API.delete(`products/${id}/`);
      loadProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to delete product";
      alert(`❌ Failed to delete product: ${errorMsg}`);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await API.patch(`products/${product.id}/`, { is_active: !product.is_active });
      loadProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to update product status";
      alert(`❌ Failed to update product status: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Products</h1>
            <p className="text-slate-600">Inventory management system</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-medium transition-all"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProduct(null);
                setForm({ title: "", description: "", price: "", image: null, category: "", is_active: true });
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-black font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              + Add New Product
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-10 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g., Premium Leather Jacket"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-slate-400">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        required
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                    <select
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
                    <textarea
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none h-32"
                      required
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe your product..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                      />
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="text-sm text-slate-500 font-medium">Click to upload image</p>
                      {form.image && (
                        <p className="text-xs text-indigo-600 mt-2 font-semibold">
                          {form.image instanceof File ? form.image.name : "Current Image Loaded"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                        className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-semibold text-slate-700">Product is Active</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1 ml-8">Inactive products won't be visible to customers</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-lg bg-indigo-600 text-black font-bold hover:bg-indigo-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setForm({ title: "", description: "", price: "", image: null, category: "", is_active: true });
                  }}
                  className="px-8 py-3 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500 mb-8">Get started by adding your first product to the inventory.</p>
            <button
              onClick={() => {
                    setShowForm(true);
                setEditingProduct(null);
                setForm({ title: "", description: "", price: "", image: null, category: "", is_active: true });
              }}
              className="px-6 py-3 rounded-lg bg-indigo-600 text-black font-semibold hover:bg-indigo-700 shadow-md transition-all"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                    ID: {product.id}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                      {/* Category Name if available, else static or placeholder */}
                      Product
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
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

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(product)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        product.is_active
                          ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {product.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
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

