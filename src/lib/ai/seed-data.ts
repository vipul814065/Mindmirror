import type { AppData, MoodEntry, JournalEntry } from "@/types/wellness";
import { analyzeJournal } from "@/lib/ai/mock-engine";
import { generateActionPlan } from "@/lib/ai/mock-engine";
import { calculateBurnoutScore, getTopTriggers } from "@/lib/scoring/burnout";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function makeId(prefix: string, n: number): string {
  return `${prefix}-${n}`;
}

export function createSeedData(): AppData {
  const moods: MoodEntry[] = [
    { id: makeId("mood", 1), date: daysAgo(6), mood: 4, triggers: [], note: "Good study day" },
    { id: makeId("mood", 2), date: daysAgo(5), mood: 2, triggers: ["Mock Test", "Self Doubt"], note: "Mock didn't go well" },
    { id: makeId("mood", 3), date: daysAgo(4), mood: 2, triggers: ["Score Discussion", "Social Comparison"], note: "Compared scores with friends" },
    { id: makeId("mood", 4), date: daysAgo(3), mood: 3, triggers: ["Study Load"], note: "Feeling overwhelmed" },
    { id: makeId("mood", 5), date: daysAgo(2), mood: 3, triggers: [], note: "Recovering slowly" },
    { id: makeId("mood", 6), date: daysAgo(1), mood: 4, triggers: [], note: "Better today" },
    { id: makeId("mood", 7), date: daysAgo(0), mood: 3, triggers: ["Mock Test"], note: "Another mock today" },
  ];

  const journalContents = [
    {
      date: daysAgo(5),
      content:
        "Today's mock test went terribly. I couldn't solve half the physics section. Everyone else seems to be scoring better. I feel like I'm not good enough for JEE. Maybe I should give up.",
    },
    {
      date: daysAgo(4),
      content:
        "Had a long score discussion with friends after the mock. My percentile dropped and I felt my confidence shatter. Parents asked about results too. Couldn't sleep well last night.",
    },
    {
      date: daysAgo(2),
      content:
        "Feeling a bit better today. Managed to complete organic chemistry revision. Still anxious about the next mock but trying to stay motivated. Progress feels slow but real.",
    },
    {
      date: daysAgo(0),
      content:
        "Another mock test today. Stress levels were high before the exam. Self-doubt crept in during the paper. Need to find a better way to handle mock test anxiety.",
    },
  ];

  const journals: JournalEntry[] = journalContents.map((j, i) => {
    const analysis = analyzeJournal(j.content);
    return {
      id: makeId("journal", i + 1),
      date: j.date,
      content: j.content,
      analysis,
    };
  });

  const burnout = calculateBurnoutScore(moods, journals);
  const topTriggers = getTopTriggers(moods, journals);
  const actionPlan = generateActionPlan(burnout.score, topTriggers);

  return {
    moods,
    journals,
    coachMessages: [
      {
        id: "coach-1",
        role: "assistant",
        content:
          "Welcome to MindMirror! I'm your AI wellness coach. I'm here to support you through your exam preparation journey. How are you feeling today?",
        timestamp: new Date().toISOString(),
      },
    ],
    actionPlan,
    settings: {
      examType: "JEE",
      userName: "Student",
    },
  };
}
