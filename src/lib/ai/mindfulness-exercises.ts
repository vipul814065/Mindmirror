import type { TriggerTag } from "@/types/wellness";

export interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  steps: string[];
  durationMinutes: number;
  category: "Breathing" | "Grounding" | "Recovery";
}

const EXERCISES: MindfulnessExercise[] = [
  {
    id: "478-breathing",
    title: "4-7-8 Breathing",
    description: "Calm your nervous system before or after intense study blocks.",
    steps: [
      "Inhale through your nose for 4 seconds",
      "Hold your breath for 7 seconds",
      "Exhale slowly through your mouth for 8 seconds",
      "Repeat 4 cycles",
    ],
    durationMinutes: 3,
    category: "Breathing",
  },
  {
    id: "grounding-54321",
    title: "5-4-3-2-1 Grounding",
    description: "Reduce exam anxiety by anchoring to the present moment.",
    steps: [
      "Name 5 things you can see",
      "Name 4 things you can hear",
      "Name 3 things you can feel",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
    ],
    durationMinutes: 5,
    category: "Grounding",
  },
  {
    id: "study-break-breathing",
    title: "10-Minute Study Break Breathing",
    description: "Recovery break after long study sessions to prevent burnout.",
    steps: [
      "Step away from your desk",
      "Take 10 slow deep breaths with eyes closed",
      "Stretch your neck and shoulders for 2 minutes",
      "Drink water and return refreshed",
    ],
    durationMinutes: 10,
    category: "Recovery",
  },
  {
    id: "mock-test-calm",
    title: "Pre-Mock Calm Sequence",
    description: "Adaptive exercise for mock test anxiety.",
    steps: [
      "Acknowledge: 'This mock measures progress, not my worth'",
      "3 box breaths: inhale 4, hold 4, exhale 4",
      "Visualize completing one section calmly",
      "Begin when your shoulders feel relaxed",
    ],
    durationMinutes: 5,
    category: "Breathing",
  },
];

const TRIGGER_EXERCISE_MAP: Partial<Record<TriggerTag, string>> = {
  "Mock Test": "mock-test-calm",
  Sleep: "study-break-breathing",
  "Study Load": "study-break-breathing",
  Health: "478-breathing",
  "Self Doubt": "grounding-54321",
};

export function getAdaptiveExercises(
  triggers: TriggerTag[] = [],
  burnoutRiskPercent = 0,
): MindfulnessExercise[] {
  const selected = new Set<string>();

  for (const trigger of triggers) {
    const id = TRIGGER_EXERCISE_MAP[trigger];
    if (id) selected.add(id);
  }

  if (burnoutRiskPercent >= 60) {
    selected.add("study-break-breathing");
  }

  if (selected.size === 0) {
    selected.add("478-breathing");
    selected.add("grounding-54321");
  }

  return EXERCISES.filter((e) => selected.has(e.id));
}

export function getAllExercises(): MindfulnessExercise[] {
  return EXERCISES;
}
