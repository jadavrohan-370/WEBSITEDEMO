import React, { useEffect, useRef } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Check, MapPin, Phone, Mail, Clock, Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Logodemo from "../assets/logobgremove.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const navigate = useNavigate();
  const galleryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-item", {
        scale: 0.5,
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: {
          each: 0.1,
          grid: [2, 3],
          from: "start",
        },
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 90%",
        },
      });

      gsap.to(".gallery-item", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.3,
          from: "random",
        },
      });
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  const galleryItems = [
    {
      category: "Noodles",
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=150&auto=format&fit=crop&q=60",
    },
    {
      category: "Pasta",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=150&auto=format&fit=crop&q=60",
    },
    {
      category: "Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=60",
    },
    {
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1593504049359-74330189a345?w=150&auto=format&fit=crop&q=60",
    },
    {
      category: "Biryani",
      image:
        "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?w=150&auto=format&fit=crop&q=60",
    },
    {
      category: "Farsan",
      image:
        "https://media.istockphoto.com/id/1485296400/photo/jada-poha-namkeen-chivda-or-thick-pohe-chiwda-diwali-special-savory-snack-made-out-of-puffed.webp?a=1&b=1&s=612x612&w=0&k=20&c=WvZli1Ue3WmR9Cez7DoZXN7ZrkOFzhU0AIMjJwAalvc=",
    },
  ];

  return (
    <footer className="bg-stone-50 text-stone-600 pt-16 pb-8 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link
              to="/"
              className="inline-block transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={Logodemo}
                alt="Bharti Food Logo"
                className="w-24 h-24 object-contain contrast-125"
              />
            </Link>
            <p className="text-sm leading-loose">
              There cursus massa at urnaaculis estieSed aliquamellus vitae ultrs
              condmentum leo massamollis its estiegittis miristum.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="bg-amber-100 text-amber-700 p-3 rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <Icon size={16} />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-stone-800 mb-6 font-display">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Home", path: "/" },
                { label: "Product", path: "/product" },
                { label: "Services", path: "/services" },
                { label: "About Us", path: "/about" },
                { label: "Contact Us", path: "/contact" },
              ].map((link, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <Check
                    size={18}
                    className="text-amber-600 group-hover:scale-125 transition-transform"
                  />
                  <Link
                    to={link.path}
                    className="hover:text-amber-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h3 className="text-xl font-bold text-stone-800 mb-6 font-display">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-amber-600 mt-1 shrink-0" />
                <span>123 Street, New York, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-amber-600 shrink-0" />
                <span>(+012) 3456 7890 123</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-amber-600 shrink-0" />
                <span>info@example.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={20} className="text-amber-600 shrink-0" />
                <span>26/7 Hours Service</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Gallery */}
          <div>
            <h3 className="text-xl font-bold text-stone-800 mb-6 font-display">
              Social Gallery
            </h3>
            <div ref={galleryRef} className="grid grid-cols-3 gap-2">
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    navigate("/menu", { state: { category: item.category } })
                  }
                  className="gallery-item relative aspect-square rounded-full overflow-hidden border-2 border-stone-200 hover:border-amber-400 cursor-pointer transition-colors group"
                  title={`View ${item.category}`}
                >
                  <img
                    src={item.image}
                    alt={item.category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-amber-600/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white/90 p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 -rotate-45 group-hover:rotate-0">
                      <Search size={16} className="text-amber-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>&copy; 2024 Your Site Name. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-amber-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-amber-600">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
