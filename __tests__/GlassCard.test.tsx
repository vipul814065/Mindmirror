import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassCard } from "@/components/ui/GlassCard";

describe("GlassCard", () => {
  it("renders children", () => {
    render(<GlassCard>Hello MindMirror</GlassCard>);
    expect(screen.getByText("Hello MindMirror")).toBeInTheDocument();
  });

  it("applies aria-label when provided", () => {
    render(
      <GlassCard ariaLabel="Test card">
        Content
      </GlassCard>,
    );
    expect(screen.getByLabelText("Test card")).toBeInTheDocument();
  });
});
