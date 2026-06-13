"use client";

import type { KeyboardEvent } from "react";
import type { MoodLevel } from "@/types/wellness";

const MOODS: { value: MoodLevel; emoji: string; label: string }[] = [
  { value: 1, emoji: "😔", label: "Struggling" },
  { value: 2, emoji: "😟", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
];

const MOOD_MAP = new Map(MOODS.map((m) => [m.value, m]));

export function getMoodDisplay(mood: MoodLevel) {
  return MOOD_MAP.get(mood) ?? MOODS[2];
}

interface MoodPickerProps {
  value: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = (index + 1) % MOODS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = (index - 1 + MOODS.length) % MOODS.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = MOODS.length - 1;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(MOODS[index].value);
      return;
    } else {
      return;
    }
    onChange(MOODS[next].value);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Select your mood level from 1 to 5"
      className="flex flex-wrap justify-center gap-3"
    >
      {MOODS.map((mood, index) => {
        const selected = value === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${mood.label}, level ${mood.value} of 5`}
            tabIndex={selected || (value === null && index === 0) ? 0 : -1}
            onClick={() => onChange(mood.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-light ${
              selected
                ? "glass-strong scale-105 ring-2 ring-primary/30 bg-primary-subtle"
                : "glass-surface hover:bg-surface"
            }`}
          >
            <span className="text-3xl" aria-hidden="true">
              {mood.emoji}
            </span>
            <span className="text-xs text-muted">{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export { MOODS };
