import { describe, it, expect } from "vitest";
import { detectPitchStepStatus, PITCH_STEPS } from "@/lib/pitch/pitch-steps";
import { createSeedData } from "@/lib/ai/seed-data";

describe("pitch-steps", () => {
  it("detects all steps complete for seed data", () => {
    const data = createSeedData();
    const status = detectPitchStepStatus(data);
    for (const step of PITCH_STEPS) {
      expect(status[step.id]).toBe(true);
    }
  });

  it("detects empty data as incomplete", () => {
    const status = detectPitchStepStatus({
      moods: [],
      journals: [],
      coachMessages: [],
      actionPlan: [],
      settings: { userName: "Test", examType: "JEE" },
    });
    expect(status.dashboard).toBe(false);
    expect(status.analytics).toBe(false);
  });
});
