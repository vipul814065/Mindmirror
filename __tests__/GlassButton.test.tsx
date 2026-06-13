import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GlassButton } from "@/components/ui/GlassButton";

describe("GlassButton", () => {
  it("renders children", () => {
    render(<GlassButton>Click me</GlassButton>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<GlassButton onClick={onClick}>Go</GlassButton>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <GlassButton disabled onClick={onClick}>
        Go
      </GlassButton>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports variant classes", () => {
    render(<GlassButton variant="outline">Outline</GlassButton>);
    expect(screen.getByRole("button")).toHaveClass("border");
  });
});
