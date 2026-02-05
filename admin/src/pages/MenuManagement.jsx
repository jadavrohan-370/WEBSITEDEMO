import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  UtensilsCrossed,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { productService } from "../services/apiClient";

const MenuManagement = () => {
  const CATEGORIES = [
    "All",
    // "Appetizers",
    "Soups",
    // "Salads",
    // "Starters",
    // "Breads",
    "Main Course",
    // "Curries",
    // "Biryanis",
    // "Rice Dishes",
    "Noodles",
    "Pasta",
    // "Seafood",
    // "Grilled",
    // "Vegetarian",
    // "Vegan",
    // "Desserts",
    // "Sweets",
    "Beverages",
    // "Juices",
    // "Shakes",
    // "Soft Drinks",
    // "Hot Beverages",
    "pickles"
  ];

  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    price: "",
    category: "Appetizers",
    description: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setMenuItems(data.products || []);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure price is a number for the backend
    const priceValue = parseFloat(
      currentItem.price.toString().replace(/[^0-9.]/g, ""),
    );

    const productData = {
      ...currentItem,
      price: priceValue,
    };

    try {
      if (isEditing) {
        await productService.update(currentItem._id, productData);
        toast.success("Menu item updated");
      } else {
        await productService.create(productData);
        toast.success("Menu item added");
      }
      fetchItems(); // Refresh list
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save menu item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this menu item?")) {
      try {
        await productService.delete(id);
        toast.info("Menu item deleted");
        fetchItems();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete menu item");
      }
    }
  };

  const openEdit = (item) => {
    setCurrentItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || item.desc || "",
      image: item.image || item.img || "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentItem({
      name: "",
      price: "",
      category: "Appetizers",
      description: "",
      image: "",
    });
  };

  const filteredItems =
    activeTab === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeTab);

  if (loading && menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-indigo-600 font-bold">Loading Menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar title="Menu Management" />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Dropdown */}
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-500/30 font-medium text-sm"
          >
            <Plus size={16} /> Add Menu Item
          </button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="h-48 overflow-hidden relative bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-white/50">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {item.name}
                  </h3>
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg text-sm">
                    ₹{item.price}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-600 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <UtensilsCrossed size={64} className="mb-4 opacity-20" />
            <p className="text-lg">No Items found in this category.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {isEditing ? "Edit Menu Item" : "Add Menu Item"}
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
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={currentItem.name}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 150"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={currentItem.price}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={currentItem.category}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        category: e.target.value,
                      })
                    }
                  >
                    {CATEGORIES.filter((cat) => cat !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  rows="3"
                  value={currentItem.description}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="https://..."
                  value={currentItem.image}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, image: e.target.value })
                  }
                />
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
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                >
                  {isEditing ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
