import { describe, it, expect } from "vitest";
import {
  getHeroInsightQuote,
  HERO_INSIGHT_QUOTE,
} from "@/lib/ai/insights";
import type { MoodEntry } from "@/types/wellness";

describe("getHeroInsightQuote", () => {
  it("returns signature quote when demo analytics present", () => {
    const quote = getHeroInsightQuote([], [], {
      wellnessScore: 82,
      burnoutRiskPercent: 28,
      focusScore: 88,
      stressLevel: "Medium",
      sleepQuality: 7.8,
      confidenceScore: 84,
      aiInsights: [
        "Mock tests are responsible for 43% of detected stress events.",
        "Confidence drops after comparing scores with peers.",
      ],
      moodTrend30Day: [],
      burnoutHistory: [],
      confidenceGrowth: [],
      sleepVsPerformance: [],
      weeklyProductivity: [],
      studyHoursHeatmap: [],
      stressTriggerBreakdown: [],
      weeklyProgress: {
        studyHours: 52,
        topicsCompleted: 17,
        mockTests: 4,
        stressReduction: 12,
        confidenceGrowth: 8,
      },
      recommendations: [],
      activityFeed: [],
      notifications: [],
    });
    expect(quote).toBe(HERO_INSIGHT_QUOTE);
  });

  it("returns hero quote for default fallback patterns", () => {
    const quote = getHeroInsightQuote([], []);
    expect(quote).toBe(HERO_INSIGHT_QUOTE);
  });

  it("returns hero quote for mock-test mood patterns", () => {
    const moods: MoodEntry[] = [
      {
        id: "1",
        date: new Date().toISOString().split("T")[0],
        mood: 2,
        triggers: ["Mock Test"],
      },
      {
        id: "2",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        mood: 1,
        triggers: ["Mock Test"],
      },
    ];
    const quote = getHeroInsightQuote(moods, []);
    expect(quote).toBe(HERO_INSIGHT_QUOTE);
  });
});
