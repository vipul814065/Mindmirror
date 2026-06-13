"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { WeeklyProgressCard } from "@/components/ui/WeeklyProgressCard";
import { generateWeeklyInsight } from "@/lib/ai/mock-engine";

export function DashboardAcademicWellbeing() {
  const { data } = useApp();
  const analytics = data.analytics;
  const insight = useMemo(
    () => generateWeeklyInsight(data.moods, data.journals, analytics),
    [data.moods, data.journals, analytics],
  );

  return (
    <section aria-labelledby="academic-wellbeing-heading">
      <h2
        id="academic-wellbeing-heading"
        className="mb-4 font-display text-lg font-semibold text-foreground"
      >
        Academic Wellbeing Tracking
      </h2>
      {analytics ? (
        <WeeklyProgressCard progress={analytics.weeklyProgress} />
      ) : (
        <GlassCard>
          <p className="text-sm text-muted">Weekly summary from your data</p>
          <p className="mt-2 text-sm text-foreground">{insight.summary}</p>
          {insight.patterns.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground">
              {insight.patterns.slice(0, 3).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </GlassCard>
      )}
    </section>
  );
}
