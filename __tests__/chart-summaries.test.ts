import { describe, it, expect } from "vitest";
import {
  buildMoodChartSummary,
  buildBurnoutHistorySummary,
  buildTriggerBreakdownSummary,
  buildHeatmapSummary,
  buildTriggerPatternsSummary,
  buildProductivitySummary,
  buildSleepPerformanceSummary,
  buildConfidenceSummary,
  buildMoodEntriesSummary,
} from "@/lib/charts/summaries";

describe("chart summaries", () => {
  it("builds mood chart summary", () => {
    const summary = buildMoodChartSummary([
      { date: "2026-06-01", mood: 4 },
      { date: "2026-06-02", mood: 3 },
    ]);
    expect(summary).toContain("2 entries");
    expect(summary).toContain("2026-06-01");
  });

  it("handles empty mood data", () => {
    expect(buildMoodChartSummary([])).toBe("No mood data available.");
  });

  it("builds burnout history summary", () => {
    const summary = buildBurnoutHistorySummary([
      { date: "2026-06-01", score: 40 },
      { date: "2026-06-02", score: 55 },
    ]);
    expect(summary).toContain("55");
  });

  it("builds trigger breakdown summary", () => {
    const summary = buildTriggerBreakdownSummary([
      { trigger: "Mock Test", percentage: 43 },
    ]);
    expect(summary).toContain("Mock Test");
    expect(summary).toContain("43%");
  });

  it("builds heatmap summary", () => {
    const summary = buildHeatmapSummary([
      { date: "2026-06-01", hours: 4 },
      { date: "2026-06-02", hours: 6 },
    ]);
    expect(summary).toContain("average 5.0 hours");
  });

  it("handles empty datasets", () => {
    expect(buildBurnoutHistorySummary([])).toBe("No burnout history available.");
    expect(buildTriggerBreakdownSummary([])).toBe("No stress trigger breakdown available.");
    expect(buildTriggerPatternsSummary([])).toBe("No trigger patterns detected.");
    expect(buildHeatmapSummary([])).toBe("No study hours data available.");
    expect(buildProductivitySummary([])).toBe("No productivity data available.");
    expect(buildSleepPerformanceSummary([])).toBe("No sleep performance data available.");
    expect(buildConfidenceSummary([])).toBe("No confidence growth data available.");
    expect(buildMoodEntriesSummary([])).toBe("No mood entries logged.");
  });

  it("builds mood entries summary", () => {
    const summary = buildMoodEntriesSummary([
      { id: "1", date: "2026-06-01", mood: 4, triggers: [] },
      { id: "2", date: "2026-06-02", mood: 2, triggers: [] },
    ]);
    expect(summary).toContain("average mood 3.0");
  });

  it("builds productivity and confidence summaries", () => {
    expect(buildProductivitySummary([{ week: "1", score: 80 }])).toContain("80%");
    expect(buildSleepPerformanceSummary([{ date: "2026-06-01", sleep: 7, performance: 80 }])).toContain("7.0");
    expect(buildConfidenceSummary([{ date: "2026-06-01", score: 70 }])).toContain("70");
    expect(
      buildTriggerPatternsSummary([{ trigger: "Sleep", count: 3, confidence: "medium" }]),
    ).toContain("Sleep");
  });
});
