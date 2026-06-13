import { describe, it, expect } from "vitest";
import { EXAM_TYPES } from "@/lib/constants/exams";
import { TRIGGER_TAGS } from "@/lib/constants/triggers";

describe("constants", () => {
  it("exports exam types", () => {
    expect(EXAM_TYPES).toContain("JEE");
    expect(EXAM_TYPES).toHaveLength(5);
  });

  it("exports trigger tags", () => {
    expect(TRIGGER_TAGS).toContain("Mock Test");
    expect(TRIGGER_TAGS.length).toBeGreaterThan(5);
  });
});
