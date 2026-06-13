"use client";

import { useReducedMotion } from "framer-motion";
import type { BurnoutSnapshot } from "@/types/wellness";
import { getRiskLabel } from "@/lib/scoring/burnout";
import { AnimatedCounter } from "./AnimatedCounter";

interface ProgressRingProps {
  score: number;
  riskLevel: BurnoutSnapshot["riskLevel"];
  size?: number;
}

const RISK_COLORS: Record<BurnoutSnapshot["riskLevel"], string> = {
  low: "#34d399",
  moderate: "#fbbf24",
  high: "#f97316",
  critical: "#ef4444",
};

export function ProgressRing({ score, riskLevel, size = 160 }: ProgressRingProps) {
  const prefersReducedMotion = useReducedMotion();
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = RISK_COLORS[riskLevel];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`Burnout risk score ${score} out of 100, ${getRiskLabel(riskLevel)}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={prefersReducedMotion ? offset : offset}
          className={prefersReducedMotion ? "" : "transition-all duration-1000 ease-out"}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <AnimatedCounter
          value={score}
          className="text-3xl font-bold text-foreground"
        />
        <span className="text-xs text-muted">/ 100</span>
        <span
          className="mt-1 text-sm font-medium"
          style={{ color }}
        >
          {getRiskLabel(riskLevel)}
        </span>
      </div>
    </div>
  );
}
