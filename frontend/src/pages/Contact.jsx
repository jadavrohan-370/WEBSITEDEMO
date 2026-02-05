import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  MessageSquare,
} from "lucide-react";
import { messageService } from "../services/apiClient";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    botcheck: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Hero Animation
      tl.from(".contact-hero-content > *", {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out",
      });

      // Split Card Animation
      gsap.from(".info-card", {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".info-card",
          start: "top 80%",
        },
      });

      gsap.from(".form-card", {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".form-card",
          start: "top 80%",
        },
      });

      // Map Reveal
      gsap.from(mapRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (formData.botcheck) return false;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email";

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Please enter a valid 10-digit phone number";

    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await messageService.sendMessage(formData);
        if (response.success) {
          alert("Message Sent Successfully!");
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
            botcheck: "",
          });
        }
      } catch (err) {
        console.error("Contact form error:", err);
        alert("Failed to send message.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-stone-50 min-h-screen overflow-hidden"
    >
      {/* Premium Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 contact-hero-content">
          <h5 className="text-amber-500 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Get In Touch
          </h5>
          <h1 className="text-6xl md:text-8xl font-display text-white font-bold leading-tight mb-6">
            Contact <span className="font-serif italic text-amber-500">Us</span>
          </h1>
          <p className="max-w-xl mx-auto text-stone-300 text-lg font-light leading-relaxed">
            We're here to help you create unforgettable culinary experiences.
            Reach out to us for any inquiries or bookings.
          </p>
        </div>
      </section>

      {/* Main Content Side-by-Side */}
      <section className="container mx-auto px-4 py-24 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-2xl rounded-[40px] overflow-hidden bg-white">
          {/* Left Side: Professional Info Card */}
          <div className="lg:col-span-5 bg-stone-900 p-12 lg:p-16 text-white flex flex-col justify-between relative info-card overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-600 rounded-full blur-[120px] opacity-10"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                Let's Start a <br />
                <span className="text-amber-500 font-serif italic text-5xl">
                  Conversation
                </span>
              </h2>

              <div className="space-y-10 mt-12">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Our Studio
                    </h4>
                    <p className="text-lg font-medium">
                      123 Foodie Lane, Gourmet City, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Call Us
                    </h4>
                    <p className="text-lg font-medium">+1 (234) 567-890</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Email Us
                    </h4>
                    <p className="text-lg font-medium underline underline-offset-4 decoration-stone-600 hover:decoration-amber-500 transition-all cursor-pointer">
                      hello@bhartifoods.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Visit Us
                    </h4>
                    <p className="text-lg font-medium">
                      Mon - Sat: 9:00 AM - 10:00 PM
                    </p>
                    <p className="text-lg font-medium opacity-50">
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-white/10 relative z-10">
              <p className="text-stone-500 text-sm font-medium italic">
                "Good food is the foundation of genuine happiness."
              </p>
            </div>
          </div>

          {/* Right Side: Elegant Form Card */}
          <div className="lg:col-span-7 p-12 lg:p-16 form-card">
            <h3 className="text-3xl font-display font-bold text-stone-900 mb-2">
              Send Message
            </h3>
            <p className="text-stone-500 mb-10">
              Use the form below to share your requirements with us.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="hidden">
                <input
                  type="text"
                  name="botcheck"
                  value={formData.botcheck}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-stone-700 text-xs font-bold uppercase tracking-widest pl-1">
                    Your Name
                  </label>
                  <div className="relative border-b-2 border-stone-200 focus-within:border-amber-500 transition-colors">
                    <User
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full pl-8 py-3 bg-transparent outline-none font-medium text-stone-900 placeholder:text-stone-300"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-[10px] uppercase font-bold">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-stone-700 text-xs font-bold uppercase tracking-widest pl-1">
                    Your Email
                  </label>
                  <div className="relative border-b-2 border-stone-200 focus-within:border-amber-500 transition-colors">
                    <Mail
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full pl-8 py-3 bg-transparent outline-none font-medium text-stone-900 placeholder:text-stone-300"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] uppercase font-bold">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-stone-700 text-xs font-bold uppercase tracking-widest pl-1">
                    Phone Number
                  </label>
                  <div className="relative border-b-2 border-stone-200 focus-within:border-amber-500 transition-colors">
                    <Phone
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (234) 567"
                      className="w-full pl-8 py-3 bg-transparent outline-none font-medium text-stone-900 placeholder:text-stone-300"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] uppercase font-bold">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="space-y-2">
                    <label className="text-stone-700 text-xs font-bold uppercase tracking-widest pl-1">
                      Subject
                    </label>
                    <div className="relative border-b-2 border-stone-200 focus-within:border-amber-500 transition-colors">
                      <MessageSquare
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="General Inquiry"
                        className="w-full pl-8 py-3 bg-transparent outline-none font-medium text-stone-900 placeholder:text-stone-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-stone-700 text-xs font-bold uppercase tracking-widest pl-1">
                  How can we help?
                </label>
                <div className="relative border-b-2 border-stone-200 focus-within:border-amber-500 transition-colors">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about your event..."
                    className="w-full py-3 bg-transparent outline-none font-medium text-stone-900 placeholder:text-stone-300 resize-none"
                  ></textarea>
                </div>
                {errors.message && (
                  <p className="text-red-500 text-[10px] uppercase font-bold">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden bg-amber-500 text-white font-bold py-5 px-10 rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 w-full md:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-widest uppercase text-xs">
                  {loading ? "Sending..." : "Send Message"}
                  <Send
                    size={16}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-stone-900 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Modern Map Integration */}
      <section ref={mapRef} className="px-4 pb-24">
        <div className="container mx-auto rounded-[40px] overflow-hidden border-4 border-white shadow-2xl h-[500px]">
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.8126443316933!2d70.7653258753697!3d22.322924379670287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c9fa39c9b46d%3A0xb5688316b507f41c!2swebvibe%20infotech!5e0!3m2!1sen!2sin!4v1769669882430!5m2!1sen!2sin"
            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000"
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
