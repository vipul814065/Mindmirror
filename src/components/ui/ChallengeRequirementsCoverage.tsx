"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { useApp } from "@/hooks/useAppStore";
import { GlassCard } from "./GlassCard";
import {
  CHALLENGE_REQUIREMENTS,
  detectChallengeRequirementStatus,
} from "@/lib/pitch/challenge-requirements";

export function ChallengeRequirementsCoverage() {
  const { data } = useApp();
  const status = useMemo(() => detectChallengeRequirementStatus(data), [data]);
  const completedCount = CHALLENGE_REQUIREMENTS.filter((r) => status[r.id]).length;

  return (
    <GlassCard ariaLabel="Challenge requirements coverage" className="!p-5 md:!p-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Challenge Requirements Coverage
          </h2>
          <p className="mt-1 text-sm text-muted">
            {completedCount}/{CHALLENGE_REQUIREMENTS.length} requirements demonstrated
            · AI-powered wellness companion for exam prep
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-2" aria-label="Challenge requirements checklist">
        {CHALLENGE_REQUIREMENTS.map((req) => {
          const done = status[req.id];
          return (
            <li
              key={req.id}
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
                  <p className="text-sm font-medium text-foreground">{req.label}</p>
                  <p className="text-xs text-muted">{req.evidence}</p>
                </div>
              </div>
              <Link
                href={req.href}
                className="shrink-0 text-xs font-medium text-primary hover:underline"
              >
                Show me
              </Link>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
