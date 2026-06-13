import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/layout/PageHeader";

describe("PageHeader", () => {
  it("renders title as h1", () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<PageHeader title="Mood" description="Track daily mood" />);
    expect(screen.getByText("Track daily mood")).toBeInTheDocument();
  });
});
