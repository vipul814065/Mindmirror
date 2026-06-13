"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getAdaptiveExercises, getAllExercises } from "@/lib/ai/mindfulness-exercises";
import { calculateBurnoutScore, getTopTriggers } from "@/lib/scoring/burnout";

export default function MindfulnessPage() {
  const { data } = useApp();
  const burnout = useMemo(
    () => calculateBurnoutScore(data.moods, data.journals),
    [data.moods, data.journals],
  );
  const triggers = useMemo(
    () => getTopTriggers(data.moods, data.journals),
    [data.moods, data.journals],
  );
  const adaptive = useMemo(
    () => getAdaptiveExercises(triggers, burnout.score),
    [triggers, burnout.score],
  );
  const all = getAllExercises();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Adaptive Mindfulness Exercises"
        description="AI-selected exercises based on your mood, triggers, and burnout risk."
      />

      <ErrorBoundary fallbackTitle="Exercises unavailable">
        <section aria-labelledby="adaptive-exercises-heading">
          <h2
            id="adaptive-exercises-heading"
            className="mb-4 font-display text-lg font-semibold text-foreground"
          >
            Recommended for You
          </h2>
          {adaptive.length === 0 ? (
            <GlassCard>
              <p className="py-6 text-center text-sm text-subtle">
                Log mood or journal entries to unlock personalized mindfulness exercises.
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {adaptive.map((ex) => (
                <GlassCard key={ex.id} className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{ex.title}</h3>
                    <GlassBadge variant="primary">{ex.category}</GlassBadge>
                    <GlassBadge>{ex.durationMinutes} min</GlassBadge>
                  </div>
                  <p className="text-sm text-muted">{ex.description}</p>
                  <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground">
                    {ex.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="all-exercises-heading">
          <h2
            id="all-exercises-heading"
            className="mb-4 font-display text-lg font-semibold text-foreground"
          >
            All Exercises
          </h2>
          <div className="space-y-4">
            {all.map((ex) => (
              <GlassCard key={ex.id} className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{ex.title}</h3>
                  <GlassBadge>{ex.durationMinutes} min</GlassBadge>
                </div>
                <p className="text-xs text-muted">{ex.description}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </ErrorBoundary>
    </div>
  );
}
