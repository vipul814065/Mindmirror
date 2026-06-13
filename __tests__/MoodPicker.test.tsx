import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodPicker } from "@/components/ui/MoodPicker";

describe("MoodPicker", () => {
  it("renders all mood options with aria labels", () => {
    render(<MoodPicker value={null} onChange={() => {}} />);
    expect(screen.getByLabelText("Select your mood level from 1 to 5")).toBeInTheDocument();
    expect(screen.getByLabelText("Great, level 5 of 5")).toBeInTheDocument();
    expect(screen.getByLabelText("Struggling, level 1 of 5")).toBeInTheDocument();
  });

  it("calls onChange when mood is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<MoodPicker value={null} onChange={onChange} />);

    await user.click(screen.getByLabelText("Good, level 4 of 5"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("marks selected mood as checked", () => {
    render(<MoodPicker value={3} onChange={() => {}} />);
    expect(screen.getByLabelText("Okay, level 3 of 5")).toHaveAttribute("aria-checked", "true");
  });

  it("supports arrow key navigation", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<MoodPicker value={3} onChange={onChange} />);

    const okay = screen.getByLabelText("Okay, level 3 of 5");
    okay.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("supports home and end keys", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<MoodPicker value={3} onChange={onChange} />);

    const okay = screen.getByLabelText("Okay, level 3 of 5");
    okay.focus();
    await user.keyboard("{Home}");
    expect(onChange).toHaveBeenCalledWith(1);
    await user.keyboard("{End}");
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("getMoodDisplay returns mood metadata", async () => {
    const { getMoodDisplay } = await import("@/components/ui/MoodPicker");
    expect(getMoodDisplay(5).label).toBe("Great");
  });
});
