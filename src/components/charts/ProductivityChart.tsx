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
import { GlassCard } from "@/components/ui/GlassCard";
import { tooltipStyle, CHART_COLORS } from "@/lib/charts/theme";
import { buildProductivitySummary } from "@/lib/charts/summaries";

interface ProductivityChartProps {
  data: { week: string; score: number }[];
}

function ProductivityChartComponent({ data }: ProductivityChartProps) {
  if (!data.length) {
    return (
      <GlassCard ariaLabel="Weekly productivity">
        <p className="py-8 text-center text-sm text-muted">No productivity data yet.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard ariaLabel="Weekly productivity">
      <div className="sr-only">{buildProductivitySummary(data)}</div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="week"
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}/100`, "Productivity"]}
          />
          <Bar dataKey="score" fill={CHART_COLORS.secondary} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export const ProductivityChart = memo(ProductivityChartComponent);
