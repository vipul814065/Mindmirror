import { describe, it, expect } from "vitest";
import { analyzeJournal } from "@/lib/ai/journal-analyzer";
import { DEMO_JOURNAL_ENTRY } from "@/lib/constants/demo";

describe("journal analyzer depth", () => {
  it("produces full AI outputs for the user example journal", () => {
    const result = analyzeJournal(DEMO_JOURNAL_ENTRY);

    expect(result.moodScore).toBeGreaterThanOrEqual(1);
    expect(result.moodScore).toBeLessThanOrEqual(5);
    expect(result.stressLevel).toMatch(/Low|Medium|High/);
    expect(result.burnoutRiskPercent).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);
    expect(result.triggers.length).toBeGreaterThan(0);
    expect(result.triggerSummary).toContain("Mock Test");
    expect(result.aiReasoning.length).toBeGreaterThan(20);
    expect(result.recommendation.length).toBeGreaterThan(10);
    expect(result.coachingTip.length).toBeGreaterThan(5);
  });

  it("handles empty-adjacent short negative content", () => {
    const result = analyzeJournal("I feel a bit stressed today about my exam.");
    expect(result.sentimentLabel).toBeDefined();
    expect(result.moodScore).toBeDefined();
  });

  it("sanitizes and analyzes long journal content", () => {
    const long = "I studied all day. " + "anxious ".repeat(200);
    const result = analyzeJournal(long);
    expect(["Medium", "High"]).toContain(result.stressLevel);
  });
});
