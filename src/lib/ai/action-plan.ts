import type { ActionPlanItem, TriggerTag } from "@/types/wellness";

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
