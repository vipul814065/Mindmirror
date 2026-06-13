"use client";

import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function PlanPage() {
  const { data, toggleActionItem, regenerateActionPlan } = useApp();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Action Plan" description="Steps based on your wellness data.">
        <GlassButton variant="outline" size="sm" onClick={regenerateActionPlan}>
          Regenerate
        </GlassButton>
      </PageHeader>

      <ErrorBoundary fallbackTitle="Action plan unavailable">
        {data.actionPlan.length === 0 ? (
          <GlassCard className="space-y-4 text-center">
            <p className="py-6 text-subtle">
              No plan yet. Generate personalized steps based on your mood and journal data.
            </p>
            <GlassButton onClick={regenerateActionPlan}>Generate Plan</GlassButton>
          </GlassCard>
        ) : (
          data.actionPlan.map((item) => (
            <GlassCard key={item.id} className="!p-4">
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleActionItem(item.id)}
                  className="mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
                />
                <span
                  className={
                    item.completed ? "text-subtle line-through" : "text-foreground"
                  }
                >
                  {item.title}
                </span>
              </label>
            </GlassCard>
          ))
        )}
      </ErrorBoundary>
    </div>
  );
}
