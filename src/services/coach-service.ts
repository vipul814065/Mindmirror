import { getCoachResponse as getCoachResponseImpl } from "@/lib/ai/coach-responses";
import type { ExamType } from "@/types/wellness";

export const coachService = {
  respond(content: string, examType: ExamType): string {
    return getCoachResponseImpl(content, examType);
  },
};
