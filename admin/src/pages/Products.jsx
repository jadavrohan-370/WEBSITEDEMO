import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { productService, imageService } from "../services/apiClient";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "No description",
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (
      !currentProduct.name ||
      !currentProduct.price ||
      !currentProduct.category ||
      !currentProduct.description ||
      !currentProduct.image
    ) {
      toast.error("Please fill all required fields including product image");
      console.log("Validation failed:", {
        name: currentProduct.name,
        price: currentProduct.price,
        category: currentProduct.category,
        description: currentProduct.description,
        image: currentProduct.image,
      });
      return;
    }

    // Prevent submission while uploading
    if (uploadingImage) {
      toast.error("Please wait for image upload to complete");
      return;
    }

    try {
      // Ensure numeric fields are numbers
      const productData = {
        ...currentProduct,
        price: Number(currentProduct.price),
        stock: Number(currentProduct.stock) || 0,
      };

      if (isEditing) {
        const data = await productService.update(
          currentProduct._id,
          productData,
        );
        if (data.success) {
          toast.success("Product updated successfully");
          fetchProducts();
        }
      } else {
        const data = await productService.create(productData);
        if (data.success) {
          toast.success("Product added successfully");
          fetchProducts();
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const data = await productService.delete(id);
        if (data.success) {
          toast.info("Product deleted");
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const openEdit = (product) => {
    setCurrentProduct(product);
    setImagePreview(product.image);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setImagePreview("");
    setCurrentProduct({
      name: "",
      price: "",
      category: "",
      stock: "",
      image: "",
      description: "",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64String = event.target?.result;
      console.log("Base64 string created, length:", base64String.length);
      setImagePreview(base64String);

      // Upload image to backend
      try {
        console.log("Uploading image to backend...");
        const uploadData = await imageService.upload(base64String);
        console.log("Upload response:", uploadData);

        if (uploadData.success) {
          console.log("Setting image URL:", uploadData.imageUrl);
          setCurrentProduct((prev) => {
            const updated = {
              ...prev,
              image: uploadData.imageUrl,
            };
            console.log("Updated currentProduct:", updated);
            return updated;
          });
          toast.success("Image uploaded successfully ✓");
        } else {
          console.error("Upload failed:", uploadData.message);
          toast.error(uploadData.message || "Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(error.response?.data?.message || "Failed to upload image");
      } finally {
        setUploadingImage(false);
      }
    };

    reader.onerror = () => {
      console.error("FileReader error");
      toast.error("Failed to read file");
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar title="Products Management" />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30 font-medium"
          >
            <Plus size={20} /> Add New Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: #{product._id?.substring(0, 6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No products found. Add one to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={currentProduct.name}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={currentProduct.stock}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        stock: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={currentProduct.category}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="soupes">Soupes</option>
                  <option value="Main course">Main course</option>
                  <option value="Noodles">Noodles</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Baverages">Baverages</option>
                  <option value="Pickles">Pickles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                  rows="3"
                  value={currentProduct.description}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center cursor-pointer hover:bg-indigo-50 transition-colors bg-indigo-50/30"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <p className="text-xs text-slate-600">
                        {uploadingImage
                          ? "Uploading..."
                          : "Click to change image"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={32} className="text-indigo-400" />
                      <p className="text-sm font-medium text-slate-700">
                        {uploadingImage
                          ? "Uploading image..."
                          : "Click to upload image"}
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, WEBP (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                {currentProduct.image && (
                  <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-200">
                    <p className="text-xs text-emerald-700 font-medium">
                      ✓ Image saved: {currentProduct.image}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className={`px-6 py-2 rounded-lg text-white font-medium shadow-lg ${
                    uploadingImage
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30"
                  }`}
                >
                  {uploadingImage
                    ? "Uploading Image..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
