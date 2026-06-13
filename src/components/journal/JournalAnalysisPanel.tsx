"use client";

import { useState } from "react";
import type { JournalAnalysis } from "@/types/wellness";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { ChevronDown, ChevronUp } from "lucide-react";

const SENTIMENT_VARIANT: Record<
  JournalAnalysis["sentimentLabel"],
  "success" | "warning" | "default"
> = {
  positive: "success",
  neutral: "default",
  negative: "warning",
};

const STRESS_VARIANT: Record<
  JournalAnalysis["stressLevel"],
  "success" | "warning" | "default"
> = {
  Low: "success",
  Medium: "warning",
  High: "default",
};

interface JournalAnalysisPanelProps {
  analysis: JournalAnalysis;
  loading?: boolean;
}

function MetricCell({ label, value, variant }: { label: string; value: string; variant?: "success" | "warning" | "default" }) {
  return (
    <GlassCard className="!p-3">
      <p className="text-xs text-muted">{label}</p>
      {variant ? (
        <GlassBadge variant={variant} className="mt-1">
          {value}
        </GlassBadge>
      ) : (
        <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      )}
    </GlassCard>
  );
}

export function JournalAnalysisPanel({ analysis, loading }: JournalAnalysisPanelProps) {
  const [reasoningOpen, setReasoningOpen] = useState(true);

  if (loading) {
    return (
      <div className="space-y-3 rounded-2xl border-l-4 border-l-primary/40 bg-primary-subtle p-4" aria-busy="true">
        <p className="text-xs font-medium text-primary">AI Analysis</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassSkeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border-l-4 border-l-primary/40 bg-primary-subtle p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-medium text-primary">AI Journal Analysis</p>
        <GlassBadge variant={SENTIMENT_VARIANT[analysis.sentimentLabel]}>
          {analysis.sentimentLabel} mood · {analysis.moodScore}/5
        </GlassBadge>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCell label="Mood Analysis" value={`${analysis.moodScore}/5`} />
        <MetricCell
          label="Stress Level"
          value={analysis.stressLevel}
          variant={STRESS_VARIANT[analysis.stressLevel]}
        />
        <MetricCell label="Burnout Risk" value={`${analysis.burnoutRiskPercent}%`} />
        <MetricCell label="Confidence Score" value={`${analysis.confidenceScore}%`} />
        <MetricCell
          label="Trigger Detection"
          value={analysis.triggers[0] ?? "None detected"}
        />
        <MetricCell label="Recommendation" value={analysis.recommendation.slice(0, 40) + (analysis.recommendation.length > 40 ? "…" : "")} />
      </div>

      <p className="text-sm text-muted">{analysis.triggerSummary}</p>
      <p className="text-sm text-muted">{analysis.reflection}</p>

      {analysis.triggers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {analysis.triggers.map((t) => (
            <GlassBadge key={t} variant="primary">
              {t}
            </GlassBadge>
          ))}
        </div>
      )}

      {analysis.themes.length > 0 && (
        <p className="text-xs text-subtle">Themes: {analysis.themes.join(", ")}</p>
      )}

      <div className="rounded-xl bg-surface px-3 py-2">
        <p className="text-xs font-medium text-primary">Personalized Recommendation</p>
        <p className="mt-1 text-sm text-foreground">{analysis.recommendation}</p>
      </div>

      <div className="rounded-xl bg-surface px-3 py-2">
        <p className="text-xs font-medium text-primary">Coaching tip</p>
        <p className="mt-1 text-sm text-foreground">{analysis.coachingTip}</p>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setReasoningOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl bg-surface px-3 py-2 text-left text-xs font-medium text-primary"
          aria-expanded={reasoningOpen}
        >
          AI Reasoning
          {reasoningOpen ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        {reasoningOpen && (
          <p className="mt-2 text-sm text-foreground" aria-live="polite">
            {analysis.aiReasoning}
          </p>
        )}
      </div>
    </div>
  );
}
