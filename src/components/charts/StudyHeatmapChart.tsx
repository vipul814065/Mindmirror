"use client";

import { memo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatShortDate } from "@/lib/charts/theme";
import { buildHeatmapSummary } from "@/lib/charts/summaries";

interface StudyHeatmapChartProps {
  data: { date: string; hours: number }[];
}

function getIntensity(hours: number): string {
  if (hours >= 8.5) return "bg-primary";
  if (hours >= 7.5) return "bg-primary/80";
  if (hours >= 6.5) return "bg-primary/60";
  if (hours >= 5.5) return "bg-primary/40";
  return "bg-primary/20";
}

function StudyHeatmapChartComponent({ data }: StudyHeatmapChartProps) {
  if (!data.length) {
    return (
      <GlassCard ariaLabel="Study hours heatmap">
        <p className="py-8 text-center text-sm text-muted">No study data yet.</p>
      </GlassCard>
    );
  }

  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const weeks: { date: string; hours: number }[][] = [];
  for (let i = 0; i < sorted.length; i += 7) {
    weeks.push(sorted.slice(i, i + 7));
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <GlassCard ariaLabel="Study hours heatmap">
      <div className="sr-only">{buildHeatmapSummary(data)}</div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Study Hours — Last 30 Days</p>
        <div className="flex items-center gap-1 text-xs text-muted">
          <span>Less</span>
          {["bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary/80", "bg-primary"].map(
            (c) => (
              <span key={c} className={`h-3 w-3 rounded-sm ${c}`} />
            ),
          )}
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          <div className="flex flex-col gap-1 pr-2 pt-5">
            {dayLabels.map((d) => (
              <span key={d} className="flex h-4 items-center text-[10px] text-muted">
                {d}
              </span>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              <span className="h-4 text-center text-[10px] text-muted">
                {week[0] ? formatShortDate(week[0].date) : ""}
              </span>
              {dayLabels.map((_, di) => {
                const entry = week.find(
                  (e) => new Date(e.date).getDay() === di,
                );
                return (
                  <button
                    key={di}
                    type="button"
                    disabled={!entry}
                    aria-label={
                      entry
                        ? `${formatShortDate(entry.date)}: ${entry.hours} study hours`
                        : `${dayLabels[di]}: no data`
                    }
                    className={`h-4 w-4 rounded-sm ${entry ? getIntensity(entry.hours) : "bg-surface"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        Avg {Math.round((sorted.reduce((s, d) => s + d.hours, 0) / sorted.length) * 10) / 10} hrs/day
      </p>
    </GlassCard>
  );
}

export const StudyHeatmapChart = memo(StudyHeatmapChartComponent);
