import { generateActionPlan as generateActionPlanImpl } from "@/lib/ai/action-plan";
import type { TriggerTag, ActionPlanItem } from "@/types/wellness";

export const actionPlanService = {
  generate(burnoutScore: number, triggers: TriggerTag[]): ActionPlanItem[] {
    return generateActionPlanImpl(burnoutScore, triggers);
  },
};
