"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { WeeklyProgressCard } from "@/components/ui/WeeklyProgressCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { NotificationList } from "@/components/ui/NotificationList";
import { RecommendationCard } from "@/components/ui/RecommendationCard";
import { InsightCard } from "@/components/ui/InsightCard";
import { HeroInsightCard } from "@/components/ui/HeroInsightCard";
import { CompetitionPitchPanel } from "@/components/ui/CompetitionPitchPanel";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { generateWeeklyInsight, getHeroInsightQuote } from "@/lib/ai/mock-engine";
import { getMoodDisplay } from "@/components/ui/MoodPicker";
import { EXAM_TYPES } from "@/lib/constants/exams";
import { loadChart } from "@/lib/charts/load-chart";
import {
  Smile,
  BookOpen,
  MessageCircle,
  Heart,
  Flame,
  Focus,
  Moon,
  Shield,
  BarChart3,
} from "lucide-react";

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

export default function DashboardPage() {
  const { data, burnoutScore, loadSampleData, updateSettings, storageError } = useApp();
  const analytics = data.analytics;
  const today = new Date().toISOString().split("T")[0];
  const todayMood = data.moods.find((m) => m.date === today);
  const insight = useMemo(
    () => generateWeeklyInsight(data.moods, data.journals, analytics),
    [data.moods, data.journals, analytics],
  );
  const heroQuote = useMemo(
    () => getHeroInsightQuote(data.moods, data.journals, analytics),
    [data.moods, data.journals, analytics],
  );
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const todayMoodDisplay = todayMood ? getMoodDisplay(todayMood.mood) : null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title={`${greet}, ${data.settings.userName}`}
        description={data.settings.goal ?? `Preparing for ${data.settings.examType}`}
      />

      {storageError && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {storageError}
        </div>
      )}

      <CompetitionPitchPanel onLoadSample={loadSampleData} />

      <HeroInsightCard quote={heroQuote} />

      <ProfileCard
        name={data.settings.userName}
        examType={data.settings.examType}
        settings={data.settings}
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Exam type">
        {EXAM_TYPES.map((e) => (
          <button
            key={e}
            type="button"
            aria-pressed={data.settings.examType === e}
            onClick={() => updateSettings({ examType: e })}
          >
            <GlassBadge variant={data.settings.examType === e ? "primary" : "default"}>
              {e}
            </GlassBadge>
          </button>
        ))}
      </div>

      {analytics ? (
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
      ) : (
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
      )}

      <div className="grid gap-3 sm:grid-cols-4">
        <Link
          href="/mood"
          className="glass-surface inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          <Smile className="h-4 w-4" aria-hidden="true" />
          Mood
        </Link>
        <Link
          href="/journal"
          className="glass-surface inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Journal
        </Link>
        <Link
          href="/coach"
          className="glass-surface inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Coach
        </Link>
        <Link
          href="/analytics"
          className="glass-surface inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          <BarChart3 className="h-4 w-4" aria-hidden="true" />
          Analytics
        </Link>
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          30-Day Mood Trend
        </h2>
        <ErrorBoundary fallbackTitle="Chart unavailable">
          <MoodChart
            moods={data.moods}
            days={30}
            trendData={analytics?.moodTrend30Day}
          />
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

      <InsightCard
        patterns={insight.patterns.slice(0, 4)}
        summary={insight.summary}
        heroQuote={heroQuote}
      />

      {analytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityFeed items={analytics.activityFeed} />
          <NotificationList items={analytics.notifications} />
        </div>
      )}
    </div>
  );
}
