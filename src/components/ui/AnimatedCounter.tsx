"use client";

import { memo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

function AnimatedCounterComponent({
  value,
  suffix = "",
  duration = 1,
  className = "",
}: AnimatedCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let start = 0;
    const step = value / (duration * 30);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(Math.round(start));
      }
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [value, duration, prefersReducedMotion]);

  const shown = prefersReducedMotion ? value : display;

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
    >
      {shown}
      {suffix}
    </motion.span>
  );
}

export const AnimatedCounter = memo(AnimatedCounterComponent);
