import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CoachChatWidget } from "@/components/coach/CoachChatWidget";
import { AppProvider } from "@/hooks/useAppStore";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("CoachChatWidget", () => {
  it("toggles open state and aria-expanded", () => {
    render(
      <AppProvider>
        <CoachChatWidget />
      </AppProvider>,
    );
    const toggle = screen.getByRole("button", { name: /Open coach chat/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /Minimize coach chat/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
