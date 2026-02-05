import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function CountUp({
    to,
    from = 0,
    direction = "up",
    duration = 2,
    separator = ",",
    className = "",
    startCounting = true,
}) {
    const ref = useRef(null);
    const motionValue = useMotionValue(direction === "down" ? to : from);

    // Using plain animate might be more predictable for a simple linear duration than spring if 'duration' is explicit in seconds
    // But user passed duration=1, likely seconds.

    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView && startCounting) {
            // animate(motionValue, to, { duration: duration });
            motionValue.set(direction === "down" ? from : to);
        }
    }, [isInView, startCounting, motionValue, to, from, direction]);

    useEffect(() => {
        // If we use spring, it ignores duration somewhat in favor of physics, but we can tune it.
        // Or we can just use manual updates or AnimatePresence. 
        // Let's stick to a simple spring for smoothness
    }, []);

    // Alternative implementation using simple JS for exact duration control if spring is too floaty
    // But let's use spring for that nice ease-out effect.

    // Re-implementing correctly with animate function for better duration control? 
    // Actually, spring is nicer for numbers.

    const spring = useSpring(motionValue, {
        duration: duration * 1000,
        bounce: 0,
        stiffness: 50, // lower stiffness for longer duration-feel
        damping: 20
    });

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const unsubscribe = spring.on("change", (latest) => {
            const value = Math.floor(latest);
            // Basic comma separator
            const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
            node.textContent = formatted;
        });

        return () => unsubscribe();
    }, [spring, separator]);

    return <span className={className} ref={ref} />;
}
