import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import gsap from "gsap";
import Logodemo from "../assets/logodfinale.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchFromUrl = queryParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [lastUrlSearch, setLastUrlSearch] = useState(searchFromUrl);

  if (searchFromUrl !== lastUrlSearch) {
    setLastUrlSearch(searchFromUrl);
    setSearchQuery(searchFromUrl);
  }

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/product", label: "Product" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 },
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled ? "bg-white backdrop-blur-xl shadow-lg py-2" : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group relative z-50">
            <img
              src={Logodemo}
              alt="Bharti Food"
              className={`object-contain transition-all duration-500 ${
                scrolled ? "w-16 h-16" : "w-20 h-20"
              }`}
            />
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center relative group">
            <div className="flex items-center bg-stone-100/50 border border-stone-200 rounded-full px-4 py-2 w-72 transition-all duration-300 focus-within:border-amber-500 focus-within:bg-white shadow-sm">
              <button
                onClick={() =>
                  handleSearch({ key: "Enter", target: { value: searchQuery } })
                }
              >
                <Search size={25} className="text-stone-500" />
              </button>
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent border-none outline-none ml-3 text-sm w-full text-stone-700 placeholder:text-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-8">
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className={`group relative text-base font-semibold transition-colors duration-300 ${
                    location.pathname === link.path
                      ? "text-amber-600"
                      : "text-stone-600 hover:text-amber-600"
                  }`}
                >
                  {link.label}
                  {/* Underline Animation */}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-0.5 bg-amber-600 rounded-full transform origin-left transition-transform duration-300 ${
                      location.pathname === link.path
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden text-stone-800 p-2 hover:bg-black/5 rounded-full transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={24} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-stone-800 p-2 hover:bg-black/5 rounded-full transition-colors relative z-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Overlay */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-b border-stone-100 p-4 transition-all duration-300 transform ${isSearchOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-4 opacity-0 invisible"}`}
        >
          <div className="relative flex items-center bg-stone-100 rounded-xl px-4 py-3">
            <Search size={20} className="text-stone-500" />
            <input
              type="text"
              placeholder="Search for dishes, drinks..."
              className="bg-transparent border-none outline-none ml-3 text-base w-full"
              autoFocus={isSearchOpen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button onClick={() => setIsSearchOpen(false)}>
              <X size={20} className="text-stone-400" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-stone-100 shadow-xl transition-all duration-500 ease-in-out transform origin-top ${
            isOpen
              ? "opacity-100 scale-y-100 translate-y-0 visible"
              : "opacity-0 scale-y-95 -translate-y-4 invisible"
          }`}
        >
          <ul className="flex flex-col p-6 gap-4">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block p-4 rounded-xl text-lg font-bold transition-all duration-300 ${
                    location.pathname === link.path
                      ? "bg-amber-50 text-amber-600 pl-6"
                      : "text-stone-600 hover:bg-stone-50 hover:pl-6"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
