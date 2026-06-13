"use client";

import { memo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { PIE_COLORS, tooltipStyle } from "@/lib/charts/theme";
import { buildTriggerBreakdownSummary } from "@/lib/charts/summaries";

interface StressBreakdownChartProps {
  data: { trigger: string; percentage: number }[];
  compact?: boolean;
}

function StressBreakdownChartComponent({ data, compact = false }: StressBreakdownChartProps) {
  if (!data.length) {
    return (
      <GlassCard ariaLabel="Stress trigger breakdown">
        <p className="py-8 text-center text-sm text-muted">No trigger data yet.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard ariaLabel="Stress trigger breakdown">
      <div className="sr-only">{buildTriggerBreakdownSummary(data)}</div>
      <ResponsiveContainer width="100%" height={compact ? 200 : 280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="trigger"
            cx="50%"
            cy="50%"
            innerRadius={compact ? 45 : 60}
            outerRadius={compact ? 70 : 95}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [`${value}%`, name]}
          />
          {!compact && (
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-muted">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export const StressBreakdownChart = memo(StressBreakdownChartComponent);
