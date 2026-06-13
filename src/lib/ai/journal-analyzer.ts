import type { JournalAnalysis, TriggerTag } from "@/types/wellness";
import { sanitizeUserInput, validateAIOutput } from "@/lib/ai/safety";

export const TRIGGER_KEYWORDS: Record<TriggerTag, string[]> = {
  "Mock Test": [
    "mock test",
    "mock exam",
    "practice test",
    "test series",
    "failed my mock",
    "mock test results",
  ],
  "Score Discussion": ["score", "rank", "percentile", "result discussion", "compared scores"],
  Sleep: ["sleep", "insomnia", "tired", "exhausted", "can't sleep", "fatigue"],
  "Study Load": [
    "syllabus",
    "backlog",
    "too much to study",
    "overwhelmed",
    "chapters pending",
    "8 hours",
    "studied for",
    "hours today",
  ],
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
  "Study Load":
    "Long study sessions are showing up alongside emotional strain. Volume without recovery can amplify anxiety — quality and rest matter as much as hours logged.",
  default:
    "Thank you for sharing honestly. Journaling itself is a powerful act of self-care. You're building awareness of your emotional patterns, which is the first step toward managing them.",
};

const COACHING_TIPS: Record<string, string> = {
  "Mock Test": "After your next mock, write 3 things you learned — not your score.",
  "Score Discussion": "Set a 10-minute limit on score talks, then switch to a practice problem.",
  "Self Doubt": "List one concept you've mastered this week. Evidence beats doubt.",
  Sleep: "Try a 5-minute wind-down: no screens, deep breaths, same time nightly.",
  "Study Load": "After long study blocks, take a 10-minute walk before reviewing results.",
  default: "Take 3 deep breaths before your next study block. Small resets matter.",
};

const RECOMMENDATIONS: Record<string, string> = {
  "Mock Test":
    "Schedule a 15-minute debrief after your next mock focused on topic gaps, not rank.",
  "Score Discussion":
    "Mute score-comparison chats for 24 hours and log one personal win instead.",
  "Self Doubt":
    "Write a 'proof list' of 3 concepts you've improved this week before bed.",
  Sleep: "Set a fixed wind-down alarm 30 minutes before your target bedtime tonight.",
  "Study Load":
    "Cap today's study at 6 focused hours with two 10-minute breaks to reduce burnout risk.",
  default: "Log your mood after your next study block to track what pace works best.",
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

function sentimentToMoodScore(sentiment: number): number {
  return Math.max(1, Math.min(5, Math.round(((sentiment + 1) / 2) * 4) + 1));
}

function computeStressLevel(text: string, triggers: TriggerTag[]): JournalAnalysis["stressLevel"] {
  const lower = text.toLowerCase();
  const negCount = NEGATIVE_WORDS.filter((w) => lower.includes(w)).length;
  const score = negCount + triggers.length * 0.5;
  if (score >= 2.5) return "High";
  if (score >= 1) return "Medium";
  return "Low";
}

function computeBurnoutRisk(text: string, triggers: TriggerTag[], sentiment: number): number {
  const lower = text.toLowerCase();
  let risk = 30;
  if (lower.includes("8 hours") || lower.includes("studied for") || triggers.includes("Study Load")) {
    risk += 25;
  }
  if (lower.includes("anxious") || lower.includes("exhausted") || lower.includes("burnout")) {
    risk += 20;
  }
  if (triggers.includes("Mock Test")) risk += 15;
  if (sentiment < -0.15) risk += 10;
  return Math.min(100, Math.max(0, risk));
}

function computeConfidenceScore(text: string, sentiment: number): number {
  const lower = text.toLowerCase();
  let confidence = 70 + sentiment * 20;
  if (TRIGGER_KEYWORDS["Self Doubt"].some((kw) => lower.includes(kw))) confidence -= 25;
  if (lower.includes("anxious") || lower.includes("worried")) confidence -= 15;
  if (lower.includes("confident") || lower.includes("motivated")) confidence += 15;
  return Math.min(100, Math.max(0, Math.round(confidence)));
}

function buildTriggerSummary(triggers: TriggerTag[], text: string): string {
  if (triggers.length === 0) {
    return "No dominant stress triggers detected — general emotional processing noted.";
  }
  const lower = text.toLowerCase();
  const hasLongStudy = lower.includes("8 hours") || lower.includes("studied for");
  if (triggers.includes("Mock Test") && hasLongStudy) {
    return "Hidden trigger: Mock Test anxiety after long study sessions — effort without emotional recovery.";
  }
  return `Primary trigger detected: ${triggers[0]}${triggers.length > 1 ? ` (+${triggers.length - 1} more)` : ""}.`;
}

function buildAiReasoning(
  triggers: TriggerTag[],
  sentiment: number,
  text: string,
  stressLevel: JournalAnalysis["stressLevel"],
): string {
  const markerCount =
    NEGATIVE_WORDS.filter((w) => text.toLowerCase().includes(w)).length +
    POSITIVE_WORDS.filter((w) => text.toLowerCase().includes(w)).length;
  const triggerList = triggers.length > 0 ? triggers.join(", ") : "general wellness markers";
  const moodDesc = sentiment < -0.15 ? "elevated anxiety" : sentiment > 0.15 ? "positive momentum" : "mixed emotions";
  const studyNote = text.toLowerCase().includes("8 hours")
    ? " Long study sessions combined with mock anxiety suggest diminishing returns without recovery breaks."
    : "";
  return validateAIOutput(
    `Detected ${triggers.length} trigger(s) (${triggerList}) after analyzing ${markerCount} emotional markers. ` +
      `Current mood signals show ${moodDesc} with ${stressLevel.toLowerCase()} stress.${studyNote} ` +
      `Recommendation prioritizes sustainable pacing over raw study hours.`,
  );
}

function extractThemes(_text: string, triggers: TriggerTag[]): string[] {
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
  const moodScore = sentimentToMoodScore(score);
  const stressLevel = computeStressLevel(sanitized, triggers);
  const burnoutRiskPercent = computeBurnoutRisk(sanitized, triggers, score);
  const confidenceScore = computeConfidenceScore(sanitized, score);
  const triggerSummary = buildTriggerSummary(triggers, sanitized);

  const primaryTrigger = triggers[0] ?? "default";
  const reflection = validateAIOutput(
    REFLECTION_TEMPLATES[primaryTrigger] ?? REFLECTION_TEMPLATES.default,
  );
  const coachingTip = validateAIOutput(
    COACHING_TIPS[primaryTrigger] ?? COACHING_TIPS.default,
  );
  const recommendation = validateAIOutput(
    RECOMMENDATIONS[primaryTrigger] ?? RECOMMENDATIONS.default,
  );
  const aiReasoning = buildAiReasoning(triggers, score, sanitized, stressLevel);

  return {
    sentiment: score,
    sentimentLabel: label,
    moodScore,
    stressLevel,
    burnoutRiskPercent,
    confidenceScore,
    triggers,
    themes,
    triggerSummary,
    reflection,
    coachingTip,
    recommendation,
    aiReasoning,
  };
}
