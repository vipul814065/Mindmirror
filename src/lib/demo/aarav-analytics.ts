import type { DemoAnalytics, MoodEntry } from "@/types/wellness";
import { daysAgo, getWeekday } from "@/lib/demo/helpers";

export function generateAaravAnalytics(moods: MoodEntry[]): DemoAnalytics {
  const moodTrend30Day = moods.map((m) => ({
    date: m.date,
    mood: m.mood,
    label: undefined as string | undefined,
  }));

  const burnoutHistory = Array.from({ length: 30 }, (_, i) => {
    const daysBack = 29 - i;
    const base = 35 - (29 - daysBack) * 0.24;
    const mockDip = daysBack % 7 === 3 ? 8 : daysBack % 7 === 4 ? 4 : 0;
    return {
      date: daysAgo(daysBack),
      score: Math.round(Math.max(22, Math.min(42, base + mockDip))),
    };
  });

  const weeklyProductivity = [
    { week: "May W2", score: 72 },
    { week: "May W3", score: 78 },
    { week: "May W4", score: 81 },
    { week: "Jun W1", score: 88 },
  ];

  const sleepPerformance = Array.from({ length: 14 }, (_, i) => {
    const daysBack = 13 - i;
    const sleep = Math.round((7.2 + Math.sin(i * 0.8) * 0.6 + (i % 3 === 0 ? -0.5 : 0)) * 10) / 10;
    const perf = Math.round(Math.min(92, Math.max(65, sleep * 10 + 15 + (i % 2 === 0 ? 5 : -3))));
    return { date: daysAgo(daysBack), sleep, performance: perf };
  });

  const confidenceGrowth = Array.from({ length: 30 }, (_, i) => {
    const daysBack = 29 - i;
    const base = 76 + (29 - daysBack) * 0.28;
    const mockDip = daysBack % 7 === 3 ? -6 : daysBack % 7 === 4 ? -3 : 0;
    return {
      date: daysAgo(daysBack),
      score: Math.round(Math.min(84, Math.max(72, base + mockDip))),
    };
  });

  const studyHoursHeatmap = Array.from({ length: 30 }, (_, i) => {
    const daysBack = 29 - i;
    const weekday = getWeekday(daysAgo(daysBack));
    const isSunday = weekday === 0;
    const base = isSunday ? 5.5 : 7.5;
    const variance = (daysBack % 5) * 0.4 - 0.8;
    return {
      date: daysAgo(daysBack),
      hours: Math.round((base + variance) * 10) / 10,
    };
  });

  return {
    wellnessScore: 82,
    burnoutRiskPercent: 28,
    focusScore: 88,
    stressLevel: "Medium",
    sleepQuality: 7.8,
    confidenceScore: 84,
    moodTrend30Day,
    burnoutHistory,
    weeklyProductivity,
    sleepPerformance,
    confidenceGrowth,
    studyHoursHeatmap,
    stressTriggerBreakdown: [
      { trigger: "Mock Test Results", percentage: 43 },
      { trigger: "Time Management", percentage: 24 },
      { trigger: "Parent Expectations", percentage: 18 },
      { trigger: "Peer Comparison", percentage: 15 },
    ],
    weeklyProgress: {
      studyHours: 52,
      completedTopics: 17,
      mockTests: 4,
      stressReduction: 12,
      confidenceGrowth: 8,
    },
    aiInsights: [
      "Mock tests are responsible for 43% of detected stress events.",
      "Confidence drops after comparing scores with peers.",
      "Focus levels increase after completing revision tasks.",
      "Sleep quality directly impacts next-day productivity.",
    ],
    recommendations: [
      "Take a 10-minute breathing break.",
      "Review mistakes instead of focusing on scores.",
      "Sleep before 11 PM tonight.",
      "Complete one easy topic to rebuild confidence.",
    ],
    notifications: [
      {
        id: "notif-1",
        title: "Streak Milestone",
        message: "42-day study streak achieved! Keep the momentum going.",
        time: "2h ago",
        read: false,
      },
      {
        id: "notif-2",
        title: "Mock Test Reminder",
        message: "Full syllabus mock test scheduled for tomorrow at 9 AM.",
        time: "5h ago",
        read: false,
      },
      {
        id: "notif-3",
        title: "Sleep Goal",
        message: "You slept 6.2h last night. Aim for 7+ hours tonight.",
        time: "Yesterday",
        read: true,
      },
      {
        id: "notif-4",
        title: "Weekly Insight Ready",
        message: "Your emotional wellness report for this week is available.",
        time: "Yesterday",
        read: true,
      },
      {
        id: "notif-5",
        title: "Confidence Boost",
        message: "Focus score up 8% this week after revision sessions.",
        time: "2 days ago",
        read: true,
      },
    ],
    activityFeed: [
      { id: "act-1", type: "study", message: "Completed Physics revision — Mechanics & Thermodynamics", time: "2h ago" },
      { id: "act-2", type: "mood", message: "Logged mood: Slightly Stressed (Mock Test trigger)", time: "3h ago" },
      { id: "act-3", type: "journal", message: "Journal entry analyzed — Mock test anxiety detected", time: "4h ago" },
      { id: "act-4", type: "mock", message: "Mock test score analyzed — 245/300 (Physics weak)", time: "Yesterday" },
      { id: "act-5", type: "study", message: "Organic Chemistry SN1/SN2 — 20 problems solved", time: "Yesterday" },
      { id: "act-6", type: "mood", message: "Logged mood: Confident", time: "Yesterday" },
      { id: "act-7", type: "coach", message: "Coach session — discussed sleep and mock anxiety", time: "2 days ago" },
      { id: "act-8", type: "study", message: "Coordinate Geometry revision completed (4 chapters)", time: "3 days ago" },
      { id: "act-9", type: "mood", message: "Logged mood: Anxious — Mock Test trigger", time: "4 days ago" },
      { id: "act-10", type: "plan", message: "Completed: Take a 10-minute breathing break", time: "4 days ago" },
      { id: "act-11", type: "study", message: "Physical Chemistry — 40 problems solved", time: "5 days ago" },
      { id: "act-12", type: "journal", message: "Journal entry — peer comparison stress noted", time: "6 days ago" },
      { id: "act-13", type: "milestone", message: "Study streak: 42 days and counting", time: "1 week ago" },
    ],
  };
}
