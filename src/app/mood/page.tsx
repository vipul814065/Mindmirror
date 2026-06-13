"use client";

import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MoodEntryForm } from "@/components/mood/MoodEntryForm";
import { MoodHistoryList } from "@/components/mood/MoodHistoryList";
import { loadChart } from "@/lib/charts/load-chart";
import type { MoodLevel, TriggerTag } from "@/types/wellness";

const MoodChart = loadChart(() => import("@/components/charts/MoodChart"), "MoodChart");

export default function MoodPage() {
  const { data, addMood, validationError } = useApp();
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerTag[]>([]);
  const [saved, setSaved] = useState(false);

  const toggleTrigger = (trigger: TriggerTag) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger],
    );
  };

  const handleSubmit = () => {
    if (!mood) return;
    addMood({
      date: new Date().toISOString().split("T")[0],
      mood,
      note: note.trim() || undefined,
      triggers: selectedTriggers,
    });
    setSaved(true);
    setMood(null);
    setNote("");
    setSelectedTriggers([]);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Mood Tracking"
        description="Log how you feel today. Patterns emerge over time."
      />

      {saved && (
        <div
          className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
          aria-live="polite"
        >
          Mood saved successfully!
        </div>
      )}

      {validationError && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {validationError}
        </div>
      )}

      <MoodEntryForm
        mood={mood}
        note={note}
        selectedTriggers={selectedTriggers}
        onMoodChange={setMood}
        onNoteChange={setNote}
        onToggleTrigger={toggleTrigger}
        onSubmit={handleSubmit}
      />

      <h2 className="mb-3 font-display text-lg font-semibold text-foreground">30-Day Mood History</h2>
      <ErrorBoundary fallbackTitle="Chart unavailable">
        <MoodChart moods={data.moods} days={30} trendData={data.analytics?.moodTrend30Day} />
      </ErrorBoundary>

      <MoodHistoryList moods={data.moods} />
    </div>
  );
}
