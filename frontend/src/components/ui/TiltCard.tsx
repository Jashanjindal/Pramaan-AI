"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  glareColor?: string;
}

/** Card that tilts in 3D toward the pointer and renders a cursor-tracking glare. */
export function TiltCard({
  className,
  children,
  maxTilt = 8,
  glareColor = "rgba(37, 99, 235, 0.18)",
  ...props
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });

  const glare = useMotionTemplate`radial-gradient(320px circle at ${glareX}% ${glareY}%, ${glareColor}, transparent 70%)`;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * maxTilt * 2);
    rotateX.set((0.5 - py) * maxTilt * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(1);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className={cn("relative will-change-transform", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      <motion.div
        aria-hidden
        style={{ backgroundImage: glare, opacity: glareOpacity }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
      />
      {children}
    </motion.div>
  );
}
