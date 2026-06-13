"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { NotificationList } from "@/components/ui/NotificationList";
import { InsightCard } from "@/components/ui/InsightCard";
import { HeroInsightCard } from "@/components/ui/HeroInsightCard";
import { CompetitionPitchPanel } from "@/components/ui/CompetitionPitchPanel";
import { ChallengeRequirementsCoverage } from "@/components/ui/ChallengeRequirementsCoverage";
import { MotivationalBanner } from "@/components/ui/MotivationalBanner";
import { DashboardFeatureHighlights } from "@/components/dashboard/DashboardFeatureHighlights";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardQuickLinks } from "@/components/dashboard/DashboardQuickLinks";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardAcademicWellbeing } from "@/components/dashboard/DashboardAcademicWellbeing";
import { useWeeklyInsight } from "@/hooks/useWeeklyInsight";
import { EXAM_TYPES } from "@/lib/constants/exams";

export default function DashboardPage() {
  const { data, updateSettings, storageError, loadSampleData } = useApp();
  const analytics = data.analytics;
  const { insight, heroQuote } = useWeeklyInsight();
  const h = new Date().getHours();
  const greet = useMemo(
    () => (h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"),
    [h],
  );

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
      <ChallengeRequirementsCoverage />
      <MotivationalBanner />
      <HeroInsightCard quote={heroQuote} />
      <DashboardFeatureHighlights />

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

      <DashboardMetrics analytics={analytics} />
      <DashboardAcademicWellbeing />
      <DashboardQuickLinks />
      <DashboardCharts moods={data.moods} analytics={analytics} />

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
