"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightCard } from "@/components/ui/InsightCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { generateWeeklyInsight } from "@/lib/ai/mock-engine";
import { loadChart } from "@/lib/charts/load-chart";

const MoodChart = loadChart(() => import("@/components/charts/MoodChart"), "MoodChart", "h-72");
const BurnoutHistoryChart = loadChart(
  () => import("@/components/charts/BurnoutHistoryChart"),
  "BurnoutHistoryChart",
);
const ConfidenceGrowthChart = loadChart(
  () => import("@/components/charts/ConfidenceGrowthChart"),
  "ConfidenceGrowthChart",
);
const SleepPerformanceChart = loadChart(
  () => import("@/components/charts/SleepPerformanceChart"),
  "SleepPerformanceChart",
);
const ProductivityChart = loadChart(
  () => import("@/components/charts/ProductivityChart"),
  "ProductivityChart",
);
const StudyHeatmapChart = loadChart(
  () => import("@/components/charts/StudyHeatmapChart"),
  "StudyHeatmapChart",
  "h-40",
);
const StressBreakdownChart = loadChart(
  () => import("@/components/charts/StressBreakdownChart"),
  "StressBreakdownChart",
);

export default function AnalyticsPage() {
  const { data } = useApp();
  const analytics = data.analytics;
  const insight = useMemo(
    () => generateWeeklyInsight(data.moods, data.journals, analytics),
    [data.moods, data.journals, analytics],
  );

  if (!analytics) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Analytics"
          description="Load demo data from the dashboard to view analytics."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Analytics Dashboard"
        description={`30-day wellness trends and performance correlations for ${data.settings.userName}.`}
      />

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          30-Day Mood Trend
        </h2>
        <ErrorBoundary fallbackTitle="Chart unavailable">
          <MoodChart moods={data.moods} days={30} trendData={analytics.moodTrend30Day} />
        </ErrorBoundary>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Burnout Risk History
          </h2>
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <BurnoutHistoryChart data={analytics.burnoutHistory} />
          </ErrorBoundary>
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Confidence Growth
          </h2>
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <ConfidenceGrowthChart data={analytics.confidenceGrowth} />
          </ErrorBoundary>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Sleep vs Performance
          </h2>
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <SleepPerformanceChart data={analytics.sleepPerformance} />
          </ErrorBoundary>
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Weekly Productivity Score
          </h2>
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <ProductivityChart data={analytics.weeklyProductivity} />
          </ErrorBoundary>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Study Hours Heatmap
        </h2>
        <ErrorBoundary fallbackTitle="Chart unavailable">
          <StudyHeatmapChart data={analytics.studyHoursHeatmap} />
        </ErrorBoundary>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Stress Trigger Breakdown
          </h2>
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <StressBreakdownChart data={analytics.stressTriggerBreakdown} />
          </ErrorBoundary>
        </div>
        <InsightCard
          patterns={insight.patterns}
          summary="Emotional pattern analysis based on 30 days of mood, journal, and trigger data."
        />
      </div>
    </div>
  );
}
