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
import { GlassCard } from "@/components/ui/GlassCard";
import { formatShortDate, tooltipStyle, CHART_COLORS } from "@/lib/charts/theme";
import { buildConfidenceSummary } from "@/lib/charts/summaries";

interface ConfidenceGrowthChartProps {
  data: { date: string; score: number }[];
}

function ConfidenceGrowthChartComponent({ data }: ConfidenceGrowthChartProps) {
  const chartData = data.map((d) => ({
    date: formatShortDate(d.date),
    score: d.score,
  }));

  if (!chartData.length) {
    return (
      <GlassCard ariaLabel="Confidence growth">
        <p className="py-8 text-center text-sm text-muted">No confidence data yet.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard ariaLabel="Confidence growth">
      <div className="sr-only">{buildConfidenceSummary(data)}</div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.success} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_COLORS.success} stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={6}
          />
          <YAxis
            domain={[60, 100]}
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}%`, "Confidence"]}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={CHART_COLORS.success}
            strokeWidth={2}
            fill="url(#confidenceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export const ConfidenceGrowthChart = memo(ConfidenceGrowthChartComponent);
