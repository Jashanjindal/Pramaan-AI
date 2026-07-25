"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  direction?: Direction;
  once?: boolean;
  amount?: number;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  duration = 0.55,
  direction = "up",
  once = true,
  amount = 0.2,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? offsets.none : offsets[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}
