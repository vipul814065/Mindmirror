"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useApp } from "@/hooks/useAppStore";
import { GlassCard } from "./GlassCard";

const ENCOURAGEMENTS = [
  "Every hour you study with awareness beats ten hours of anxious grinding.",
  "Your mock scores measure progress, not your potential — keep going.",
  "Rest is part of preparation. You're building something meaningful.",
  "Small consistent steps compound into exam-day confidence.",
  "Acknowledging stress is strength, not weakness. You've got this.",
];

export function MotivationalBanner() {
  const { data, burnoutScore } = useApp();

  const message = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayMood = data.moods.find((m) => m.date === today);
    if (burnoutScore.riskLevel === "high" || burnoutScore.riskLevel === "critical") {
      return "You're pushing hard — remember that recovery is part of winning. Take one guilt-free break today.";
    }
    if (todayMood && todayMood.mood <= 2) {
      return "Tough days happen to every topper. One focused hour today still moves you forward.";
    }
    const idx = new Date().getDate() % ENCOURAGEMENTS.length;
    return ENCOURAGEMENTS[idx];
  }, [data.moods, burnoutScore.riskLevel]);

  return (
    <GlassCard className="!p-4" ariaLabel="Daily motivational encouragement">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="text-xs font-medium text-primary">Motivational Encouragement</p>
          <p className="mt-1 text-sm text-foreground">{message}</p>
        </div>
      </div>
    </GlassCard>
  );
}
