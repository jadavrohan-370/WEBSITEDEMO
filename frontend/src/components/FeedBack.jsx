import React, { useEffect, useRef } from "react";
import { Star, Quote, MoveRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    id: 1,
    name: "Emily Thompson",
    role: "Food Blogger",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
    rating: 5,
    text: "The ambiance is absolutely stunning, and the food matches the vibe perfectly. The pasta was cooked to perfection!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Frequent Diner",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
    rating: 5,
    text: "Hands down the best service in town. Every dish felt like a masterpiece. Highly recommend the Chef's Special.",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Local Guide",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
    rating: 4,
    text: "A delightful experience! The flavors were rich and authentic. Just wish I had saved more room for dessert.",
  },
];

const FeedbackCard = ({ review, dark = false }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    // Mouse movement tracking for 3D tilt
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
      const rotateY = ((x - centerX) / centerX) * 10;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000,
        transformOrigin: "center",
      });

      // Glow effect following mouse
      gsap.to(glowRef.current, {
        x: x,
        y: y,
        duration: 0.4,
        ease: "power2.out",
        opacity: dark ? 0.2 : 0.4,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dark]);

  return (
    <div
      ref={cardRef}
      className={`relative p-8 rounded-3xl shadow-2xl border transition-colors duration-500 group h-full overflow-hidden ${
        dark
          ? "bg-white/5 border-white/10 backdrop-blur-md"
          : "bg-white border-stone-100"
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Moving Glow */}
      <div
        ref={glowRef}
        className={`absolute w-64 h-64 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-soft-light transition-opacity ${
          dark ? "bg-amber-500" : "bg-amber-400"
        }`}
        style={{ top: 0, left: 0 }}
      />

      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        <div
          className={`absolute top-0 right-0 -mr-4 -mt-4 transition-colors ${
            dark ? "text-white/5" : "text-amber-100"
          }`}
        >
          <Quote size={80} fill="currentColor" />
        </div>

        <div className="flex gap-1 mb-6 text-amber-500">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={20} fill="currentColor" />
          ))}
        </div>

        <p
          className={`italic mb-8 leading-relaxed font-body text-lg transition-colors ${
            dark ? "text-stone-300" : "text-stone-700"
          }`}
        >
          "{review.text}"
        </p>

        <div
          className={`flex items-center gap-4 border-t pt-6 transition-colors ${
            dark ? "border-white/10" : "border-stone-100"
          }`}
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 p-0.5 shrink-0">
            <img
              src={review.image}
              alt={review.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h4
              className={`font-bold font-body text-lg transition-colors ${
                dark ? "text-white" : "text-stone-900"
              }`}
            >
              {review.name}
            </h4>
            <span className="text-sm text-amber-600 font-medium font-body flex items-center gap-1">
              {review.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedBack = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);

  // Duplicate reviews for seamless infinite loop
  const row1Reviews = [...reviews, ...reviews, ...reviews];
  const row2Reviews = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation for title
      gsap.from(titleRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        },
      });

      // Infinite Horizontal Scroll Row 1 (Left)
      const slider1 = slider1Ref.current;
      const scrollWidth1 = slider1.scrollWidth / 3;

      const tl1 = gsap.to(slider1, {
        x: -scrollWidth1,
        duration: 30,
        ease: "none",
        repeat: -1,
      });

      // Infinite Horizontal Scroll Row 2 (Right)
      const slider2 = slider2Ref.current;
      const scrollWidth2 = slider2.scrollWidth / 3;
      gsap.set(slider2, { x: -scrollWidth2 });

      const tl2 = gsap.to(slider2, {
        x: 0,
        duration: 30,
        ease: "none",
        repeat: -1,
        onReverseComplete: () => {
          gsap.set(slider2, { x: -scrollWidth2 });
        },
      });

      // --- Motion Capture (Scroll Velocity) ---
      // This makes the rows speed up when the user scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity() / 500);
          gsap.to([tl1, tl2], {
            timeScale: 1 + velocity,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });

      // Pause on hover
      const handleMouseEnter = (tl) => tl.pause();
      const handleMouseLeave = (tl) => tl.play();

      slider1.addEventListener("mouseenter", () => handleMouseEnter(tl1));
      slider1.addEventListener("mouseleave", () => handleMouseLeave(tl1));
      slider2.addEventListener("mouseenter", () => handleMouseEnter(tl2));
      slider2.addEventListener("mouseleave", () => handleMouseLeave(tl2));

      return () => {
        slider1.removeEventListener("mouseenter", () => handleMouseEnter(tl1));
        slider1.removeEventListener("mouseleave", () => handleMouseLeave(tl1));
        slider2.removeEventListener("mouseenter", () => handleMouseEnter(tl2));
        slider2.removeEventListener("mouseleave", () => handleMouseLeave(tl2));
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-[#fffcf9] overflow-hidden relative"
    >
      {/* Premium Light Background System */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Soft Warm Gradients */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[100px] opacity-60" />

        {/* Decorative thin lines */}
        <div className="absolute top-0 left-[10%] w-1px h-full bg-stone-100" />
        <div className="absolute top-0 right-[10%] w-1px h-full bg-stone-100" />
      </div>

      <div className="relative z-10">
        <div ref={titleRef} className="text-center mb-20 px-6">
          <span className="inline-block py-1 px-4 rounded-full bg-amber-100 text-amber-800 text-sm font-bold tracking-widest mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-5xl md:text-7xl font-display text-stone-900 mb-6 tracking-tight">
            Guest <span className="text-amber-600 italic">Testimonials</span>
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg leading-relaxed font-body">
            Each review is a testament to our dedication to culinary excellence
            and exceptional guest experiences.
          </p>
        </div>

        {/* Sliders Container */}
        <div className="flex flex-col gap-12 py-10 relative">
          {/* Row 1: Left */}
          <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
            <div ref={slider1Ref} className="flex gap-10 px-4 w-max">
              {row1Reviews.map((review, index) => (
                <div
                  key={`row1-${review.id}-${index}`}
                  className="feedback-card-wrapper w-[420px] shrink-0"
                >
                  <FeedbackCard review={review} dark={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right */}
          <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
            <div ref={slider2Ref} className="flex gap-10 px-4 w-max">
              {row2Reviews.map((review, index) => (
                <div
                  key={`row2-${review.id}-${index}`}
                  className="feedback-card-wrapper w-[420px] shrink-0"
                >
                  <FeedbackCard review={review} dark={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedBack;
