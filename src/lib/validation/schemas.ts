import { z } from "zod";

export const moodLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const triggerTagSchema = z.enum([
  "Mock Test",
  "Score Discussion",
  "Sleep",
  "Study Load",
  "Family Pressure",
  "Self Doubt",
  "Social Comparison",
  "Health",
]);

export const moodEntrySchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mood: moodLevelSchema,
  note: z.string().max(500).optional(),
  triggers: z.array(triggerTagSchema).max(8),
});

export const journalEntrySchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  content: z.string().min(10, "Journal must be at least 10 characters").max(5000),
  analysis: z
    .object({
      sentiment: z.number().min(-1).max(1),
      sentimentLabel: z.enum(["positive", "neutral", "negative"]),
      triggers: z.array(triggerTagSchema),
      themes: z.array(z.string()),
      reflection: z.string(),
      coachingTip: z.string(),
    })
    .optional(),
});

export const coachMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
  timestamp: z.string(),
});

export const actionPlanItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(200),
  category: z.string().min(1),
  completed: z.boolean(),
});

export const appSettingsSchema = z.object({
  examType: z.enum(["JEE", "NEET", "UPSC", "CAT", "CUET"]),
  userName: z.string().min(1).max(50),
  age: z.number().min(10).max(99).optional(),
  goal: z.string().max(100).optional(),
  studyHoursPerDay: z.number().min(0).max(24).optional(),
  streakDays: z.number().min(0).max(9999).optional(),
});

export const demoAnalyticsSchema = z.object({
  wellnessScore: z.number().min(0).max(100),
  burnoutRiskPercent: z.number().min(0).max(100),
  focusScore: z.number().min(0).max(100),
  stressLevel: z.enum(["Low", "Medium", "High"]),
  sleepQuality: z.number().min(0).max(10),
  confidenceScore: z.number().min(0).max(100),
  moodTrend30Day: z.array(
    z.object({
      date: z.string(),
      mood: z.number().min(1).max(5),
      label: z.string().optional(),
    }),
  ),
  burnoutHistory: z.array(z.object({ date: z.string(), score: z.number() })),
  weeklyProductivity: z.array(z.object({ week: z.string(), score: z.number() })),
  sleepPerformance: z.array(
    z.object({ date: z.string(), sleep: z.number(), performance: z.number() }),
  ),
  confidenceGrowth: z.array(z.object({ date: z.string(), score: z.number() })),
  studyHoursHeatmap: z.array(z.object({ date: z.string(), hours: z.number() })),
  stressTriggerBreakdown: z.array(
    z.object({ trigger: z.string(), percentage: z.number() }),
  ),
  weeklyProgress: z.object({
    studyHours: z.number(),
    completedTopics: z.number(),
    mockTests: z.number(),
    stressReduction: z.number(),
    confidenceGrowth: z.number(),
  }),
  aiInsights: z.array(z.string()),
  recommendations: z.array(z.string()),
  notifications: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      message: z.string(),
      time: z.string(),
      read: z.boolean(),
    }),
  ),
  activityFeed: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      message: z.string(),
      time: z.string(),
    }),
  ),
});

export const appDataSchema = z.object({
  moods: z.array(moodEntrySchema).max(1000),
  journals: z.array(journalEntrySchema).max(500),
  coachMessages: z.array(coachMessageSchema).max(200),
  actionPlan: z.array(actionPlanItemSchema).max(50),
  settings: appSettingsSchema,
  analytics: demoAnalyticsSchema.optional(),
});

export type MoodEntryInput = z.infer<typeof moodEntrySchema>;
export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
export type CoachMessageInput = z.infer<typeof coachMessageSchema>;
export type AppDataInput = z.infer<typeof appDataSchema>;
