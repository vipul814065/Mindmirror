import type { AppData } from "@/types/wellness";

export interface PitchStep {
  id: string;
  label: string;
  requirement: string;
  href: string;
}

export const PITCH_STEPS: PitchStep[] = [
  {
    id: "dashboard",
    label: "Dashboard & metrics",
    requirement: "Glass UI with wellness metrics and burnout ring",
    href: "/",
  },
  {
    id: "weekly-insights",
    label: "Weekly insights",
    requirement: "Mock-test stress pattern and mood trends",
    href: "/insights/weekly",
  },
  {
    id: "journal",
    label: "AI journal analysis",
    requirement: "Sentiment, triggers, themes, and coaching tips",
    href: "/journal",
  },
  {
    id: "coach",
    label: "Wellness coach",
    requirement: "Empathetic response to “I failed my mock”",
    href: "/coach",
  },
  {
    id: "plan",
    label: "Action plan",
    requirement: "Personalized steps with checkboxes",
    href: "/plan",
  },
  {
    id: "burnout",
    label: "Burnout meter",
    requirement: "Composite score with factor breakdown",
    href: "/burnout",
  },
  {
    id: "triggers",
    label: "Stress triggers",
    requirement: "Auto-detected patterns from moods and journals",
    href: "/insights/triggers",
  },
  {
    id: "analytics",
    label: "Analytics dashboard",
    requirement: "30-day charts, heatmap, and correlations",
    href: "/analytics",
  },
];

export function detectPitchStepStatus(data: AppData): Record<string, boolean> {
  const hasAnalytics = Boolean(data.analytics);
  const hasJournalAnalysis = data.journals.some((j) => j.analysis);
  const hasMockJournal = data.journals.some(
    (j) =>
      j.content.toLowerCase().includes("mock") &&
      j.analysis?.triggers.includes("Mock Test"),
  );
  const hasCoachDemo = data.coachMessages.some(
    (m) =>
      m.role === "user" && m.content.toLowerCase().includes("failed my mock"),
  );
  const hasPlan = data.actionPlan.length > 0;
  const hasMoodData = data.moods.length > 0;

  return {
    dashboard: hasAnalytics || hasMoodData,
    "weekly-insights": hasMoodData && (hasAnalytics || data.journals.length > 0),
    journal: hasJournalAnalysis && (hasMockJournal || data.journals.length >= 2),
    coach: hasCoachDemo || data.coachMessages.length >= 2,
    plan: hasPlan,
    burnout: hasMoodData,
    triggers: hasAnalytics || data.moods.some((m) => m.triggers.length > 0),
    analytics: hasAnalytics,
  };
}
