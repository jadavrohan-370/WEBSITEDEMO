import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Logo from "../assets/logobgremove.png";

const Loader = ({ onComplete, loaded }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Initial Animation (Entrance + Loop)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(logoRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      }).to(logoRef.current, {
        scale: 0.95,
        duration: 1.5,
        yoyo: true,
        repeat: -1, // Infinite loop while waiting
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  // Progress Counter Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        let next = prev + Math.floor(Math.random() * 5) + 1;

        // If not fully loaded from parent, stall at 90%
        if (!loaded && next > 90) {
          return 90;
        }

        // Cap at 100
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [loaded]);

  // Exit Trigger
  useEffect(() => {
    if (progress === 100) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      tl.to(progressRef.current, {
        opacity: 0,
        duration: 0.5,
      }).to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    }
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-stone-50 overflow-hidden"
    >
      <div className="relative">
        {/* Decorative Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-orange-100 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-orange-50 rounded-full animate-ping opacity-30"></div>

        <div className="relative z-10 p-8 bg-white rounded-full shadow-2xl shadow-orange-100/50">
          <img
            ref={logoRef}
            src={Logo}
            alt="Loading..."
            className="w-32 h-32 object-contain opacity-0 scale-50"
          />
        </div>
      </div>

      <div
        ref={progressRef}
        className="mt-8 text-orange-600/60 font-display font-medium text-lg tracking-widest"
      >
        {progress}%
      </div>
    </div>
  );
};

export default Loader;
