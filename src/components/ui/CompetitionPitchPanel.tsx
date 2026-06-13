"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Play, Trophy } from "lucide-react";
import { useApp } from "@/hooks/useAppStore";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { PitchWalkthroughModal } from "./PitchWalkthroughModal";
import { PITCH_STEPS, detectPitchStepStatus } from "@/lib/pitch/pitch-steps";

interface CompetitionPitchPanelProps {
  onLoadSample: () => void;
}

export function CompetitionPitchPanel({ onLoadSample }: CompetitionPitchPanelProps) {
  const { data, pitchCompletedSteps } = useApp();
  const [expanded, setExpanded] = useState(true);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  const autoStatus = useMemo(() => detectPitchStepStatus(data), [data]);

  const completedCount = PITCH_STEPS.filter(
    (step) => autoStatus[step.id] || pitchCompletedSteps.includes(step.id),
  ).length;

  return (
    <>
      <GlassCard ariaLabel="Competition pitch checklist" className="!p-5 md:!p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Trophy className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                PromptWars Competition Pitch
              </h2>
              <p className="mt-1 text-sm text-muted">
                {completedCount}/{PITCH_STEPS.length} requirements demonstrated
                · Demo AI engine (production-ready interface)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <GlassButton variant="outline" size="sm" onClick={onLoadSample}>
              Load Sample Week
            </GlassButton>
            <GlassButton size="sm" onClick={() => setWalkthroughOpen(true)}>
              <Play className="h-4 w-4" aria-hidden="true" />
              Start guided pitch
            </GlassButton>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="rounded-2xl px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse checklist" : "Expand checklist"}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <ul className="mt-5 space-y-2" aria-label="Challenge requirements checklist">
            {PITCH_STEPS.map((step) => {
              const done = autoStatus[step.id] || pitchCompletedSteps.includes(step.id);
              return (
                <li
                  key={step.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-surface/60 px-4 py-3"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {done ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{step.label}</p>
                      <p className="text-xs text-muted">{step.requirement}</p>
                    </div>
                  </div>
                  <Link
                    href={step.href}
                    className="shrink-0 text-xs font-medium text-primary hover:underline"
                  >
                    Show me
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </GlassCard>

      <PitchWalkthroughModal
        key={walkthroughOpen ? "open" : "closed"}
        open={walkthroughOpen}
        onClose={() => setWalkthroughOpen(false)}
        onLoadSample={onLoadSample}
      />
    </>
  );
}
