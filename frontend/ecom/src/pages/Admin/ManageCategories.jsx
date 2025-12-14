import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosClient";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("products/categories/");
      setCategories(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to load categories";
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await API.patch(`products/categories/${editingCategory.id}/`, form);
        alert("✅ Category updated successfully");
      } else {
        await API.post("products/categories/", form);
        alert("✅ Category created successfully");
      }

      setShowForm(false);
      setEditingCategory(null);
      setForm({ name: "", description: "" });
      loadCategories();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 
                      err.response?.data?.message || 
                      (err.response?.data ? JSON.stringify(err.response.data) : err.message) || 
                      "Failed to save category";
      alert(`❌ Failed to save category: ${errorMsg}`);
      console.error("Category save error:", err.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? Products in this category may be affected.")) return;

    try {
      await API.delete(`categories/${id}/`);
      alert("✅ Category deleted successfully");
      loadCategories();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to delete category";
      alert(`❌ Failed to delete category: ${errorMsg}`);
      console.error("Category delete error:", err.response?.data || err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Categories</h1>
            <p className="text-gray-600">Organize your products with categories</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/admin"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingCategory(null);
                setForm({ name: "", description: "" });
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              + Add New Category
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Electronics, Clothing, Books"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description for this category"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                    setForm({ name: "", description: "" });
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {categories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-xl text-gray-600 mb-6">No categories found</p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingCategory(null);
                setForm({ name: "", description: "" });
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Your First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">📁</div>
                      <h3 className="font-bold text-2xl text-gray-800">{category.name}</h3>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 ml-11">{category.description}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-11 mt-2">ID: {category.id}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

