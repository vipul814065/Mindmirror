import { describe, it, expect } from "vitest";
import {
  moodEntrySchema,
  journalEntrySchema,
  coachMessageSchema,
  appDataSchema,
} from "@/lib/validation/schemas";

describe("moodEntrySchema", () => {
  it("accepts valid mood entry", () => {
    const result = moodEntrySchema.safeParse({
      id: "mood-1",
      date: "2026-06-13",
      mood: 4,
      note: "Good day",
      triggers: ["Mock Test"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid mood level", () => {
    const result = moodEntrySchema.safeParse({
      id: "mood-1",
      date: "2026-06-13",
      mood: 6,
      triggers: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = moodEntrySchema.safeParse({
      id: "mood-1",
      date: "06/13/2026",
      mood: 3,
      triggers: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("journalEntrySchema", () => {
  it("accepts valid journal", () => {
    const result = journalEntrySchema.safeParse({
      id: "j-1",
      date: "2026-06-13",
      content: "Today was a challenging but productive day overall.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short content", () => {
    const result = journalEntrySchema.safeParse({
      id: "j-1",
      date: "2026-06-13",
      content: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("coachMessageSchema", () => {
  it("accepts valid message", () => {
    const result = coachMessageSchema.safeParse({
      id: "c-1",
      role: "user",
      content: "I need help with stress",
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty content", () => {
    const result = coachMessageSchema.safeParse({
      id: "c-1",
      role: "user",
      content: "",
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });
});

describe("appDataSchema", () => {
  it("accepts valid app data", () => {
    const result = appDataSchema.safeParse({
      moods: [],
      journals: [],
      coachMessages: [],
      actionPlan: [],
      settings: { examType: "JEE", userName: "Student" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects too many moods", () => {
    const moods = Array.from({ length: 1001 }, (_, i) => ({
      id: `m-${i}`,
      date: "2026-06-13",
      mood: 3 as const,
      triggers: [] as const[],
    }));
    const result = appDataSchema.safeParse({
      moods,
      journals: [],
      coachMessages: [],
      actionPlan: [],
      settings: { examType: "JEE", userName: "Student" },
    });
    expect(result.success).toBe(false);
  });
});
