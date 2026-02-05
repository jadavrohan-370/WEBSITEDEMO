import React, { useEffect, useRef } from "react";
import { ArrowBigRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const About = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Hero Entrance
      const tlHero = gsap.timeline();
      tlHero
        .from(".about-hero-title", {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
        })
        .from(
          ".about-hero-sub",
          {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8",
        );

      // Story Section Reveal
      gsap.from(".story-image", {
        scale: 1.2,
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 70%",
        },
      });

      gsap.from(".story-content > *", {
        x: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 75%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white min-h-screen overflow-hidden">
      {/* Premium Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[70vh] flex items-center justify-center pt-20"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1664304040647-44b617e6317b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29ya2luZyUyMHBlcnNvbiUyMGluJTIwaXQlMjBDb21wYW55fGVufDB8fDB8fHww"
            className="w-full h-full object-cover"
            alt="About Hero"
          />
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <h5 className="text-amber-400 font-bold tracking-[0.4em] uppercase text-xs mb-6 about-hero-sub">
            The Essence of Flavors
          </h5>
          <h1 className="text-7xl md:text-9xl font-display text-white font-bold leading-tight about-hero-title">
            Our <span className="font-serif italic text-amber-500">Story</span>
          </h1>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-white to-transparent"></div>
      </section>

      {/* The Story Section */}
      <section className="story-section max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left: Artistic Image Mask */}
          <div className="lg:w-1/2 relative">
            <div className="story-image relative z-10 rounded-[60px] overflow-hidden border-12 border-stone-50 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80"
                className="w-full h-[650px] object-cover hover:scale-105 transition-transform duration-1000"
                alt="Our Kitchen"
              />
            </div>
            {/* Background Shape */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-100 rounded-full z-0"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-stone-100 rounded-[80px] rotate-12 z-0"></div>
          </div>

          {/* Right: Refined Content */}
          <div className="lg:w-1/2 space-y-8 story-content">
            <div className="inline-block px-4 py-1 border border-amber-200 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest">
              Est. 1995
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-stone-900 leading-tight">
              Crafting{" "}
              <span className="font-serif italic text-amber-600">
                Extraordinary
              </span>{" "}
              <br /> Culinary Moments
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed font-light">
              Since our humble beginnings in, Bharti Food and Beverages has been
              more than just a catering service. We are storytellers who use
              flavors as our language. Our mission is to transform every meal
              into a memory.
            </p>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 text-stone-800 font-medium">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  <ArrowBigRight size={18} />
                </div>
                <span>Curated menus for every unique palate</span>
              </div>
              <div className="flex items-center gap-4 text-stone-800 font-medium">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  <ArrowBigRight size={18} />
                </div>
                <span>Sustainable, farm-to-table sourcing</span>
              </div>
              <div className="flex items-center gap-4 text-stone-800 font-medium">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  <ArrowBigRight size={18} />
                </div>
                <span>Exquisite presentation that wows</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
