"use client";

import { motion } from "framer-motion";
import { springSoft } from "@/lib/motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  role?: string;
  ariaLabel?: string;
}

export function GlassCard({
  children,
  className = "",
  delay = 0,
  role,
  ariaLabel,
}: GlassCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSoft, delay }}
      className={`glass rounded-[24px] p-6 md:p-8 ${className}`}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </motion.section>
  );
}
