import type { AppData } from "@/types/wellness";
import { generateWeeklyInsight } from "@/lib/ai/mock-engine";

export interface ChallengeRequirement {
  id: string;
  label: string;
  evidence: string;
  href: string;
}

export const CHALLENGE_REQUIREMENTS: ChallengeRequirement[] = [
  {
    id: "daily-journal",
    label: "Daily Journal Analysis",
    evidence: "AI sentiment, triggers, themes, and coaching tips per entry",
    href: "/journal",
  },
  {
    id: "mood-logging",
    label: "Mood Logging",
    evidence: "Daily mood scale with trigger tags and 30-day trend chart",
    href: "/mood",
  },
  {
    id: "stress-triggers",
    label: "Hidden Stress Trigger Detection",
    evidence: "Auto-detected patterns from moods and journals with confidence scores",
    href: "/insights/triggers",
  },
  {
    id: "emotional-patterns",
    label: "Emotional Pattern Recognition",
    evidence: "Weekly pattern cards and mood trend analysis",
    href: "/insights/weekly",
  },
  {
    id: "burnout-risk",
    label: "Burnout Risk Assessment",
    evidence: "Composite burnout score with factor breakdown and tips",
    href: "/burnout",
  },
  {
    id: "ai-companion",
    label: "Conversational AI Support",
    evidence: "Empathetic wellness coach with quick replies and floating widget",
    href: "/coach",
  },
  {
    id: "wellness-guidance",
    label: "Personalized Wellness Guidance",
    evidence: "Context-aware action plan with category badges and checkboxes",
    href: "/plan",
  },
  {
    id: "mindfulness",
    label: "Adaptive Mindfulness Exercises",
    evidence: "Trigger-adaptive breathing and grounding exercises",
    href: "/mindfulness",
  },
  {
    id: "motivation",
    label: "Motivational Encouragement",
    evidence: "Daily encouragement banner and coach motivational closings",
    href: "/coach",
  },
  {
    id: "academic-wellbeing",
    label: "Academic Wellbeing Tracking",
    evidence: "Study hours, mock tests, confidence growth, and productivity charts",
    href: "/analytics",
  },
  {
    id: "context-recommendations",
    label: "Context-Aware Recommendations",
    evidence: "Recommendations driven by burnout score and detected triggers",
    href: "/plan",
  },
  {
    id: "hyper-insights",
    label: "Hyper-Personalized Insights",
    evidence: "AI hero insight quote and pattern-specific emotional insights",
    href: "/insights/weekly",
  },
];

export function detectChallengeRequirementStatus(data: AppData): Record<string, boolean> {
  const hasJournalAnalysis = data.journals.some((j) => j.analysis);
  const hasDeepAnalysis = data.journals.some(
    (j) => j.analysis && j.analysis.aiReasoning && j.analysis.burnoutRiskPercent > 0,
  );
  const hasMoodData = data.moods.length > 0;
  const hasTriggers =
    Boolean(data.analytics) ||
    data.moods.some((m) => m.triggers.length > 0) ||
    data.journals.some((j) => (j.analysis?.triggers.length ?? 0) > 0);
  const insight = generateWeeklyInsight(data.moods, data.journals, data.analytics);
  const hasPatterns = insight.patterns.length > 0;
  const hasCoach = data.coachMessages.length >= 2;
  const hasPlan = data.actionPlan.some((p) => p.category === "Mindfulness") || data.actionPlan.length > 0;
  const hasMindfulnessPlan = data.actionPlan.some((p) => p.category === "Mindfulness");
  const hasAnalytics = Boolean(data.analytics);
  const hasRecommendations =
    (data.analytics?.recommendations.length ?? 0) > 0 || data.actionPlan.length > 0;

  return {
    "daily-journal": hasJournalAnalysis || hasDeepAnalysis,
    "mood-logging": hasMoodData,
    "stress-triggers": hasTriggers,
    "emotional-patterns": hasPatterns && hasMoodData,
    "burnout-risk": hasMoodData,
    "ai-companion": hasCoach,
    "wellness-guidance": hasPlan,
    mindfulness: hasMindfulnessPlan || hasPlan,
    motivation: hasCoach || hasMoodData,
    "academic-wellbeing": hasAnalytics || hasMoodData,
    "context-recommendations": hasRecommendations,
    "hyper-insights": hasPatterns || hasAnalytics,
  };
}
