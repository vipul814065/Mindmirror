import type {
  ActionPlanItem,
  AppSettings,
  CoachMessage,
  JournalEntry,
  MoodEntry,
  MoodLevel,
  TriggerTag,
} from "@/types/wellness";
import { analyzeJournal } from "@/lib/ai/mock-engine";
import { daysAgo, daysAgoISO, makeId, getWeekday } from "@/lib/demo/helpers";
import { generateAaravAnalytics } from "@/lib/demo/aarav-analytics";

const CURRENT_WEEK_MOODS: Record<number, { mood: MoodLevel; label: string; note: string; triggers: TriggerTag[] }> = {
  1: { mood: 5, label: "Motivated", note: "Strong start to the week", triggers: [] },
  2: { mood: 4, label: "Focused", note: "Deep work on Mechanics", triggers: [] },
  3: { mood: 2, label: "Anxious", note: "Mock test anxiety building", triggers: ["Mock Test", "Self Doubt"] },
  4: { mood: 4, label: "Productive", note: "Good revision session", triggers: [] },
  5: { mood: 5, label: "Confident", note: "Feeling prepared", triggers: [] },
  6: { mood: 3, label: "Slightly Stressed", note: "Weekend mock pressure", triggers: ["Mock Test", "Study Load"] },
  0: { mood: 4, label: "Relaxed", note: "Light revision day", triggers: [] },
};

function generate30DayMoods(): MoodEntry[] {
  const moods: MoodEntry[] = [];
  let id = 1;

  for (let daysBack = 29; daysBack >= 0; daysBack--) {
    const date = daysAgo(daysBack);
    const weekday = getWeekday(date);

    if (daysBack <= 6) {
      const week = CURRENT_WEEK_MOODS[weekday];
      moods.push({
        id: makeId("mood", id++),
        date,
        mood: week.mood,
        note: week.note,
        triggers: week.triggers,
      });
      continue;
    }

    const mockDay = daysBack % 7 === 3 || daysBack % 7 === 6;
    const recoveryDay = daysBack % 7 === 4 || daysBack % 7 === 0;

    let mood: MoodLevel;
    let triggers: TriggerTag[] = [];
    let note: string;

    if (mockDay) {
      mood = daysBack % 14 === 3 ? 2 : 3;
      triggers = ["Mock Test"];
      note = mood === 2 ? "Mock didn't go well" : "Mock stress but manageable";
    } else if (recoveryDay) {
      mood = 4;
      note = "Recovering after mock";
    } else if (daysBack % 11 === 0) {
      mood = 2;
      triggers = ["Social Comparison", "Score Discussion"];
      note = "Compared scores with friends";
    } else if (daysBack % 9 === 0) {
      mood = 3;
      triggers = ["Family Pressure"];
      note = "Parents asked about progress";
    } else if (daysBack % 5 === 0) {
      mood = 5;
      note = "Great study day";
    } else {
      mood = (3 + (daysBack % 3)) as MoodLevel;
      note = mood >= 4 ? "Steady progress" : "Average day";
    }

    moods.push({ id: makeId("mood", id++), date, mood, note, triggers });
  }

  return moods;
}

const JOURNAL_CONTENTS: { daysBack: number; content: string }[] = [
  {
    daysBack: 0,
    content:
      "I completed Physics revision today but felt nervous during mock test analysis. The mechanics section went okay but I lost marks on rotational dynamics. Need to review those mistakes calmly instead of panicking about the score.",
  },
  {
    daysBack: 1,
    content:
      "Feeling pressure because my friends are scoring higher marks. One friend got 280/300 and I got 245. It's hard not to compare but I know everyone has different trajectories. Parents were supportive though.",
  },
  {
    daysBack: 2,
    content:
      "Had a productive study session and finally understood Organic Chemistry concepts. The SN1/SN2 reactions finally clicked after watching a video and doing 20 problems. Feeling motivated to tackle more chapters tomorrow.",
  },
  {
    daysBack: 4,
    content:
      "Today's mock test went terribly. I couldn't solve half the physics section. Everyone else seems to be scoring better. I feel like I'm not good enough for JEE. Maybe I should give up.",
  },
  {
    daysBack: 5,
    content:
      "Had a long score discussion with friends after the mock. My percentile dropped and I felt my confidence shatter. Parents asked about results too. Couldn't sleep well last night.",
  },
  {
    daysBack: 7,
    content:
      "Another mock test today. Stress levels were high before the exam. Self-doubt crept in during the paper. Need to find a better way to handle mock test anxiety. Did breathing exercises after — helped a little.",
  },
  {
    daysBack: 9,
    content:
      "Slept only 5 hours last night because I was revising till 1 AM. Felt exhausted during today's study session. Productivity was low. I need to sleep before 11 PM as my coach suggested.",
  },
  {
    daysBack: 11,
    content:
      "Completed Coordinate Geometry revision — all 4 chapters done. Confidence is building in maths. Still worried about calculus integration though. One step at a time.",
  },
  {
    daysBack: 13,
    content:
      "Mom asked about my mock scores again. I know she cares but the pressure makes me anxious. Tried explaining my study plan to her. She seemed to understand better this time.",
  },
  {
    daysBack: 15,
    content:
      "Feeling a bit better today. Managed to complete organic chemistry revision. Still anxious about the next mock but trying to stay motivated. Progress feels slow but real.",
  },
  {
    daysBack: 17,
    content:
      "Time management is my biggest challenge. I planned 8 topics but only finished 5. Need to be more realistic with daily goals. The backlog is stressing me out.",
  },
  {
    daysBack: 19,
    content:
      "Great day! Solved 40 problems in Physical Chemistry. My focus was sharp after a good night's sleep. Sleep quality really does impact my next-day productivity.",
  },
  {
    daysBack: 21,
    content:
      "Mock test series result came out. Rank dropped by 200. Feeling overwhelmed by the syllabus still pending. But I reviewed my mistakes and found 3 silly errors I can fix.",
  },
  {
    daysBack: 24,
    content:
      "Took a half-day break to recharge. Watched a movie and went for a walk. Came back feeling refreshed. Sometimes rest is the most productive thing you can do during JEE prep.",
  },
  {
    daysBack: 27,
    content:
      "Started my 42-day study streak today! Small win but it feels good to be consistent. Aiming to maintain this through the next mock cycle. Discipline over motivation.",
  },
];

function generateJournals(): JournalEntry[] {
  return JOURNAL_CONTENTS.map((j, i) => {
    const analysis = analyzeJournal(j.content);
    return {
      id: makeId("journal", i + 1),
      date: daysAgo(j.daysBack),
      content: j.content,
      analysis,
    };
  });
}

function generateCoachMessages(): CoachMessage[] {
  return [
    {
      id: "coach-1",
      role: "assistant",
      content:
        "Welcome to MindMirror, Aarav! I'm your AI wellness coach. I'm here to support you through your IIT-JEE 2027 journey. How are you feeling today?",
      timestamp: daysAgoISO(14),
    },
    {
      id: "coach-2",
      role: "user",
      content: "I failed my mock test again. Feeling really anxious about JEE.",
      timestamp: daysAgoISO(13),
    },
    {
      id: "coach-3",
      role: "assistant",
      content:
        "A tough mock doesn't erase your preparation — it reveals gaps you can fix. Every topper has a folder of bad mocks. Focus on what went wrong in 2-3 topics, not the number. What subject felt hardest today?",
      timestamp: daysAgoISO(13),
    },
    {
      id: "coach-4",
      role: "user",
      content: "Physics was the hardest. Also my friends scored much higher and it's affecting my confidence.",
      timestamp: daysAgoISO(10),
    },
    {
      id: "coach-5",
      role: "assistant",
      content:
        "Score discussions seem to affect your confidence. Remember that one conversation doesn't define your journey. Your growth happens in private study hours, not in comparison. Try limiting score talks to 10 minutes per day.",
      timestamp: daysAgoISO(10),
    },
    {
      id: "coach-6",
      role: "user",
      content: "I've been sleeping late and feeling tired. Can't focus during morning sessions.",
      timestamp: daysAgoISO(7),
    },
    {
      id: "coach-7",
      role: "assistant",
      content:
        "Poor sleep compounds stress. Try a fixed bedtime, dim lights 30 min before, and write tomorrow's top 3 tasks to clear your mind. Your brain consolidates memory during sleep — it's study time too. Aim for sleep before 11 PM tonight.",
      timestamp: daysAgoISO(7),
    },
    {
      id: "coach-8",
      role: "user",
      content: "Thanks. I'll try the breathing exercises before my next mock too.",
      timestamp: daysAgoISO(3),
    },
    {
      id: "coach-9",
      role: "assistant",
      content:
        "That's a great plan! After your next mock, write 3 things you learned — not your score. Small resets like a 10-minute breathing break can make a big difference. You've got this, Aarav.",
      timestamp: daysAgoISO(3),
    },
  ];
}

function generateActionPlan(): ActionPlanItem[] {
  return [
    { id: "plan-1", title: "Take a 10-minute breathing break", category: "Mindfulness", completed: true },
    { id: "plan-2", title: "Review mistakes instead of focusing on scores", category: "Mindset", completed: false },
    { id: "plan-3", title: "Sleep before 11 PM tonight", category: "Sleep", completed: false },
    { id: "plan-4", title: "Complete one easy topic to rebuild confidence", category: "Confidence", completed: true },
    { id: "plan-5", title: "Limit score discussions to 10 minutes per day", category: "Boundaries", completed: false },
    { id: "plan-6", title: "Write 3 learnings from each mock — ignore the score", category: "Recovery", completed: false },
  ];
}

export function createAaravSettings(): AppSettings {
  return {
    examType: "JEE",
    userName: "Aarav Sharma",
    age: 18,
    goal: "IIT-JEE 2027",
    studyHoursPerDay: 7.5,
    streakDays: 42,
  };
}

export function createAaravDemoData() {
  const moods = generate30DayMoods();
  const journals = generateJournals();
  const coachMessages = generateCoachMessages();
  const actionPlan = generateActionPlan();
  const settings = createAaravSettings();
  const analytics = generateAaravAnalytics(moods);

  return { moods, journals, coachMessages, actionPlan, settings, analytics };
}
