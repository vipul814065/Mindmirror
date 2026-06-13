"use client";

import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/ui/InsightCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { generateWeeklyInsight } from "@/lib/ai/mock-engine";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const TREND_CONFIG = {
  improving: { icon: TrendingUp, color: "text-emerald-400", label: "Improving" },
  stable: { icon: Minus, color: "text-amber-400", label: "Stable" },
  declining: { icon: TrendingDown, color: "text-red-400", label: "Declining" },
};

export default function WeeklyInsightsPage() {
  const { data } = useApp();
  const insight = generateWeeklyInsight(data.moods, data.journals);
  const trend = TREND_CONFIG[insight.moodTrend];
  const TrendIcon = trend.icon;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Weekly Emotional Insights"
        description="AI-detected patterns from your mood and journal data."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <GlassCard>
          <p className="text-sm text-muted">Average Mood</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {insight.avgMood.toFixed(1)}
            <span className="text-lg text-subtle">/5</span>
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-muted">Weekly Trend</p>
          <div className="mt-1 flex items-center gap-2">
            <TrendIcon className={`h-6 w-6 ${trend.color}`} aria-hidden="true" />
            <span className={`text-xl font-bold ${trend.color}`}>{trend.label}</span>
          </div>
        </GlassCard>
      </div>

      <InsightCard
        patterns={insight.patterns}
        summary={insight.summary}
      />

      <GlassCard className="mt-6">
        <h2 className="mb-3 font-display text-sm font-semibold text-foreground">
          Export Summary
        </h2>
        <pre className="whitespace-pre-wrap rounded-xl bg-surface p-4 text-xs leading-relaxed text-muted">
          {`MindMirror Weekly Report (${insight.weekStart})
Average Mood: ${insight.avgMood.toFixed(1)}/5
Trend: ${insight.moodTrend}

${insight.summary}

Patterns:
${insight.patterns.map((p) => `• ${p}`).join("\n")}`}
        </pre>
      </GlassCard>
    </div>
  );
}
