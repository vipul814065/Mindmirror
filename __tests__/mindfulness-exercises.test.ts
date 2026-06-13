import { describe, it, expect } from "vitest";
import { getAdaptiveExercises, getAllExercises } from "@/lib/ai/mindfulness-exercises";

describe("mindfulness exercises", () => {
  it("returns default exercises when no triggers", () => {
    const exercises = getAdaptiveExercises([], 20);
    expect(exercises.length).toBeGreaterThan(0);
  });

  it("selects mock-test calm for Mock Test trigger", () => {
    const exercises = getAdaptiveExercises(["Mock Test"], 30);
    expect(exercises.some((e) => e.id === "mock-test-calm")).toBe(true);
  });

  it("adds study break for high burnout", () => {
    const exercises = getAdaptiveExercises([], 70);
    expect(exercises.some((e) => e.id === "study-break-breathing")).toBe(true);
  });

  it("lists all exercises", () => {
    expect(getAllExercises().length).toBe(4);
  });
});
