"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient bar pinned to the top of the viewport tracking page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-primary via-secondary to-accent z-[60] pointer-events-none"
    />
  );
}
