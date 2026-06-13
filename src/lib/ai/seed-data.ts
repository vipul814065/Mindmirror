import type { AppData } from "@/types/wellness";
import { createAaravDemoData } from "@/lib/demo/aarav-demo";

export function createSeedData(): AppData {
  const demo = createAaravDemoData();
  return {
    moods: demo.moods,
    journals: demo.journals,
    coachMessages: demo.coachMessages,
    actionPlan: demo.actionPlan,
    settings: demo.settings,
    analytics: demo.analytics,
  };
}
