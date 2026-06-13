"use client";

import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { AnimatedCounter } from "./AnimatedCounter";

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  subtitle?: string;
  delay?: number;
  decimals?: number;
}

function MetricCardComponent({
  label,
  value,
  suffix = "",
  icon: Icon,
  subtitle,
  delay = 0,
  decimals = 0,
}: MetricCardProps) {
  const displayValue = decimals > 0 ? value.toFixed(decimals) : value;

  return (
    <GlassCard delay={delay} className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>
      <p className="text-2xl font-bold text-foreground">
        {decimals > 0 ? (
          displayValue
        ) : (
          <AnimatedCounter value={value} suffix={suffix} />
        )}
        {decimals > 0 && suffix}
      </p>
      {subtitle && <p className="text-xs text-subtle">{subtitle}</p>}
    </GlassCard>
  );
}

export const MetricCard = memo(MetricCardComponent);
