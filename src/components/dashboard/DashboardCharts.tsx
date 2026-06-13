"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RecommendationCard } from "@/components/ui/RecommendationCard";
import { loadChart } from "@/lib/charts/load-chart";
import type { DemoAnalytics, MoodEntry } from "@/types/wellness";

const MoodChart = loadChart(
  () => import("@/components/charts/MoodChart"),
  "MoodChart",
  "h-72",
);
const StressBreakdownChart = loadChart(
  () => import("@/components/charts/StressBreakdownChart"),
  "StressBreakdownChart",
  "h-60",
);

interface DashboardChartsProps {
  moods: MoodEntry[];
  analytics?: DemoAnalytics;
}

export function DashboardCharts({ moods, analytics }: DashboardChartsProps) {
  return (
    <>
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          30-Day Mood Trend
        </h2>
        <ErrorBoundary fallbackTitle="Chart unavailable">
          <MoodChart moods={moods} days={30} trendData={analytics?.moodTrend30Day} />
        </ErrorBoundary>
      </div>

      {analytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <StressBreakdownChart data={analytics.stressTriggerBreakdown} compact />
          </ErrorBoundary>
          <RecommendationCard recommendations={analytics.recommendations} />
        </div>
      )}
    </>
  );
}
