export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export type ExamType = "JEE" | "NEET" | "UPSC" | "CAT" | "CUET";

export type TriggerTag =
  | "Mock Test"
  | "Score Discussion"
  | "Sleep"
  | "Study Load"
  | "Family Pressure"
  | "Self Doubt"
  | "Social Comparison"
  | "Health";

export interface MoodEntry {
  id: string;
  date: string;
  mood: MoodLevel;
  note?: string;
  triggers: TriggerTag[];
}

export interface JournalAnalysis {
  sentiment: number;
  sentimentLabel: "positive" | "neutral" | "negative";
  triggers: TriggerTag[];
  themes: string[];
  reflection: string;
  coachingTip: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  analysis?: JournalAnalysis;
}

export interface BurnoutSnapshot {
  date: string;
  score: number;
  factors: string[];
  riskLevel: "low" | "moderate" | "high" | "critical";
}

export interface ActionPlanItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface WeeklyInsight {
  weekStart: string;
  patterns: string[];
  summary: string;
  moodTrend: "improving" | "stable" | "declining";
  avgMood: number;
}

export interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface TriggerPattern {
  trigger: TriggerTag;
  count: number;
  confidence: "low" | "medium" | "high";
  description: string;
}

export interface AppSettings {
  examType: ExamType;
  userName: string;
}

export interface AppData {
  moods: MoodEntry[];
  journals: JournalEntry[];
  coachMessages: CoachMessage[];
  actionPlan: ActionPlanItem[];
  settings: AppSettings;
}
