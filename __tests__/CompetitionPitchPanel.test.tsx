import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompetitionPitchPanel } from "@/components/ui/CompetitionPitchPanel";
import { AppProvider } from "@/hooks/useAppStore";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function renderWithApp(ui: React.ReactElement) {
  return render(<AppProvider>{ui}</AppProvider>);
}

describe("CompetitionPitchPanel", () => {
  it("renders pitch checklist and load sample button", async () => {
    renderWithApp(<CompetitionPitchPanel onLoadSample={vi.fn()} />);
    expect(screen.getByText("PromptWars Competition Pitch")).toBeInTheDocument();
    expect(screen.getByText("Load Sample Week")).toBeInTheDocument();
    expect(screen.getByText("AI journal analysis")).toBeInTheDocument();
  });

  it("calls onLoadSample when clicked", () => {
    const onLoadSample = vi.fn();
    renderWithApp(<CompetitionPitchPanel onLoadSample={onLoadSample} />);
    fireEvent.click(screen.getByText("Load Sample Week"));
    expect(onLoadSample).toHaveBeenCalledOnce();
  });
});
