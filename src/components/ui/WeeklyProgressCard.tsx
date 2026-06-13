"use client";

import { BookOpen, Clock, FlaskConical, TrendingDown, TrendingUp } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { AnimatedCounter } from "./AnimatedCounter";
import type { DemoAnalytics } from "@/types/wellness";

interface WeeklyProgressCardProps {
  progress: DemoAnalytics["weeklyProgress"];
}

export function WeeklyProgressCard({ progress }: WeeklyProgressCardProps) {
  const stats = [
    { label: "Study Time", value: progress.studyHours, suffix: " hrs", icon: Clock },
    { label: "Topics Done", value: progress.completedTopics, suffix: "", icon: BookOpen },
    { label: "Mock Tests", value: progress.mockTests, suffix: "", icon: FlaskConical },
    { label: "Stress ↓", value: progress.stressReduction, suffix: "%", icon: TrendingDown },
    { label: "Confidence ↑", value: progress.confidenceGrowth, suffix: "%", icon: TrendingUp },
  ];

  return (
    <GlassCard ariaLabel="Weekly progress">
      <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
        Weekly Progress
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map(({ label, value, suffix, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
            <p className="text-lg font-bold text-foreground">
              <AnimatedCounter value={value} suffix={suffix} />
            </p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
