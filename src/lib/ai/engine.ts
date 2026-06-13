import type {
  ActionPlanItem,
  DemoAnalytics,
  JournalAnalysis,
  JournalEntry,
  MoodEntry,
  TriggerPattern,
  TriggerTag,
  WeeklyInsight,
  ExamType,
} from "@/types/wellness";
import { generateActionPlan } from "@/lib/ai/action-plan";
import { getCoachResponse, QUICK_REPLIES } from "@/lib/ai/coach-responses";
import { analyzeJournal, detectTriggers } from "@/lib/ai/journal-analyzer";
import {
  detectTriggerPatterns,
  generateWeeklyInsight,
  getDemoInsights,
} from "@/lib/ai/insights";

export interface WellnessAIEngine {
  analyzeJournal(content: string): JournalAnalysis;
  getCoachResponse(message: string, examType?: ExamType): string;
  generateActionPlan(burnoutScore: number, topTriggers: TriggerTag[]): ActionPlanItem[];
  generateWeeklyInsight(
    moods: MoodEntry[],
    journals: JournalEntry[],
    analytics?: DemoAnalytics,
  ): WeeklyInsight;
  detectTriggerPatterns(moods: MoodEntry[], journals: JournalEntry[]): TriggerPattern[];
}

export const mockEngine: WellnessAIEngine = {
  analyzeJournal,
  getCoachResponse,
  generateActionPlan,
  generateWeeklyInsight,
  detectTriggerPatterns,
};

export {
  analyzeJournal,
  getCoachResponse,
  QUICK_REPLIES,
  generateActionPlan,
  generateWeeklyInsight,
  detectTriggerPatterns,
  getDemoInsights,
  detectTriggers,
};
