import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JournalAnalysisPanel } from "@/components/journal/JournalAnalysisPanel";
import type { JournalAnalysis } from "@/types/wellness";

const sampleAnalysis: JournalAnalysis = {
  sentiment: -0.25,
  sentimentLabel: "negative",
  moodScore: 2,
  stressLevel: "High",
  burnoutRiskPercent: 65,
  confidenceScore: 45,
  triggers: ["Mock Test", "Study Load"],
  themes: ["Exam performance anxiety"],
  triggerSummary: "Hidden trigger: Mock Test anxiety after long study sessions",
  reflection: "Your journal shows mock test stress.",
  coachingTip: "Write 3 learnings after your mock.",
  recommendation: "Take a 10-minute break before reviewing results.",
  aiReasoning: "Detected 2 triggers after analyzing emotional markers.",
};

describe("JournalAnalysisPanel", () => {
  it("renders metric labels and mood score", () => {
    render(<JournalAnalysisPanel analysis={sampleAnalysis} />);
    expect(screen.getByText("AI Journal Analysis")).toBeInTheDocument();
    expect(screen.getByText("Mood Analysis")).toBeInTheDocument();
    expect(screen.getAllByText("2/5").length).toBeGreaterThan(0);
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("shows AI reasoning section", () => {
    render(<JournalAnalysisPanel analysis={sampleAnalysis} />);
    expect(screen.getByText("AI Reasoning")).toBeInTheDocument();
    expect(screen.getByText(/Detected 2 triggers/)).toBeInTheDocument();
  });

  it("shows loading skeleton when loading", () => {
    render(<JournalAnalysisPanel analysis={sampleAnalysis} loading />);
    expect(screen.getByText("AI Analysis")).toBeInTheDocument();
  });
});
