"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  value,
  decimals = 0,
  duration = 1.2,
  prefix = "",
  suffix = "",
  ...props
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = React.useState(reduceMotion ? value : 0);

  React.useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} {...props}>
      {prefix}
      {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
