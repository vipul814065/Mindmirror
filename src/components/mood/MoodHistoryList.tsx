import { GlassCard } from "@/components/ui/GlassCard";
import { getMoodDisplay } from "@/components/ui/MoodPicker";
import type { MoodEntry } from "@/types/wellness";

interface MoodHistoryListProps {
  moods: MoodEntry[];
}

export function MoodHistoryList({ moods }: MoodHistoryListProps) {
  if (moods.length === 0) return null;

  const recent = [...moods]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-sm font-medium text-muted">Recent Entries</h3>
      {recent.map((entry) => {
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
            {entry.note && <p className="mt-2 text-sm text-muted">{entry.note}</p>}
          </GlassCard>
        );
      })}
    </div>
  );
}
