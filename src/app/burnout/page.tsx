"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BURNOUT_TIPS } from "@/lib/scoring/burnout";
import { loadChart } from "@/lib/charts/load-chart";

const BurnoutHistoryChart = loadChart(
  () => import("@/components/charts/BurnoutHistoryChart"),
  "BurnoutHistoryChart",
);

function getBurnoutTrendText(history: { date: string; score: number }[]): string | null {
  if (history.length < 2) return null;
  const recent = history[history.length - 1].score;
  const previous = history[history.length - 2].score;
  const diff = previous - recent;
  if (diff > 0) return `down ${Math.abs(diff)}% from last period`;
  if (diff < 0) return `up ${Math.abs(diff)}% from last period`;
  return "unchanged from last period";
}

export default function BurnoutPage() {
  const { burnoutScore, data } = useApp();
  const analytics = data.analytics;
  const displayScore = analytics?.burnoutRiskPercent ?? burnoutScore.score;
  const tips = BURNOUT_TIPS[burnoutScore.riskLevel];
  const trendText = useMemo(
    () => (analytics ? getBurnoutTrendText(analytics.burnoutHistory) : null),
    [analytics],
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Burnout Risk Meter"
        description="Composite score from mood, journals, and triggers."
      />
      <GlassCard className="flex flex-col items-center gap-6 py-8">
        <ErrorBoundary fallbackTitle="Burnout meter unavailable">
          <ProgressRing score={displayScore} riskLevel={burnoutScore.riskLevel} size={200} />
        </ErrorBoundary>
        {analytics && trendText && (
          <p className="text-sm text-muted">
            Current risk: {analytics.burnoutRiskPercent}% — {trendText}
          </p>
        )}
      </GlassCard>
      <GlassCard>
        <ul className="space-y-3">
          {burnoutScore.factors.map((f, i) => (
            <li key={i} className="text-sm text-muted">
              {f}
            </li>
          ))}
        </ul>
      </GlassCard>
      <GlassCard>
        <h2 className="mb-3 font-display text-sm font-semibold text-foreground">Tips</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </GlassCard>
      {analytics && (
        <ErrorBoundary fallbackTitle="Chart unavailable">
          <BurnoutHistoryChart data={analytics.burnoutHistory} />
        </ErrorBoundary>
      )}
    </div>
  );
}
