import { describe, it, expect } from "vitest";
import { createSeedData } from "@/lib/ai/seed-data";

describe("createSeedData", () => {
  const data = createSeedData();

  it("creates Aarav Sharma profile", () => {
    expect(data.settings.userName).toBe("Aarav Sharma");
    expect(data.settings.examType).toBe("JEE");
    expect(data.settings.age).toBe(18);
    expect(data.settings.goal).toBe("IIT-JEE 2027");
    expect(data.settings.studyHoursPerDay).toBe(7.5);
    expect(data.settings.streakDays).toBe(42);
  });

  it("includes 30 days of mood entries", () => {
    expect(data.moods.length).toBe(30);
  });

  it("includes 15+ journal entries with specified content", () => {
    expect(data.journals.length).toBeGreaterThanOrEqual(15);
    expect(
      data.journals.some((j) =>
        j.content.includes("completed Physics revision today but felt nervous"),
      ),
    ).toBe(true);
    expect(
      data.journals.some((j) =>
        j.content.includes("friends are scoring higher marks"),
      ),
    ).toBe(true);
    expect(
      data.journals.some((j) =>
        j.content.includes("finally understood Organic Chemistry"),
      ),
    ).toBe(true);
  });

  it("includes coach conversation history", () => {
    expect(data.coachMessages.length).toBeGreaterThanOrEqual(8);
  });

  it("includes analytics with target metrics", () => {
    expect(data.analytics).toBeDefined();
    expect(data.analytics!.wellnessScore).toBe(82);
    expect(data.analytics!.burnoutRiskPercent).toBe(28);
    expect(data.analytics!.focusScore).toBe(88);
    expect(data.analytics!.stressLevel).toBe("Medium");
    expect(data.analytics!.sleepQuality).toBe(7.8);
    expect(data.analytics!.confidenceScore).toBe(84);
  });

  it("includes stress trigger breakdown percentages", () => {
    const breakdown = data.analytics!.stressTriggerBreakdown;
    expect(breakdown).toHaveLength(4);
    expect(breakdown.find((b) => b.trigger === "Mock Test Results")?.percentage).toBe(43);
    expect(breakdown.find((b) => b.trigger === "Time Management")?.percentage).toBe(24);
  });

  it("includes weekly progress stats", () => {
    const wp = data.analytics!.weeklyProgress;
    expect(wp.studyHours).toBe(52);
    expect(wp.completedTopics).toBe(17);
    expect(wp.mockTests).toBe(4);
    expect(wp.stressReduction).toBe(12);
    expect(wp.confidenceGrowth).toBe(8);
  });

  it("includes AI insights and recommendations", () => {
    expect(data.analytics!.aiInsights).toHaveLength(4);
    expect(data.analytics!.recommendations).toHaveLength(4);
    expect(data.analytics!.activityFeed.length).toBeGreaterThanOrEqual(10);
    expect(data.analytics!.notifications.length).toBeGreaterThanOrEqual(4);
  });

  it("includes 30-day time series data", () => {
    expect(data.analytics!.moodTrend30Day).toHaveLength(30);
    expect(data.analytics!.burnoutHistory).toHaveLength(30);
    expect(data.analytics!.confidenceGrowth).toHaveLength(30);
    expect(data.analytics!.studyHoursHeatmap).toHaveLength(30);
  });
});
