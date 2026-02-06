import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import TextType from "../components/TextType";
import Product from "./Product";
import Contact from "./Contact";
import About from "./About";
import FeedBack from "../components/FeedBack";
const Home = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const gridRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Text Content Animation
      tl.from(textRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Diamond Grid Entrance
      tl.from(
        gridRef.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.5",
      );

      // Individual Diamonds Stagger
      tl.from(
        ".diamond-item",
        {
          scale: 0,
          rotation: -45,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        "-=0.8",
      );

      // Floating Icons Animation
      gsap.to(".floating-icon", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          from: "random",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={containerRef} className="min-h-screen bg-stone-50">
        <main className="flex-1 overflow-y-auto p-8 pt-44">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Side: Text Content */}
            <div ref={textRef} className="lg:w-1/2 space-y-8">
              <div className="overflow-hidden">
                <h2 className="text-l border-2 border-stone-500 rounded-full p-2 w-fit font-bold text-stone-600 text-left px-4">
                  Welcome to Our Restaurant
                </h2>
              </div>
              <div className="text-stone-800 text-left text-5xl md:text-6xl max-w-2xl font-display font-bold leading-tight h-[150px] md:h-[180px]">
                <span className="text-amber-600 block font-serif italic">
                  Book your{" "}
                </span>
                <TextType
                  texts={[
                    "Delicious Food",
                    "Tasty Beverages",
                    "Exquisite Meals",
                  ]}
                  typingSpeed={100}
                  deletingSpeed={50}
                  pauseDuration={2000}
                  cursorCharacter="|"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-amber-600 text-white px-8 py-4 rounded-full hover:bg-amber-700 transition-all shadow-lg font-semibold hover:-translate-y-1 transform active:scale-95"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => navigate("/add-order")}
                  className="bg-white text-amber-600 border-2 border-amber-600 px-8 py-4 rounded-full hover:bg-amber-50 transition-all shadow-lg font-semibold hover:-translate-y-1 transform active:scale-95"
                >
                  View Products
                </button>
              </div>
            </div>

            <div
              ref={gridRef}
              className="lg:w-1/2 relative h-[500px] w-full flex justify-center items-center scale-75 md:scale-100"
            >
              <div className="relative w-[450px] h-[450px]">
                <div className="diamond-item absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rotate-45 overflow-hidden border-4 border-stone-100 rounded-3xl shadow-2xl z-20">
                  <img
                    src="https://imgs.search.brave.com/GdzK-5Zsz_0ov6nJxpPBZRpqskqHMtROkjwZa_QWHzA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by91cmFkLWRh/bC1yb2FzdGVkLXBh/cGFkLWluZGlhbi0y/NjBudy0yMTY0Mzc1/ODA1LmpwZw"
                    alt="Delicious Food"
                    className="w-full h-full object-cover -rotate-45 scale-150"
                  />
                </div>

                <div className="diamond-item absolute top-0 left-8 w-40 h-40 bg-white rotate-45 overflow-hidden border-4 border-stone-100 rounded-2xl shadow-lg z-10">
                  <img
                    src="https://imgs.search.brave.com/GdzK-5Zsz_0ov6nJxpPBZRpqskqHMtROkjwZa_QWHzA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by91cmFkLWRh/bC1yb2FzdGVkLXBh/cGFkLWluZGlhbi0y/NjBudy0yMTY0Mzc1/ODA1LmpwZw"
                    alt="Papad"
                    className="w-full h-full object-cover -rotate-45 scale-150"
                  />
                </div>
                <div className="diamond-item absolute top-0 right-8 w-40 h-40 bg-white rotate-45 overflow-hidden border-4 border-stone-100 rounded-2xl shadow-lg z-10">
                  <img
                    src="https://imgs.search.brave.com/GdzK-5Zsz_0ov6nJxpPBZRpqskqHMtROkjwZa_QWHzA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by91cmFkLWRh/bC1yb2FzdGVkLXBh/cGFkLWluZGlhbi0y/NjBudy0yMTY0Mzc1/ODA1LmpwZw"
                    alt="Papad"
                    className="w-full h-full object-cover -rotate-45 scale-150"
                  />
                </div>

                <div className="diamond-item absolute bottom-0 left-8 w-40 h-40 bg-white rotate-45 overflow-hidden border-4 border-stone-100 rounded-2xl shadow-lg z-10">
                  <img
                    src="https://imgs.search.brave.com/GWfDFKeIHI_w9LGayKk7QLTSiN8BRx2c1d5Wp-kaSE0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE3LzEyLzA4LzYy/LzM2MF9GXzE3MTIw/ODYyOTNfSGZxODlv/NVRNRnJ1TTJEZHBa/MW1oT3EyWFBIOGts/cGouanBn"
                    alt="Papad"
                    className="w-full h-full object-cover -rotate-45 scale-150"
                  />
                </div>
                <div className="diamond-item absolute bottom-0 right-8 w-40 h-40 bg-white rotate-45 overflow-hidden border-4 border-stone-100 rounded-2xl shadow-lg z-10">
                  <img
                    src="https://imgs.search.brave.com/j8douSyAGFwJO7jOhS3jpmMMe5CKQ2qMN9OykWITO3Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9taXhl/ZC12ZWdldGFibGUt/cGlja2xlLWluZGlh/bi1waWNrbGUtYXMt/bmFtZS1zdWdnZXN0/cy1tYWRlLW51bWJl/ci12ZWdldGFibGVz/LWNhbi12YXJ5LW9u/ZS1wbGFjZS0zODUx/MTcxOS5qcGc"
                    alt="Papad"
                    className="w-full h-full object-cover -rotate-45 scale-150"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Product />
        <About />
        <FeedBack />
        <Contact />
      </div>
    </>
  );
};

export default Home;
