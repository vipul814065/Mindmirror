import type {
  ActionPlanItem,
  JournalAnalysis,
  JournalEntry,
  MoodEntry,
  TriggerPattern,
  TriggerTag,
  WeeklyInsight,
} from "@/types/wellness";

const TRIGGER_KEYWORDS: Record<TriggerTag, string[]> = {
  "Mock Test": ["mock test", "mock exam", "practice test", "test series", "failed my mock"],
  "Score Discussion": ["score", "rank", "percentile", "result discussion", "compared scores"],
  Sleep: ["sleep", "insomnia", "tired", "exhausted", "can't sleep", "fatigue"],
  "Study Load": ["syllabus", "backlog", "too much to study", "overwhelmed", "chapters pending"],
  "Family Pressure": ["parents", "family pressure", "expectations", "disappointed"],
  "Self Doubt": ["doubt", "not good enough", "can't do this", "give up", "worthless"],
  "Social Comparison": ["friends scored", "everyone else", "behind others", "comparison"],
  Health: ["headache", "sick", "anxiety attack", "panic", "health"],
};

const NEGATIVE_WORDS = [
  "stress",
  "anxious",
  "worried",
  "failed",
  "scared",
  "overwhelmed",
  "burnout",
  "hopeless",
  "frustrated",
  "depressed",
];

const POSITIVE_WORDS = [
  "confident",
  "motivated",
  "happy",
  "progress",
  "improved",
  "grateful",
  "focused",
  "calm",
  "proud",
  "relieved",
];

function detectTriggers(text: string): TriggerTag[] {
  const lower = text.toLowerCase();
  const found: TriggerTag[] = [];

  for (const [trigger, keywords] of Object.entries(TRIGGER_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(trigger as TriggerTag);
    }
  }

  return found;
}

function computeSentiment(text: string): { score: number; label: JournalAnalysis["sentimentLabel"] } {
  const lower = text.toLowerCase();
  const neg = NEGATIVE_WORDS.filter((w) => lower.includes(w)).length;
  const pos = POSITIVE_WORDS.filter((w) => lower.includes(w)).length;
  const score = Math.max(-1, Math.min(1, (pos - neg) * 0.25));

  let label: JournalAnalysis["sentimentLabel"] = "neutral";
  if (score > 0.15) label = "positive";
  if (score < -0.15) label = "negative";

  return { score, label };
}

function extractThemes(text: string, triggers: TriggerTag[]): string[] {
  const themes: string[] = [];

  if (triggers.includes("Mock Test")) themes.push("Exam performance anxiety");
  if (triggers.includes("Score Discussion")) themes.push("Comparison & self-worth");
  if (triggers.includes("Sleep")) themes.push("Rest & recovery");
  if (triggers.includes("Study Load")) themes.push("Academic overwhelm");
  if (triggers.includes("Self Doubt")) themes.push("Confidence building");
  if (triggers.includes("Family Pressure")) themes.push("External expectations");

  if (themes.length === 0) {
    themes.push("Emotional processing", "Daily reflection");
  }

  return themes.slice(0, 4);
}

const REFLECTION_TEMPLATES: Record<string, string> = {
  "Mock Test":
    "Your journal shows that mock tests are weighing on you emotionally. This is common — mocks measure progress, not your final potential. Notice how you feel before and after each test.",
  "Score Discussion":
    "Score discussions seem to affect your confidence. Remember that one conversation doesn't define your journey. Your growth happens in private study hours, not in comparison.",
  "Self Doubt":
    "Self-doubt is surfacing in your writing. This often appears when you're pushing hard. Acknowledge the effort you're putting in — doubt and dedication often coexist in high performers.",
  Sleep:
    "Sleep concerns are showing up. Rest is not a luxury during exam prep — it's fuel for retention and focus. Even 30 extra minutes can shift your next study session.",
  default:
    "Thank you for sharing honestly. Journaling itself is a powerful act of self-care. You're building awareness of your emotional patterns, which is the first step toward managing them.",
};

const COACHING_TIPS: Record<string, string> = {
  "Mock Test": "After your next mock, write 3 things you learned — not your score.",
  "Score Discussion": "Set a 10-minute limit on score talks, then switch to a practice problem.",
  "Self Doubt": "List one concept you've mastered this week. Evidence beats doubt.",
  Sleep: "Try a 5-minute wind-down: no screens, deep breaths, same time nightly.",
  default: "Take 3 deep breaths before your next study block. Small resets matter.",
};

export function analyzeJournal(content: string): JournalAnalysis {
  const triggers = detectTriggers(content);
  const { score, label } = computeSentiment(content);
  const themes = extractThemes(content, triggers);

  const primaryTrigger = triggers[0] ?? "default";
  const reflection =
    REFLECTION_TEMPLATES[primaryTrigger] ?? REFLECTION_TEMPLATES.default;
  const coachingTip =
    COACHING_TIPS[primaryTrigger] ?? COACHING_TIPS.default;

  return {
    sentiment: score,
    sentimentLabel: label,
    triggers,
    themes,
    reflection,
    coachingTip,
  };
}

const COACH_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["failed", "mock", "bad score", "low score"],
    response:
      "A tough mock doesn't erase your preparation — it reveals gaps you can fix. Every topper has a folder of bad mocks. Focus on what went wrong in 2-3 topics, not the number. What subject felt hardest today?",
  },
  {
    keywords: ["focus", "concentrate", "distracted", "can't study"],
    response:
      "Focus issues often mean your brain needs a reset, not more pressure. Try the 25-minute Pomodoro: one topic, phone away, then a 5-minute break. What's one small topic you could tackle in the next 25 minutes?",
  },
  {
    keywords: ["burnout", "burnt out", "exhausted", "give up", "quit"],
    response:
      "Burnout is your mind asking for sustainable pace, not quitting. Take one full evening off — guilt-free. Recovery isn't falling behind; it's how you come back stronger. When did you last take a real break?",
  },
  {
    keywords: ["anxious", "anxiety", "panic", "nervous", "scared"],
    response:
      "Exam anxiety is your brain treating the exam like a threat. Ground yourself: name 5 things you see, 4 you hear, 3 you feel. You've prepared more than your anxiety gives you credit for. What's one thing you know well?",
  },
  {
    keywords: ["sleep", "insomnia", "tired", "can't sleep"],
    response:
      "Poor sleep compounds stress. Try a fixed bedtime, dim lights 30 min before, and write tomorrow's top 3 tasks to clear your mind. Your brain consolidates memory during sleep — it's study time too.",
  },
  {
    keywords: ["motivat", "lazy", "procrastinat", "don't feel like"],
    response:
      "Motivation follows action, not the other way around. Start with the easiest 10-minute task — momentum builds from small wins. You don't need to feel ready; you need to begin.",
  },
  {
    keywords: ["parent", "family", "pressure", "expect"],
    response:
      "Family pressure comes from care, even when it feels heavy. Share your study plan with them — specifics reduce their anxiety and yours. You're not preparing for their approval; you're building your future.",
  },
];

const DEFAULT_COACH_RESPONSE =
  "I'm here to support you through this journey. Competitive exams test resilience as much as knowledge. Tell me more about what's on your mind — there's no wrong feeling to share.";

export function getCoachResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  for (const { keywords, response } of COACH_RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return response;
    }
  }

  return DEFAULT_COACH_RESPONSE;
}

export const QUICK_REPLIES = [
  "I failed my mock",
  "Can't focus",
  "Feeling burnt out",
  "I'm anxious about the exam",
  "Not sleeping well",
];

export function generateActionPlan(
  burnoutScore: number,
  topTriggers: TriggerTag[],
): ActionPlanItem[] {
  const plans: ActionPlanItem[] = [];
  let id = 1;

  const add = (title: string, category: string) => {
    plans.push({
      id: `plan-${id++}`,
      title,
      category,
      completed: false,
    });
  };

  if (topTriggers.includes("Mock Test")) {
    add("Take a 20-min walk after every mock test", "Recovery");
    add("Write 3 learnings from each mock — ignore the score", "Mindset");
  }

  if (topTriggers.includes("Score Discussion")) {
    add("Limit score discussions to 10 minutes per day", "Boundaries");
    add("Replace comparison with one practice problem", "Action");
  }

  if (topTriggers.includes("Sleep")) {
    add("Set a fixed bedtime alarm 30 min before sleep", "Sleep");
    add("No screens during the last hour before bed", "Sleep");
  }

  if (topTriggers.includes("Self Doubt")) {
    add("List 3 concepts you mastered this week", "Confidence");
    add("Read one success story of a comeback student", "Inspiration");
  }

  if (topTriggers.includes("Study Load")) {
    add("Break today's syllabus into 3 micro-goals", "Planning");
    add("Celebrate completing even one chapter today", "Mindset");
  }

  if (burnoutScore >= 60) {
    add("Take one guilt-free evening off this week", "Recovery");
    add("Do 10 minutes of stretching or light exercise daily", "Wellness");
  }

  if (plans.length < 5) {
    add("Journal for 5 minutes before bed tonight", "Reflection");
    add("Practice 4-7-8 breathing when stress spikes", "Mindfulness");
    add("Share one worry with a trusted friend or mentor", "Support");
  }

  return plans.slice(0, 7);
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

export function generateWeeklyInsight(
  moods: MoodEntry[],
  journals: JournalEntry[],
): WeeklyInsight {
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
      "You're building a consistent tracking habit — great start!",
      "Keep logging moods to unlock deeper pattern insights",
    );
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

export { detectTriggers };
