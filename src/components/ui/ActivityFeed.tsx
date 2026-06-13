"use client";

import { BookOpen, MessageCircle, Smile, Sparkles, Target, Trophy } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { DemoActivity } from "@/types/wellness";

const TYPE_ICONS: Record<string, typeof Smile> = {
  mood: Smile,
  journal: BookOpen,
  study: BookOpen,
  coach: MessageCircle,
  mock: Target,
  plan: Sparkles,
  milestone: Trophy,
};

interface ActivityFeedProps {
  items: DemoActivity[];
  limit?: number;
}

export function ActivityFeed({ items, limit = 8 }: ActivityFeedProps) {
  const shown = items.slice(0, limit);

  return (
    <GlassCard ariaLabel="Activity feed">
      <h2 className="mb-4 font-display text-sm font-semibold text-foreground">
        Recent Activity
      </h2>
      {shown.length === 0 ? (
        <p className="py-4 text-center text-sm text-subtle">No activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? Sparkles;
            return (
              <li key={item.id} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{item.message}</p>
                  <p className="text-xs text-subtle">{item.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
