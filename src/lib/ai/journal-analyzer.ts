import type { JournalAnalysis, TriggerTag } from "@/types/wellness";
import { sanitizeUserInput, validateAIOutput } from "@/lib/ai/safety";

export const TRIGGER_KEYWORDS: Record<TriggerTag, string[]> = {
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

export function detectTriggers(text: string): TriggerTag[] {
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

export function analyzeJournal(content: string): JournalAnalysis {
  const sanitized = sanitizeUserInput(content, 5000);
  const triggers = detectTriggers(sanitized);
  const { score, label } = computeSentiment(sanitized);
  const themes = extractThemes(sanitized, triggers);

  const primaryTrigger = triggers[0] ?? "default";
  const reflection = validateAIOutput(
    REFLECTION_TEMPLATES[primaryTrigger] ?? REFLECTION_TEMPLATES.default,
  );
  const coachingTip = validateAIOutput(
    COACHING_TIPS[primaryTrigger] ?? COACHING_TIPS.default,
  );

  return {
    sentiment: score,
    sentimentLabel: label,
    triggers,
    themes,
    reflection,
    coachingTip,
  };
}
