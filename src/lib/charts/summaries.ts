import type { MoodEntry, TriggerTag } from "@/types/wellness";

const MOOD_LABELS: Record<number, string> = {
  1: "Very low",
  2: "Low",
  3: "Neutral",
  4: "Good",
  5: "Great",
};

export function buildMoodChartSummary(data: { date: string; mood: number; label?: string }[]): string {
  if (data.length === 0) return "No mood data available.";
  const lines = data.map(
    (d) => `${d.date}: mood ${d.mood} (${MOOD_LABELS[d.mood] ?? d.label ?? "unknown"})`,
  );
  return `Mood trend with ${data.length} entries. ${lines.join(". ")}.`;
}

export function buildBurnoutHistorySummary(data: { date: string; score: number }[]): string {
  if (data.length === 0) return "No burnout history available.";
  const latest = data[data.length - 1];
  return `Burnout history with ${data.length} data points. Latest on ${latest.date}: score ${latest.score}.`;
}

export function buildTriggerBreakdownSummary(
  data: { trigger: string; percentage: number }[],
): string {
  if (data.length === 0) return "No stress trigger breakdown available.";
  const parts = data.map((d) => `${d.trigger} ${d.percentage}%`);
  return `Stress triggers: ${parts.join(", ")}.`;
}

export function buildTriggerPatternsSummary(
  data: { trigger: TriggerTag; count: number; confidence: string }[],
): string {
  if (data.length === 0) return "No trigger patterns detected.";
  const parts = data.map((d) => `${d.trigger} (${d.count} events, ${d.confidence} confidence)`);
  return `Detected patterns: ${parts.join("; ")}.`;
}

export function buildHeatmapSummary(data: { date: string; hours: number }[]): string {
  if (data.length === 0) return "No study hours data available.";
  const total = data.reduce((sum, d) => sum + d.hours, 0);
  const avg = (total / data.length).toFixed(1);
  return `Study hours heatmap: ${data.length} days, average ${avg} hours per day.`;
}

export function buildProductivitySummary(data: { week: string; score: number }[]): string {
  if (data.length === 0) return "No productivity data available.";
  const parts = data.map((d) => `Week ${d.week}: ${d.score}%`);
  return `Weekly productivity: ${parts.join(", ")}.`;
}

export function buildSleepPerformanceSummary(
  data: { date: string; sleep: number; performance: number }[],
): string {
  if (data.length === 0) return "No sleep performance data available.";
  const avgSleep = (data.reduce((s, d) => s + d.sleep, 0) / data.length).toFixed(1);
  return `Sleep vs performance: ${data.length} days, average sleep ${avgSleep} hours.`;
}

export function buildConfidenceSummary(data: { date: string; score: number }[]): string {
  if (data.length === 0) return "No confidence growth data available.";
  const latest = data[data.length - 1];
  return `Confidence growth: ${data.length} points. Latest score ${latest.score} on ${latest.date}.`;
}

export function buildMoodEntriesSummary(entries: MoodEntry[]): string {
  if (entries.length === 0) return "No mood entries logged.";
  const avg = entries.reduce((s, e) => s + e.mood, 0) / entries.length;
  return `${entries.length} mood entries with average mood ${avg.toFixed(1)} out of 5.`;
}
