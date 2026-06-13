import { describe, it, expect } from "vitest";
import {
  analyzeJournal,
  getCoachResponse,
  generateActionPlan,
  generateWeeklyInsight,
  detectTriggerPatterns,
  detectTriggers,
} from "@/lib/ai/mock-engine";
import type { MoodEntry } from "@/types/wellness";

describe("analyzeJournal", () => {
  it("detects mock test triggers and negative sentiment", () => {
    const result = analyzeJournal(
      "Today's mock test went terribly. I feel like giving up and I'm so anxious.",
    );
    expect(result.triggers).toContain("Mock Test");
    expect(result.sentimentLabel).toBe("negative");
    expect(result.themes.length).toBeGreaterThan(0);
    expect(result.reflection).toBeTruthy();
    expect(result.coachingTip).toBeTruthy();
  });

  it("detects positive sentiment", () => {
    const result = analyzeJournal(
      "I'm feeling confident and motivated today. Great progress on physics!",
    );
    expect(result.sentimentLabel).toBe("positive");
  });
});

describe("getCoachResponse", () => {
  it("responds to mock failure", () => {
    const response = getCoachResponse("I failed my mock test");
    expect(response).toContain("mock");
  });

  it("responds to burnout", () => {
    const response = getCoachResponse("I'm feeling burnt out");
    expect(response.toLowerCase()).toContain("burnout");
  });

  it("returns default for unknown input", () => {
    const response = getCoachResponse("hello there");
    expect(response).toBeTruthy();
  });
});

describe("generateActionPlan", () => {
  it("generates plans for mock test triggers", () => {
    const plan = generateActionPlan(65, ["Mock Test"]);
    expect(plan.length).toBeGreaterThanOrEqual(5);
    expect(plan.some((p) => p.title.toLowerCase().includes("mock"))).toBe(true);
  });

  it("caps at 7 items", () => {
    const plan = generateActionPlan(80, [
      "Mock Test",
      "Score Discussion",
      "Sleep",
      "Self Doubt",
      "Study Load",
    ]);
    expect(plan.length).toBeLessThanOrEqual(7);
  });
});

describe("generateWeeklyInsight", () => {
  it("detects mock test pattern", () => {
    const moods: MoodEntry[] = [
      { id: "1", date: new Date().toISOString().split("T")[0], mood: 2, triggers: ["Mock Test"] },
      { id: "2", date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0], mood: 2, triggers: ["Mock Test"] },
      { id: "3", date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0], mood: 4, triggers: [] },
    ];
    const insight = generateWeeklyInsight(moods, []);
    expect(insight.patterns.some((p) => p.includes("mock test"))).toBe(true);
  });
});

describe("detectTriggers", () => {
  it("finds sleep-related triggers", () => {
    expect(detectTriggers("I couldn't sleep last night")).toContain("Sleep");
  });
});

describe("detectTriggerPatterns", () => {
  it("aggregates trigger counts", () => {
    const moods: MoodEntry[] = [
      { id: "1", date: "2026-06-01", mood: 2, triggers: ["Mock Test"] },
      { id: "2", date: "2026-06-02", mood: 3, triggers: ["Mock Test", "Sleep"] },
    ];
    const patterns = detectTriggerPatterns(moods, []);
    expect(patterns[0].trigger).toBe("Mock Test");
    expect(patterns[0].count).toBe(2);
  });
});
