"use client";

import { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MoodEntry } from "@/types/wellness";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatChartDate, tooltipStyle, CHART_COLORS } from "@/lib/charts/theme";
import { buildMoodChartSummary } from "@/lib/charts/summaries";

interface MoodChartProps {
  moods: MoodEntry[];
  compact?: boolean;
  days?: number;
  trendData?: { date: string; mood: number; label?: string }[];
}

function MoodChartComponent({
  moods,
  compact = false,
  days = 14,
  trendData,
}: MoodChartProps) {
  const source = trendData
    ? trendData.map((d) => ({
        date: formatChartDate(d.date),
        mood: d.mood,
        label: d.label,
      }))
    : [...moods]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-days)
        .map((m) => ({ date: formatChartDate(m.date), mood: m.mood, label: undefined as string | undefined }));

  if (!source.length) {
    return (
      <GlassCard ariaLabel="Mood history chart">
        <p className="py-8 text-center text-sm text-muted">No mood data yet.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard ariaLabel="Mood history chart">
      <div className="sr-only" aria-live="polite">
        {buildMoodChartSummary(
          trendData ?? moods.map((m) => ({ date: m.date, mood: m.mood })),
        )}
      </div>
      <ResponsiveContainer width="100%" height={compact ? 120 : days > 14 ? 280 : 240}>
        <AreaChart data={source} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
              <stop offset="100%" stopColor={CHART_COLORS.primaryDark} stopOpacity={0.04} />
            </linearGradient>
          </defs>
          {!compact && (
            <XAxis
              dataKey="date"
              tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={days > 14 ? 4 : 0}
            />
          )}
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, _name, props) => {
              const label = (props as { payload?: { label?: string } }).payload?.label;
              return [label ? `${value} — ${label}` : `${value}/5`, "Mood"];
            }}
          />
          <Area
            type="monotone"
            dataKey="mood"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            fill="url(#moodGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export const MoodChart = memo(MoodChartComponent);
