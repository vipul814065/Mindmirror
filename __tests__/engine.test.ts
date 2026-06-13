import { describe, it, expect } from "vitest";
import { mockEngine } from "@/lib/ai/engine";

describe("mockEngine", () => {
  it("analyzes journal content", () => {
    const result = mockEngine.analyzeJournal(
      "I failed my mock test and feel anxious about the upcoming JEE exam.",
    );
    expect(result.triggers).toContain("Mock Test");
    expect(result.reflection.length).toBeGreaterThan(0);
  });

  it("returns exam-specific coach response", () => {
    const response = mockEngine.getCoachResponse("I failed my mock", "JEE");
    expect(response).toContain("JEE");
  });

  it("generates action plan items", () => {
    const plan = mockEngine.generateActionPlan(65, ["Mock Test", "Sleep"]);
    expect(plan.length).toBeGreaterThan(0);
    expect(plan[0].title.length).toBeGreaterThan(3);
  });
});
