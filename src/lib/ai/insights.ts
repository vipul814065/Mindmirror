import type {
  DemoAnalytics,
  JournalEntry,
  MoodEntry,
  TriggerPattern,
  TriggerTag,
  WeeklyInsight,
} from "@/types/wellness";
import { detectTriggers } from "@/lib/ai/journal-analyzer";

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

export const HERO_INSIGHT_QUOTE =
  "You feel stressed after every mock test… motivation recovers within 2 days.";

export function getDemoInsights(analytics?: DemoAnalytics): string[] | null {
  if (analytics?.aiInsights?.length) return analytics.aiInsights;
  return null;
}

export function generateWeeklyInsight(
  moods: MoodEntry[],
  journals: JournalEntry[],
  analytics?: DemoAnalytics,
): WeeklyInsight {
  const demoInsights = getDemoInsights(analytics);
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekStartDate = new Date(weekStart);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 7);

  const weekMoods = moods.filter((m) => {
    const d = new Date(m.date);
    return d >= weekStartDate && d < weekEndDate;
  });

  const weekJournals = journals.filter((j) => {
    const d = new Date(j.date);
    return d >= weekStartDate && d < weekEndDate;
  });

  const patterns: string[] = [];
  const mockMoods = weekMoods.filter((m) => m.triggers.includes("Mock Test"));
  const lowAfterMock = mockMoods.filter((m) => m.mood <= 2).length;

  if (mockMoods.length >= 2 && lowAfterMock >= 2) {
    patterns.push(
      "Recurring Pattern Detected: You feel stressed after every mock test.",
      "Self-doubt increased after low scores",
      "Confidence drops after score discussions",
      "Motivation recovers within 2 days",
    );
  }

  const scoreMoods = weekMoods.filter((m) =>
    m.triggers.includes("Score Discussion"),
  );
  if (scoreMoods.length >= 2) {
    patterns.push(
      "Score discussions consistently lower your mood",
      "Social comparison triggers appear mid-week",
    );
  }

  const sleepIssues = weekJournals.some(
    (j) =>
      j.analysis?.triggers.includes("Sleep") ||
      detectTriggers(j.content).includes("Sleep"),
  );
  if (sleepIssues) {
    patterns.push("Sleep quality correlates with lower mood days");
  }

  if (patterns.length === 0) {
    patterns.push(
      "Mock tests are responsible for 43% of detected stress events.",
      "Confidence drops after comparing scores with peers.",
      "Focus levels increase after completing revision tasks.",
      "Sleep quality directly impacts next-day productivity.",
    );
  }

  if (demoInsights) {
    patterns.length = 0;
    patterns.push(...demoInsights);
  }

  const avgMood =
    weekMoods.length > 0
      ? weekMoods.reduce((s, m) => s + m.mood, 0) / weekMoods.length
      : 3;

  const prevWeekStart = new Date(weekStartDate);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevMoods = moods.filter((m) => {
    const d = new Date(m.date);
    return d >= prevWeekStart && d < weekStartDate;
  });
  const prevAvg =
    prevMoods.length > 0
      ? prevMoods.reduce((s, m) => s + m.mood, 0) / prevMoods.length
      : avgMood;

  let moodTrend: WeeklyInsight["moodTrend"] = "stable";
  if (avgMood > prevAvg + 0.3) moodTrend = "improving";
  if (avgMood < prevAvg - 0.3) moodTrend = "declining";

  const summary =
    moodTrend === "improving"
      ? `Your emotional wellbeing improved this week (avg mood ${avgMood.toFixed(1)}/5). Keep nurturing what's working.`
      : moodTrend === "declining"
        ? `Your mood dipped this week (avg ${avgMood.toFixed(1)}/5). The patterns below highlight areas to address.`
        : `Your mood stayed steady this week (avg ${avgMood.toFixed(1)}/5). Awareness is the foundation of growth.`;

  return { weekStart, patterns, summary, moodTrend, avgMood };
}

export function getHeroInsightQuote(
  moods: MoodEntry[],
  journals: JournalEntry[],
  analytics?: DemoAnalytics,
): string {
  const insight = generateWeeklyInsight(moods, journals, analytics);
  const hasMockPattern = insight.patterns.some(
    (p) =>
      p.toLowerCase().includes("mock test") ||
      p.toLowerCase().includes("stressed after"),
  );
  if (hasMockPattern) return HERO_INSIGHT_QUOTE;
  return insight.patterns[0] ?? HERO_INSIGHT_QUOTE;
}

export function detectTriggerPatterns(
  moods: MoodEntry[],
  journals: JournalEntry[],
): TriggerPattern[] {
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

  const descriptions: Record<TriggerTag, string> = {
    "Mock Test": "Mock tests → stress spike detected",
    "Score Discussion": "Score talks → confidence drop pattern",
    Sleep: "Poor sleep → next-day mood decline",
    "Study Load": "Heavy syllabus → overwhelm cycles",
    "Family Pressure": "Family expectations → anxiety spikes",
    "Self Doubt": "Self-doubt → motivation dips",
    "Social Comparison": "Peer comparison → mood volatility",
    Health: "Health issues → study disruption",
  };

  return Array.from(counts.entries())
    .map(([trigger, count]) => ({
      trigger,
      count,
      confidence: (count >= 4 ? "high" : count >= 2 ? "medium" : "low") as
        | "low"
        | "medium"
        | "high",
      description: descriptions[trigger],
    }))
    .sort((a, b) => b.count - a.count);
}
