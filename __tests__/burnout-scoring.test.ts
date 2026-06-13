import { describe, it, expect } from "vitest";
import {
  calculateBurnoutScore,
  getRiskLevel,
  getTopTriggers,
  BURNOUT_TIPS,
} from "@/lib/scoring/burnout";
import type { MoodEntry, JournalEntry } from "@/types/wellness";

describe("calculateBurnoutScore", () => {
  it("returns low risk for healthy data", () => {
    const moods: MoodEntry[] = [
      { id: "1", date: new Date().toISOString().split("T")[0], mood: 5, triggers: [] },
      { id: "2", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], mood: 4, triggers: [] },
    ];
    const result = calculateBurnoutScore(moods, []);
    expect(result.score).toBeLessThan(30);
    expect(result.riskLevel).toBe("low");
  });

  it("returns higher risk for low moods and triggers", () => {
    const moods: MoodEntry[] = Array.from({ length: 5 }, (_, i) => ({
      id: `${i}`,
      date: new Date(Date.now() - 86400000 * i).toISOString().split("T")[0],
      mood: 1 as const,
      triggers: ["Mock Test", "Self Doubt"] as const,
    }));

    const journals: JournalEntry[] = [
      {
        id: "j1",
        date: new Date().toISOString().split("T")[0],
        content: "Terrible day, stressed and anxious, failed mock",
        analysis: {
          sentiment: -0.5,
          sentimentLabel: "negative",
          triggers: ["Mock Test"],
          themes: ["Exam anxiety"],
          reflection: "test",
          coachingTip: "test",
        },
      },
    ];

    const result = calculateBurnoutScore(moods, journals);
    expect(result.score).toBeGreaterThan(50);
    expect(result.factors.length).toBeGreaterThan(0);
  });

  it("handles empty data gracefully", () => {
    const result = calculateBurnoutScore([], []);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe("getRiskLevel", () => {
  it("maps scores to correct levels", () => {
    expect(getRiskLevel(10)).toBe("low");
    expect(getRiskLevel(40)).toBe("moderate");
    expect(getRiskLevel(60)).toBe("high");
    expect(getRiskLevel(80)).toBe("critical");
  });
});

describe("getTopTriggers", () => {
  it("returns most frequent triggers", () => {
    const moods: MoodEntry[] = [
      { id: "1", date: "2026-06-01", mood: 2, triggers: ["Mock Test"] },
      { id: "2", date: "2026-06-02", mood: 3, triggers: ["Mock Test", "Sleep"] },
      { id: "3", date: "2026-06-03", mood: 4, triggers: ["Sleep"] },
    ];
    const top = getTopTriggers(moods, [], 2);
    expect(top[0]).toBe("Mock Test");
  });
});

describe("BURNOUT_TIPS", () => {
  it("has tips for all risk levels", () => {
    expect(BURNOUT_TIPS.low.length).toBeGreaterThan(0);
    expect(BURNOUT_TIPS.critical.length).toBeGreaterThan(0);
  });
});
