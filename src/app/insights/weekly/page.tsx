"use client";

import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/ui/InsightCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { WeeklyProgressCard } from "@/components/ui/WeeklyProgressCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { loadChart } from "@/lib/charts/load-chart";
import { HeroInsightCard } from "@/components/ui/HeroInsightCard";
import { useWeeklyInsight } from "@/hooks/useWeeklyInsight";
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
  const { insight, heroQuote } = useWeeklyInsight();
  const trend = TREND_CONFIG[insight.moodTrend];
  const TrendIcon = trend.icon;
  const aiInsights = analytics?.aiInsights ?? insight.patterns;

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

      {!analytics && (
        <GlassCard>
          <p className="text-sm text-subtle">
            Load sample data on the dashboard for full analytics charts, or keep logging mood and
            journal entries for AI-generated insights below.
          </p>
        </GlassCard>
      )}

      <HeroInsightCard quote={heroQuote} />

      <section aria-labelledby="hyper-insights-heading">
        <h2
          id="hyper-insights-heading"
          className="mb-4 font-display text-lg font-semibold text-foreground"
        >
          Hyper-Personalized AI Insights
        </h2>
        <GlassCard className="space-y-3">
          {aiInsights.map((item) => (
            <p key={item} className="text-sm text-foreground">
              {item}
            </p>
          ))}
        </GlassCard>
      </section>

      <InsightCard patterns={insight.patterns} summary={insight.summary} heroQuote={heroQuote} />

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
