"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface RecommendationCardProps {
  recommendations: string[];
}

export function RecommendationCard({ recommendations }: RecommendationCardProps) {
  return (
    <GlassCard ariaLabel="Personalized recommendations" className="border-l-4 border-l-emerald-400/50">
      <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
        Personalized Recommendations
      </h2>
      <ul className="space-y-3">
        {recommendations.map((rec, i) => (
          <li key={i} className="flex items-start gap-3">
            {i < 2 ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            )}
            <span className="text-sm text-foreground">{rec}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
