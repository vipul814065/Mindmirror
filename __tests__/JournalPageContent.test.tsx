import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import JournalPageContent from "@/app/journal/JournalPageContent";
import { AppProvider } from "@/hooks/useAppStore";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("JournalPageContent", () => {
  it("blocks submit for short content", () => {
    render(
      <AppProvider>
        <JournalPageContent />
      </AppProvider>,
    );
    const analyzeBtn = screen.getByRole("button", { name: /Analyze Entry/i });
    expect(analyzeBtn).toBeDisabled();
  });

  it("loads demo entry text", () => {
    render(
      <AppProvider>
        <JournalPageContent />
      </AppProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Try demo entry/i }));
    expect(screen.getByLabelText(/Today's entry/i)).toHaveValue(
      "I studied for 8 hours today but I feel anxious about my mock test results.",
    );
  });
});
