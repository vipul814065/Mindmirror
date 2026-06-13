"use client";

import { Sparkles } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface HeroInsightCardProps {
  quote: string;
  delay?: number;
}

export function HeroInsightCard({ quote, delay = 0 }: HeroInsightCardProps) {
  return (
    <GlassCard
      delay={delay}
      ariaLabel="Signature AI insight"
      className="border-l-4 border-l-primary bg-gradient-to-r from-primary-subtle/80 to-transparent"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            AI Insight
          </p>
          <p className="mt-2 font-display text-lg font-semibold leading-relaxed text-foreground">
            {quote}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
