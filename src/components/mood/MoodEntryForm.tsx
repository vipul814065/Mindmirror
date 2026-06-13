"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { MoodPicker } from "@/components/ui/MoodPicker";
import { TRIGGER_TAGS } from "@/lib/constants/triggers";
import type { MoodLevel, TriggerTag } from "@/types/wellness";

interface MoodEntryFormProps {
  mood: MoodLevel | null;
  note: string;
  selectedTriggers: TriggerTag[];
  onMoodChange: (m: MoodLevel) => void;
  onNoteChange: (note: string) => void;
  onToggleTrigger: (trigger: TriggerTag) => void;
  onSubmit: () => void;
}

export function MoodEntryForm({
  mood,
  note,
  selectedTriggers,
  onMoodChange,
  onNoteChange,
  onToggleTrigger,
  onSubmit,
}: MoodEntryFormProps) {
  return (
    <GlassCard className="mb-6">
      <h2 className="mb-4 text-center font-display text-lg font-semibold text-foreground">
        How are you feeling?
      </h2>
      <MoodPicker value={mood} onChange={onMoodChange} />

      <div className="mt-6">
        <GlassTextarea
          label="Optional note"
          placeholder="What's on your mind?"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
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
              onClick={() => onToggleTrigger(trigger)}
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
        <GlassButton onClick={onSubmit} disabled={!mood}>
          Save Mood
        </GlassButton>
      </div>
    </GlassCard>
  );
}
