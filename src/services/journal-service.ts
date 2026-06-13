import { analyzeJournal as analyzeJournalImpl } from "@/lib/ai/journal-analyzer";
import type { JournalAnalysis } from "@/types/wellness";

export const journalService = {
  analyze(content: string): JournalAnalysis {
    return analyzeJournalImpl(content);
  },
};
