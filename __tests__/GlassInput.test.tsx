import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassInput } from "@/components/ui/GlassInput";

describe("GlassInput", () => {
  it("renders label and input", () => {
    render(<GlassInput label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows error with aria-invalid", () => {
    render(<GlassInput label="Name" error="Required field" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required field");
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-describedby", "name-error");
  });
});
