"use client";

import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TriggerPattern } from "@/types/wellness";
import { GlassCard } from "@/components/ui/GlassCard";
import { buildTriggerPatternsSummary } from "@/lib/charts/summaries";

interface TriggerChartProps {
  patterns: TriggerPattern[];
}

function TriggerChartComponent({ patterns }: TriggerChartProps) {
  const data = patterns.slice(0, 6).map((p) => ({
    name: p.trigger.length > 12 ? p.trigger.slice(0, 12) + "…" : p.trigger,
    count: p.count,
    fullName: p.trigger,
  }));

  if (data.length === 0) {
    return (
      <GlassCard ariaLabel="Stress trigger frequency chart">
        <p className="py-8 text-center text-sm text-muted">
          No triggers detected yet. Log moods and journals to identify patterns.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard ariaLabel="Stress trigger frequency chart">
      <div className="sr-only">{buildTriggerPatternsSummary(patterns)}</div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "16px",
              color: "#0F0F12",
            }}
            formatter={(value, _name, props) => [
              `${value} occurrences`,
              (props as { payload?: { fullName: string } }).payload?.fullName,
            ]}
          />
          <Bar dataKey="count" fill="#A855F7" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export const TriggerChart = memo(TriggerChartComponent);
