"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { detectTriggerPatterns } from "@/lib/ai/mock-engine";
import { loadChart } from "@/lib/charts/load-chart";
import { Zap } from "lucide-react";

const TriggerChart = loadChart(
  () => import("@/components/charts/TriggerChart"),
  "TriggerChart",
);
const StressBreakdownChart = loadChart(
  () => import("@/components/charts/StressBreakdownChart"),
  "StressBreakdownChart",
);

const CONFIDENCE_STYLES = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-surface text-subtle",
};

export default function TriggersPage() {
  const { data } = useApp();
  const analytics = data.analytics;
  const patterns = useMemo(
    () => detectTriggerPatterns(data.moods, data.journals),
    [data.moods, data.journals],
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Stress Trigger Detection"
        description="Automatically identified from your moods and journal entries."
      />

      {analytics && (
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Stress Trigger Breakdown
          </h2>
          <ErrorBoundary fallbackTitle="Chart unavailable">
            <StressBreakdownChart data={analytics.stressTriggerBreakdown} />
          </ErrorBoundary>
        </div>
      )}

      <ErrorBoundary fallbackTitle="Chart unavailable">
        <TriggerChart patterns={patterns} />
      </ErrorBoundary>

      <h2 className="font-display text-lg font-semibold text-foreground">Detected Patterns</h2>

      {patterns.length === 0 ? (
        <GlassCard>
          <p className="py-6 text-center text-sm text-subtle">
            No stress triggers detected yet. Keep tracking to unlock insights.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {patterns.map((pattern, i) => (
            <GlassCard key={pattern.trigger} className="!p-4" delay={i * 0.05}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{pattern.trigger}</p>
                    <p className="mt-1 text-sm text-muted">{pattern.description}</p>
                    <p className="mt-1 text-xs text-subtle">
                      {pattern.count} occurrence{pattern.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${CONFIDENCE_STYLES[pattern.confidence]}`}
                >
                  {pattern.confidence}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
