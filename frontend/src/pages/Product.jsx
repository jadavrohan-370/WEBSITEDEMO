import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, Calendar, MapPin, ArrowRight, Users } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "../components/CountUp";
import { productService } from "../services/apiClient";

const Product = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [productItems, setProductItems] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  const queryParams = new URLSearchParams(search);
  const searchTerm = queryParams.get("search") || "";

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setProductItems(data.products || []);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setProductItems([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(productItems.map((item) => item.category)),
  ];

  const filteredEvents = productItems.filter((item) => {
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Initial animations for static elements
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        ".section-header > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".section-header", start: "top 80%" },
        },
      );

      // Stats Animation
      gsap.fromTo(
        ".stat-card",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: ".stats-container", start: "top 85%" },
        },
      );

      // Filter Animation
      gsap.fromTo(
        ".filter-btn",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          delay: 0.2,
          scrollTrigger: { trigger: ".filter-container", start: "top 85%" },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animations for dynamic elements (cards)
  useEffect(() => {
    if (loading || filteredEvents.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".event-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".events-grid", start: "top 85%" },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading, filteredEvents]);

  return (
    <div
      ref={containerRef}
      className="bg-stone-50 min-h-screen py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 section-header">
          <h5 className="inline-block px-5 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-600 text-sm font-bold tracking-widest uppercase mb-4">
            Product
          </h5>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-stone-900 mb-6 drop-shadow-sm">
            Product{" "}
            <span className="text-orange-600 font-serif italic">Page</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-stone-500 font-light leading-relaxed">
            Witness the elegance and precision of our Product. We turn tailored
            concepts into unforgettable realities.
          </p>
        </div>

        {/* Stats Section */}
        <div className="stats-container flex flex-wrap justify-center gap-6 lg:gap-8 mb-20">
          {/* Happy Customer */}
          <div className="stat-card bg-orange-600 rounded-4xl p-8 flex flex-col items-center justify-center text-white w-full sm:w-64 aspect-square shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <Users size={48} className="mb-4 stroke-[1.5]" />
            <span className="font-display text-2xl mb-2 tracking-wide">
              Happy Customer
            </span>
            <div className="text-4xl font-bold flex items-center">
              <CountUp from={0} to={200} duration={2} />
              <span className="ml-1">+</span>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="filter-container flex flex-wrap justify-center gap-3 mb-20">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`filter-btn px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-1 ${
                activeTab === tab
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105"
                  : "bg-white text-stone-500 border border-stone-200 hover:border-orange-300 hover:text-orange-600 hover:shadow-md"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-orange-600 font-bold text-lg">
              Loading menu items...
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="events-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="event-card group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute top-5 left-5 z-20">
                      <span className="bg-white/95 backdrop-blur-sm text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-8 flex flex-col grow relative">
                    {/* Floating Date Badge */}
                    <div className="absolute -top-12 right-8 bg-orange-600 text-white p-3 rounded-xl shadow-lg text-center min-w-16 group-hover:-translate-y-2 transition-transform duration-300 z-20">
                      <button
                        className="block text-xs cursor-pointer uppercase font-medium"
                        onClick={() =>
                          navigate("/add-order", { state: { item: event } })
                        }
                      >
                        Order{" "}
                      </button>
                      <button
                        className="block text-xl cursor-pointer font-bold font-display leading-tight"
                        onClick={() =>
                          navigate("/add-order", { state: { item: event } })
                        }
                      >
                        Now
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-stone-400 text-xs font-medium uppercase tracking-wide mb-3 mt-2"></div>

                    <p className="text-stone-500 text-sm leading-relaxed mb-6 grow border-b border-stone-100 pb-6 border-dashed">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between w-full pt-2">
                      <h3 className="text-xl font-display font-bold text-stone-800 group-hover:text-orange-600 transition-colors">
                        {event.name}
                      </h3>
                      <span className="text-lg font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-lg border border-orange-500 cursor-pointer">
                        ₹{event.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-stone-400 col-span-full">
                <Camera size={64} className="mx-auto mb-6 opacity-20" />
                <p className="text-xl font-display">
                  No items found in this category.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
