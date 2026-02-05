import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Calendar,
  MapPin,
  ArrowRight,
  Users,
  ChefHat,
  PartyPopper,
  Music,
  Heart,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "../components/CountUp";

gsap.registerPlugin(ScrollTrigger);

const eventsData = [
  {
    id: 1,
    title: "Dream Wedding",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    description:
      "A majestic destination wedding with traditional aesthetics and gourmet catering.",
    location: "Grand Ballroom",
  },
  {
    id: 2,
    title: "Corporate Summit",
    category: "Corporate",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    description:
      "Annual technology conference for industry leaders with premium service.",
    location: "Convention Center",
  },
  {
    id: 3,
    title: "Birthday Bash",
    category: "Birthday",
    image:
      "https://images.unsplash.com/photo-1464349153912-6a4be6355212?q=80&w=2068&auto=format&fit=crop",
    description: "Celebrating life with grandeur, joy, and delicious treats.",
    location: "Garden Lawns",
  },
  {
    id: 4,
    title: "Charity Gala",
    category: "Social",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
    description:
      "Strategic networking event for global partners and community building.",
    location: "City Hall",
  },
  {
    id: 5,
    title: "Sangeet Night",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop",
    description: "A vibrant outdoor setup for a pre-wedding musical night.",
    location: "Resort Poolside",
  },
  {
    id: 6,
    title: "Startup Meetup",
    category: "Corporate",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    description: "Networking dinner for emerging startups and investors.",
    location: "Tech Hub",
  },
];

const Events = () => {
  const [activeTab, setActiveTab] = useState("All Events");
  const containerRef = useRef(null);

  const filteredEvents =
    activeTab === "All Events"
      ? eventsData
      : eventsData.filter((event) => event.category === activeTab);

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
    if (filteredEvents.length === 0) return;

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
  }, [filteredEvents]);

  return (
    <div
      ref={containerRef}
      className="bg-stone-50 min-h-screen py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 section-header">
          <h5 className="inline-block px-5 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-600 text-sm font-bold tracking-widest uppercase mb-4">
            Our Events
          </h5>
          <h2 className="text-5xl md:text-6xl font-display text-stone-900 mb-6 drop-shadow-sm">
            Memorable <span className="text-orange-600">Moments</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-stone-500 font-light leading-relaxed">
            From intimate gatherings to grand celebrations, we bring your vision
            to life with impeccable service and style.
          </p>
        </div>

        {/* Filters */}
        <div className="filter-container flex flex-wrap justify-center gap-3 mb-20">
          {[
            "All Events",
            ...new Set(eventsData.map((item) => item.category)),
          ].map((tab) => (
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

        {/* Grid */}
        <div className="events-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="event-card group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-5 left-5 z-20">
                  <span className="bg-white/95 backdrop-blur-sm text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col grow relative">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-medium uppercase tracking-wide mb-3">
                  <MapPin size={14} className="text-orange-500" />{" "}
                  {event.location}
                </div>

                <h3 className="text-2xl font-display font-medium text-stone-800 mb-3 group-hover:text-orange-600 transition-colors">
                  {event.title}
                </h3>

                <p className="text-stone-500 text-sm leading-relaxed mb-6 grow border-b border-stone-100 pb-6 border-dashed">
                  {event.description}
                </p>

                <button className="flex items-center justify-between w-full text-stone-800 font-bold uppercase text-xs tracking-widest group/btn hover:text-orange-600 transition-colors">
                  View Details
                  <span className="bg-stone-100 p-2 rounded-full group-hover/btn:bg-orange-100 group-hover/btn:text-orange-600 transition-colors">
                    <ArrowRight
                      size={16}
                      className="transform group-hover/btn:-rotate-45 transition-transform duration-300"
                    />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 text-stone-400 animate-pulse">
            <Camera size={64} className="mx-auto mb-6 opacity-20" />
            <p className="text-xl font-display">
              No events found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
