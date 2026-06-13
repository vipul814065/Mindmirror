import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChallengeRequirementsCoverage } from "@/components/ui/ChallengeRequirementsCoverage";
import { AppProvider } from "@/hooks/useAppStore";
import { CHALLENGE_REQUIREMENTS } from "@/lib/pitch/challenge-requirements";

describe("ChallengeRequirementsCoverage", () => {
  it("renders all 12 challenge requirements", () => {
    render(
      <AppProvider>
        <ChallengeRequirementsCoverage />
      </AppProvider>,
    );
    expect(screen.getByText("Challenge Requirements Coverage")).toBeInTheDocument();
    for (const req of CHALLENGE_REQUIREMENTS) {
      expect(screen.getByText(req.label)).toBeInTheDocument();
    }
  });
});
