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
});

export type MoodEntryInput = z.infer<typeof moodEntrySchema>;
export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
export type CoachMessageInput = z.infer<typeof coachMessageSchema>;
