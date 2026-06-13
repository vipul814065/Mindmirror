"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/ui/InsightCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { WeeklyProgressCard } from "@/components/ui/WeeklyProgressCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { generateWeeklyInsight } from "@/lib/ai/mock-engine";
import { loadChart } from "@/lib/charts/load-chart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ProductivityChart = loadChart(
  () => import("@/components/charts/ProductivityChart"),
  "ProductivityChart",
);
const ConfidenceGrowthChart = loadChart(
  () => import("@/components/charts/ConfidenceGrowthChart"),
  "ConfidenceGrowthChart",
);

const TREND_CONFIG = {
  improving: { icon: TrendingUp, color: "text-emerald-700", label: "Improving" },
  stable: { icon: Minus, color: "text-amber-700", label: "Stable" },
  declining: { icon: TrendingDown, color: "text-red-700", label: "Declining" },
};

export default function WeeklyInsightsPage() {
  const { data } = useApp();
  const analytics = data.analytics;
  const insight = useMemo(
    () => generateWeeklyInsight(data.moods, data.journals, analytics),
    [data.moods, data.journals, analytics],
  );
  const trend = TREND_CONFIG[insight.moodTrend];
  const TrendIcon = trend.icon;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Weekly Emotional Insights"
        description="AI-detected patterns from your mood and journal data."
      />

      <div className="grid gap-4 sm:grid-cols-2">
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

      {analytics && <WeeklyProgressCard progress={analytics.weeklyProgress} />}

      <InsightCard patterns={insight.patterns} summary={insight.summary} />

      {analytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <ProductivityChart data={analytics.weeklyProductivity} />
          </ErrorBoundary>
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <ConfidenceGrowthChart data={analytics.confidenceGrowth} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
