import type {
  AppData,
  CoachMessage,
  JournalEntry,
  MoodEntry,
} from "@/types/wellness";
import {
  moodEntrySchema,
  journalEntrySchema,
  coachMessageSchema,
  appSettingsSchema,
} from "@/lib/validation/schemas";
import { journalService, coachService, actionPlanService } from "@/services";
import { calculateBurnoutScore, getTopTriggers } from "@/lib/scoring/burnout";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeUserInput } from "@/lib/ai/safety";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createMoodEntry(
  entry: Omit<MoodEntry, "id">,
): { mood: MoodEntry } | { error: string } {
  if (!checkRateLimit("mood", RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return { error: "Please wait a moment before logging another mood." };
  }
  const mood: MoodEntry = { ...entry, id: generateId() };
  const result = moodEntrySchema.safeParse(mood);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid mood entry." };
  }
  return { mood };
}

export function createJournalEntry(
  content: string,
): { journal: JournalEntry } | { error: string } {
  if (!checkRateLimit("journal", RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return { error: "Please wait a moment before submitting another journal entry." };
  }
  const sanitized = sanitizeUserInput(content, 5000);
  const analysis = journalService.analyze(sanitized);
  const journal: JournalEntry = {
    id: generateId(),
    date: new Date().toISOString().split("T")[0],
    content: sanitized,
    analysis,
  };
  const result = journalEntrySchema.safeParse(journal);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid journal entry." };
  }
  return { journal };
}

export function createCoachExchange(
  content: string,
  examType: AppData["settings"]["examType"],
): { userMsg: CoachMessage; assistantMsg: CoachMessage } | { error: string } {
  if (!checkRateLimit("coach", RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return { error: "Please wait a moment before sending another message." };
  }
  const sanitized = sanitizeUserInput(content, 2000);
  const userMsg: CoachMessage = {
    id: generateId(),
    role: "user",
    content: sanitized,
    timestamp: new Date().toISOString(),
  };
  const userResult = coachMessageSchema.safeParse(userMsg);
  if (!userResult.success) {
    return { error: userResult.error.issues[0]?.message ?? "Invalid message." };
  }
  const response = coachService.respond(sanitized, examType);
  const assistantMsg: CoachMessage = {
    id: generateId(),
    role: "assistant",
    content: response,
    timestamp: new Date().toISOString(),
  };
  return { userMsg, assistantMsg };
}

export function mergeSettings(
  prev: AppData,
  settings: Partial<AppData["settings"]>,
): AppData | { error: string } {
  const merged = { ...prev.settings, ...settings };
  const result = appSettingsSchema.safeParse(merged);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid settings." };
  }
  return { ...prev, settings: result.data };
}

export function buildActionPlan(data: AppData): AppData {
  const burnout = calculateBurnoutScore(data.moods, data.journals);
  const triggers = getTopTriggers(data.moods, data.journals);
  const plan = actionPlanService.generate(burnout.score, triggers);
  return { ...data, actionPlan: plan };
}
