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
  moodScore: number;
  stressLevel: "Low" | "Medium" | "High";
  burnoutRiskPercent: number;
  confidenceScore: number;
  triggers: TriggerTag[];
  themes: string[];
  triggerSummary: string;
  reflection: string;
  coachingTip: string;
  recommendation: string;
  aiReasoning: string;
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
  age?: number;
  goal?: string;
  studyHoursPerDay?: number;
  streakDays?: number;
}

export interface DemoNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface DemoActivity {
  id: string;
  type: string;
  message: string;
  time: string;
}

export interface DemoAnalytics {
  wellnessScore: number;
  burnoutRiskPercent: number;
  focusScore: number;
  stressLevel: "Low" | "Medium" | "High";
  sleepQuality: number;
  confidenceScore: number;
  moodTrend30Day: { date: string; mood: number; label?: string }[];
  burnoutHistory: { date: string; score: number }[];
  weeklyProductivity: { week: string; score: number }[];
  sleepPerformance: { date: string; sleep: number; performance: number }[];
  confidenceGrowth: { date: string; score: number }[];
  studyHoursHeatmap: { date: string; hours: number }[];
  stressTriggerBreakdown: { trigger: string; percentage: number }[];
  weeklyProgress: {
    studyHours: number;
    completedTopics: number;
    mockTests: number;
    stressReduction: number;
    confidenceGrowth: number;
  };
  aiInsights: string[];
  recommendations: string[];
  notifications: DemoNotification[];
  activityFeed: DemoActivity[];
}

export interface AppData {
  moods: MoodEntry[];
  journals: JournalEntry[];
  coachMessages: CoachMessage[];
  actionPlan: ActionPlanItem[];
  settings: AppSettings;
  analytics?: DemoAnalytics;
}
