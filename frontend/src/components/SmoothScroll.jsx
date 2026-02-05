import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

// Component to handle GSAP integration hook inside the context
function GsapIntegration() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Synchronize functionality
    // 1. Force ScrollTrigger to update on scroll
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Drive Lenis with GSAP's Ticker for perfect synchronization
    // This allows GSAP animations and scrolling to run in the exact same frame loop
    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // 3. Disable GSAP's lag smoothing to prevent stutter during heavy scrolling interactions
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

const SmoothScroll = ({ children }) => {
  return (
    // autoRaf={false} because we are driving it manually with gsap.ticker
    <ReactLenis
      root
      options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}
      autoRaf={false}
    >
      <GsapIntegration />
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
