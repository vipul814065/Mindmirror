import type { MoodEntry, JournalEntry, BurnoutSnapshot, TriggerTag } from "@/types/wellness";
import { detectTriggers } from "@/lib/ai/mock-engine";

function getLastNDaysMoods(moods: MoodEntry[], days: number): MoodEntry[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return moods.filter((m) => new Date(m.date) >= cutoff);
}

function getConsecutiveLowMoodDays(moods: MoodEntry[]): number {
  const sorted = [...moods].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  let streak = 0;
  for (const mood of sorted) {
    if (mood.mood <= 2) streak++;
    else break;
  }
  return streak;
}

function getTriggerDensity(moods: MoodEntry[], journals: JournalEntry[]): number {
  const recentMoods = getLastNDaysMoods(moods, 7);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const recentJournals = journals.filter((j) => new Date(j.date) >= cutoff);

  let totalTriggers = recentMoods.reduce((s, m) => s + m.triggers.length, 0);

  for (const j of recentJournals) {
    const triggers = j.analysis?.triggers ?? detectTriggers(j.content);
    totalTriggers += triggers.length;
  }

  const entries = recentMoods.length + recentJournals.length;
  if (entries === 0) return 0;
  return Math.min(1, totalTriggers / (entries * 2));
}

function getNegativeSentimentRatio(journals: JournalEntry[]): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const recent = journals.filter((j) => new Date(j.date) >= cutoff);
  if (recent.length === 0) return 0;

  const negative = recent.filter(
    (j) => j.analysis?.sentimentLabel === "negative",
  ).length;

  return negative / recent.length;
}

export function getRiskLevel(
  score: number,
): BurnoutSnapshot["riskLevel"] {
  if (score < 30) return "low";
  if (score < 55) return "moderate";
  if (score < 75) return "high";
  return "critical";
}

export function getRiskLabel(level: BurnoutSnapshot["riskLevel"]): string {
  const labels: Record<BurnoutSnapshot["riskLevel"], string> = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    critical: "Critical Risk",
  };
  return labels[level];
}

export function calculateBurnoutScore(
  moods: MoodEntry[],
  journals: JournalEntry[],
): BurnoutSnapshot {
  const recentMoods = getLastNDaysMoods(moods, 7);

  const avgMood =
    recentMoods.length > 0
      ? recentMoods.reduce((s, m) => s + m.mood, 0) / recentMoods.length
      : 3;

  const moodComponent = ((5 - avgMood) / 4) * 40;
  const sentimentComponent = getNegativeSentimentRatio(journals) * 30;
  const triggerComponent = getTriggerDensity(moods, journals) * 20;
  const streakComponent = Math.min(getConsecutiveLowMoodDays(moods), 5) * 2;

  const score = Math.round(
    Math.min(100, moodComponent + sentimentComponent + triggerComponent + streakComponent),
  );

  const factors: string[] = [];

  if (avgMood < 3) factors.push("Below-average mood over the past week");
  if (getNegativeSentimentRatio(journals) > 0.4)
    factors.push("Frequent negative journal sentiment");
  if (getTriggerDensity(moods, journals) > 0.5)
    factors.push("High stress trigger density");
  if (getConsecutiveLowMoodDays(moods) >= 2)
    factors.push(`${getConsecutiveLowMoodDays(moods)} consecutive low-mood days`);

  if (factors.length === 0) factors.push("Overall emotional balance looks healthy");

  const riskLevel = getRiskLevel(score);

  return {
    date: new Date().toISOString().split("T")[0],
    score,
    factors,
    riskLevel,
  };
}

export function getTopTriggers(
  moods: MoodEntry[],
  journals: JournalEntry[],
  limit = 3,
): TriggerTag[] {
  const counts = new Map<TriggerTag, number>();

  for (const mood of moods) {
    for (const t of mood.triggers) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }

  for (const journal of journals) {
    const triggers =
      journal.analysis?.triggers ?? detectTriggers(journal.content);
    for (const t of triggers) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([t]) => t);
}

export const BURNOUT_TIPS: Record<BurnoutSnapshot["riskLevel"], string[]> = {
  low: [
    "Maintain your current balance — consistency is your strength",
    "Keep journaling to catch early warning signs",
  ],
  moderate: [
    "Schedule one rest evening this week",
    "Reduce score discussions to protect confidence",
    "Add a 10-minute mindfulness break daily",
  ],
  high: [
    "Prioritize sleep — aim for 7+ hours tonight",
    "Talk to a mentor or counselor about pressure",
    "Cut one non-essential study hour for recovery",
  ],
  critical: [
    "Take a full day off to recover — this is urgent",
    "Reach out to a trusted adult or counselor today",
    "Focus on breathing exercises before any study session",
  ],
};
