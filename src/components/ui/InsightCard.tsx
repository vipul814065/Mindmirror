"use client";
import { Sparkles } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface InsightCardProps {
  patterns: string[];
  summary?: string;
  heroQuote?: string;
  delay?: number;
}

export function InsightCard({
  patterns,
  summary,
  heroQuote,
  delay = 0,
}: InsightCardProps) {
  const displayPatterns = heroQuote
    ? patterns.filter((p) => p !== heroQuote)
    : patterns;

  return (
    <GlassCard
      delay={delay}
      ariaLabel="Weekly emotional insight"
      className="border-l-4 border-l-primary/40"
    >
      {heroQuote && (
        <p className="mb-4 font-display text-base font-semibold leading-relaxed text-foreground">
          {heroQuote}
        </p>
      )}
      {summary && <p className="mb-4 text-sm leading-relaxed text-muted">{summary}</p>}
      <ul className="space-y-3" aria-live="polite">
        {displayPatterns.map((pattern, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-2xl bg-primary-subtle px-4 py-3"
          >
            <Sparkles
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="text-sm text-foreground">{pattern}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
