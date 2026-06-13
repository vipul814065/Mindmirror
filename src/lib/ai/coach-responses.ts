import type { ExamType } from "@/types/wellness";
import { validateAIOutput } from "@/lib/ai/safety";

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

const EXAM_SPECIFIC_PREFIX: Partial<Record<ExamType, string>> = {
  JEE: "For JEE prep: ",
  NEET: "For NEET prep: ",
  UPSC: "For UPSC prep: ",
  CAT: "For CAT prep: ",
  CUET: "For CUET prep: ",
};

const DEFAULT_COACH_RESPONSE =
  "I'm here to support you through this journey. Competitive exams test resilience as much as knowledge. Tell me more about what's on your mind — there's no wrong feeling to share.";

export const QUICK_REPLIES = [
  "I failed my mock",
  "Can't focus",
  "Feeling burnt out",
  "I'm anxious about the exam",
  "Not sleeping well",
];

export function getCoachResponse(userMessage: string, examType?: ExamType): string {
  const lower = userMessage.toLowerCase();

  for (const { keywords, response } of COACH_RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const prefix = examType ? (EXAM_SPECIFIC_PREFIX[examType] ?? "") : "";
      return validateAIOutput(`${prefix}${response}`);
    }
  }

  return validateAIOutput(DEFAULT_COACH_RESPONSE);
}
