"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/useAppStore";
import { generateWeeklyInsight, getHeroInsightQuote } from "@/lib/ai/mock-engine";

export function useWeeklyInsight() {
  const { data } = useApp();
  const analytics = data.analytics;

  const insight = useMemo(
    () => generateWeeklyInsight(data.moods, data.journals, analytics),
    [data.moods, data.journals, analytics],
  );

  const heroQuote = useMemo(
    () => getHeroInsightQuote(data.moods, data.journals, analytics),
    [data.moods, data.journals, analytics],
  );

  return { insight, heroQuote };
}
