"use client";

import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { MoodPicker, getMoodDisplay } from "@/components/ui/MoodPicker";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { loadChart } from "@/lib/charts/load-chart";
import { TRIGGER_TAGS } from "@/lib/constants/triggers";
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
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger],
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

      <GlassCard className="mb-6">
        <h2 className="mb-4 text-center font-display text-lg font-semibold text-foreground">
          How are you feeling?
        </h2>
        <MoodPicker value={mood} onChange={setMood} />

        <div className="mt-6">
          <GlassTextarea
            label="Optional note"
            placeholder="What's on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
          />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-muted">Stress triggers (optional)</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Stress trigger tags">
            {TRIGGER_TAGS.map((trigger) => (
              <button
                key={trigger}
                type="button"
                onClick={() => toggleTrigger(trigger)}
                aria-pressed={selectedTriggers.includes(trigger)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
                  selectedTriggers.includes(trigger)
                    ? "bg-primary text-white"
                    : "bg-surface text-muted hover:bg-primary-subtle"
                }`}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <GlassButton onClick={handleSubmit} disabled={!mood}>
            Save Mood
          </GlassButton>
        </div>
      </GlassCard>

      <h2 className="mb-3 font-display text-lg font-semibold text-foreground">30-Day Mood History</h2>
      <ErrorBoundary fallbackTitle="Chart unavailable">
        <MoodChart
          moods={data.moods}
          days={30}
          trendData={data.analytics?.moodTrend30Day}
        />
      </ErrorBoundary>

      {data.moods.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-medium text-muted">Recent Entries</h3>
          {[...data.moods]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((entry) => {
              const display = getMoodDisplay(entry.mood);
              return (
                <GlassCard key={entry.id} className="!p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">
                        {display.emoji}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{display.label}</p>
                        <p className="text-xs text-subtle">{entry.date}</p>
                      </div>
                    </div>
                    {entry.triggers.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.triggers.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {entry.note && (
                    <p className="mt-2 text-sm text-muted">{entry.note}</p>
                  )}
                </GlassCard>
              );
            })}
        </div>
      )}
    </div>
  );
}
