"use client";

import { motion, useReducedMotion } from "framer-motion";

export function GradientBackground() {
  const prefersReducedMotion = useReducedMotion();

  const floatTransition = prefersReducedMotion
    ? undefined
    : { duration: 20, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background" aria-hidden="true">
      <motion.div
        className="absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
        transition={floatTransition}
      />
      <motion.div
        className="absolute -right-32 top-1/4 h-[600px] w-[600px] rounded-full opacity-[0.18]"
        style={{
          background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          filter: "blur(110px)",
        }}
        animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full opacity-[0.15]"
        style={{
          background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute right-1/4 top-2/3 h-[400px] w-[400px] rounded-full opacity-[0.12]"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}
