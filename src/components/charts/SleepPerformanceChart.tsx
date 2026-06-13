"use client";

import { memo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatShortDate, tooltipStyle, CHART_COLORS } from "@/lib/charts/theme";
import { buildSleepPerformanceSummary } from "@/lib/charts/summaries";

interface SleepPerformanceChartProps {
  data: { date: string; sleep: number; performance: number }[];
}

function SleepPerformanceChartComponent({ data }: SleepPerformanceChartProps) {
  const chartData = data.map((d) => ({
    date: formatShortDate(d.date),
    sleep: d.sleep,
    performance: d.performance,
  }));

  if (!chartData.length) {
    return (
      <GlassCard ariaLabel="Sleep vs performance">
        <p className="py-8 text-center text-sm text-muted">No sleep data yet.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard ariaLabel="Sleep vs performance">
      <div className="sr-only">{buildSleepPerformanceSummary(data)}</div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 10]}
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            verticalAlign="top"
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs text-muted">{value}</span>
            )}
          />
          <Bar
            yAxisId="left"
            dataKey="sleep"
            name="Sleep (hrs)"
            fill={CHART_COLORS.secondary}
            radius={[6, 6, 0, 0]}
            opacity={0.7}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="performance"
            name="Performance"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.primary, r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export const SleepPerformanceChart = memo(SleepPerformanceChartComponent);
