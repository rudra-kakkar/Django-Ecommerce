import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";

export default function ListProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (newProduct) => {
    // After successful product creation, redirect to MyProducts with refresh flag
    navigate("/my-products", { replace: true, state: { refresh: true } });
  };

  const handleCancel = () => {
    // Navigate back to MyProducts
    navigate("/my-products");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center gap-2"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to My Products
        </button>
        <h1 className="text-3xl font-bold text-gray-800">List a New Product</h1>
        <p className="text-gray-600 mt-2">
          Fill out the form below to add your product to the marketplace.
        </p>
      </div>

      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}

