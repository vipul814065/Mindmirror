"use client";

import { Flame, Clock } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { AppSettings } from "@/types/wellness";

interface ProfileCardProps {
  name: string;
  examType: string;
  settings?: AppSettings;
}

export function ProfileCard({ name, examType, settings }: ProfileCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <GlassCard className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle font-bold text-primary">
        {initials}
      </div>
      <div className="flex-1">
        <p className="font-display text-lg font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted">
          {settings?.goal ?? examType}
        </p>
        {(settings?.age || settings?.studyHoursPerDay || settings?.streakDays) && (
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
            {settings.age && <span>Age {settings.age}</span>}
            {settings.studyHoursPerDay && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {settings.studyHoursPerDay} hrs/day
              </span>
            )}
            {settings.streakDays && (
              <span className="flex items-center gap-1 text-amber-600">
                <Flame className="h-3 w-3" aria-hidden="true" />
                {settings.streakDays}-day streak
              </span>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
