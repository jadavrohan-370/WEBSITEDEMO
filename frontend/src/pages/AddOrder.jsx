import React, { useState } from "react";
import { ArrowLeft, Send, MapPin, Tag, BaggageClaim } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { orderService } from "../services/apiClient";

const AddOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    items: item ? item.name : "",
    price: item ? item.price : "",
    address: "",
    notes: "",
    deliveryTime: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Please enter a valid 10-digit phone number";

    if (!formData.items.trim()) newErrors.items = "Order details are required";
    if (!formData.address.trim())
      newErrors.address = "Delivery address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const priceValue =
        parseFloat(String(formData.price).replace(/[^0-9.]/g, "")) || 0;
      const payload = { ...formData, price: priceValue };
      await orderService.create(payload);
      alert("Order placed successfully!");
      navigate("/menu");
    } catch (error) {
      console.error("Error placing order:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors mb-6 mx-auto"
          >
            <ArrowLeft size={18} /> Back to Menu
          </button>
          <h2 className="text-4xl md:text-5xl font-display text-stone-900 mb-4">
            Place Your <span className="text-orange-600">Order</span>
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto">
            Fill in the details below to satisfy your cravings. We'll get it to
            you hot and fresh!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Item Details (Sidebar) */}
          {item && (
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-stone-100 lg:col-span-1 lg:sticky lg:top-32">
              <h3 className="text-xl font-bold text-stone-800 mb-4 uppercase tracking-wide border-b border-stone-100 pb-2">
                Selected Item
              </h3>

              <div className="rounded-2xl overflow-hidden mb-6 relative group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {item.category}
                    {item.price}
                  </span>
                </div>
              </div>

              <h4 className="text-3xl font-display text-stone-900 mb-2">
                {item.title}
              </h4>

              <div className="flex items-start gap-2 text-stone-500 text-sm mb-4">
                <Tag size={16} className="text-orange-500 mt-1 shrink-0" />
                <p>{item.description}</p>
              </div>

              {/* Fallback Location/Price if existed */}
              {item.location && (
                <div className="flex items-center gap-2 text-stone-400 text-xs font-medium uppercase tracking-wide mt-2">
                  <MapPin size={14} className="text-orange-500" />{" "}
                  {item.location}
                </div>
              )}

              <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-orange-800 text-xs font-bold uppercase tracking-wider mb-1">
                  Note
                </p>
                <p className="text-orange-700 text-sm">
                  Please review your selected item details before placing the
                  order.
                </p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div
            className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-stone-100 relative overflow-hidden ${item ? "lg:col-span-2" : "lg:col-span-3 max-w-3xl mx-auto"}`}
          >
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-16 -mt-16 opacity-50" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-tr-full -ml-12 -mb-12 opacity-50" />

            <form onSubmit={handleSubmit} className="relative space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 focus:outline-none ${errors.name ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 font-medium pl-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 focus:outline-none ${errors.phone ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                    placeholder="Your Phone Number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 font-medium pl-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  What would you like to order?
                </label>
                <textarea
                  name="items"
                  value={formData.items}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 resize-none focus:outline-none ${errors.items ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                  placeholder="Your Order"
                />
                {errors.items && (
                  <p className="text-red-500 text-xs mt-1 font-medium pl-1">
                    {errors.items}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  Delivery Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 focus:outline-none ${errors.address ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                  placeholder="123 Foodie Street, Flavor Town"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 font-medium pl-1">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-orange-500 focus:outline-none transition-colors text-stone-800 placeholder-stone-400 resize-none"
                  placeholder="e.g., Extra sauce, no onions"
                />
              </div>
              {/* 
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Delivery Time</label>
                                    <input
                                        type="datetime-local"
                                        name="deliveryTime"
                                        required
                                        value={formData.deliveryTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-orange-500 focus:outline-none transition-colors text-stone-800 placeholder-stone-400"
                                        placeholder="Delivery Time"
                                    />
                                </div>
                            </div> */}

              {/* Submit Button */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-orange-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-orange-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:bg-orange-400 disabled:transform-none"
                >
                  {loading ? "Placing..." : "Place Order"} <Send size={20} />
                </button>
                <button
                  type="button"
                  className="w-1/2 bg-orange-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-orange-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                  onClick={() => navigate("/bulkorder")}
                >
                  Bulk Order <BaggageClaim size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
