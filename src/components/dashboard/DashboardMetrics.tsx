"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { WeeklyProgressCard } from "@/components/ui/WeeklyProgressCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getMoodDisplay } from "@/components/ui/MoodPicker";
import { generateWeeklyInsight } from "@/lib/ai/mock-engine";
import { Heart, Flame, Focus, Moon, Shield } from "lucide-react";
import type { DemoAnalytics } from "@/types/wellness";

interface DashboardMetricsProps {
  analytics?: DemoAnalytics;
}

export function DashboardMetrics({ analytics }: DashboardMetricsProps) {
  const { data, burnoutScore } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const todayMood = data.moods.find((m) => m.date === today);
  const todayMoodDisplay = todayMood ? getMoodDisplay(todayMood.mood) : null;
  const insight = useMemo(
    () => generateWeeklyInsight(data.moods, data.journals, analytics),
    [data.moods, data.journals, analytics],
  );

  if (analytics) {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="Wellness Score" value={analytics.wellnessScore} suffix="/100" icon={Heart} delay={0} />
          <MetricCard label="Burnout Risk" value={analytics.burnoutRiskPercent} suffix="%" icon={Flame} delay={0.05} />
          <MetricCard label="Focus Score" value={analytics.focusScore} suffix="%" icon={Focus} delay={0.1} />
          <GlassCard delay={0.15} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">Stress Level</p>
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.stressLevel}</p>
            <p className="text-xs text-subtle">Based on 30-day patterns</p>
          </GlassCard>
          <MetricCard label="Sleep Quality" value={analytics.sleepQuality} suffix="/10" icon={Moon} delay={0.2} decimals={1} />
          <MetricCard label="Confidence" value={analytics.confidenceScore} suffix="%" icon={Shield} delay={0.25} />
        </div>
        <WeeklyProgressCard progress={analytics.weeklyProgress} />
      </>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <GlassCard className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted">Burnout</p>
        <ErrorBoundary fallbackTitle="Unavailable">
          <ProgressRing score={burnoutScore.score} riskLevel={burnoutScore.riskLevel} size={140} />
        </ErrorBoundary>
      </GlassCard>
      <GlassCard>
        <p className="mb-2 text-sm text-muted">Today</p>
        {todayMoodDisplay ? (
          <p className="text-2xl">
            {todayMoodDisplay.emoji}{" "}
            <span className="text-lg text-foreground">{todayMoodDisplay.label}</span>
          </p>
        ) : (
          <p className="text-subtle">Not logged</p>
        )}
      </GlassCard>
      <GlassCard>
        <p className="mb-2 text-sm text-muted">Insight</p>
        <p className="text-sm text-foreground">{insight.patterns[0]}</p>
      </GlassCard>
    </div>
  );
}
