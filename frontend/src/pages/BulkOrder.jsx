import React, { useState } from "react";
import {
  ArrowLeft,
  Send,
  MapPin,
  User,
  Mail,
  Phone,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BulkOrder = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "quantity") {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Please enter a valid 10-digit phone number";

    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required";
    if (!formData.address.trim())
      newErrors.address = "Delivery address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const businessPhoneNumber = "918320385966";

    const message =
      `*New Bulk Order Inquiry*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n` +
      `*Quantity:* ${formData.quantity}\n` +
      `*Address:* ${formData.address}\n` +
      `*Notes:* ${formData.notes || "N/A"}`;

    const whatsappUrl = `https://wa.me/${businessPhoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");

    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-stone-50 py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors mb-6 mx-auto"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-4xl md:text-5xl font-display text-stone-900 mb-4">
            Bulk <span className="text-orange-600">Order</span> Inquiry
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto">
            Planning a big event or gathering? Let us handle the food! Fill out
            the form below for bulk orders.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-16 -mt-16 opacity-50" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-tr-full -ml-12 -mb-12 opacity-50" />

          <form onSubmit={handleSubmit} className="relative space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-3.5 text-stone-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 focus:outline-none ${errors.name ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[10px] uppercase font-bold mt-1 pl-1">
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-3.5 text-stone-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 focus:outline-none ${errors.phone ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                    placeholder="Your Phone Number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] uppercase font-bold mt-1 pl-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-3.5 text-stone-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 focus:outline-none ${errors.email ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                    placeholder="Your Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px] uppercase font-bold mt-1 pl-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  Estimated Quantity
                </label>
                <div className="relative">
                  <Package
                    className="absolute left-4 top-3.5 text-stone-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 focus:outline-none ${errors.quantity ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                    placeholder="Number of items/people"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-[10px] uppercase font-bold mt-1 pl-1">
                      {errors.quantity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-3.5 text-stone-400"
                  size={20}
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-2 transition-colors text-stone-800 placeholder-stone-400 focus:outline-none ${errors.address ? "border-red-500 focus:border-red-500" : "border-stone-100 focus:border-orange-500"}`}
                  placeholder="Full delivery address"
                />
                {errors.address && (
                  <p className="text-red-500 text-[10px] uppercase font-bold mt-1 pl-1">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                Order Details / Special Instructions
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 focus:border-orange-500 focus:outline-none transition-colors text-stone-800 placeholder-stone-400 resize-none"
                placeholder="Describe your order requirements, preferred delivery time, etc."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-orange-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              Submit Inquiry <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkOrder;
