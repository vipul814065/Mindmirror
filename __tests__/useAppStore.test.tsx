import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AppProvider, useApp } from "@/hooks/useAppStore";
import { clearAppData, saveAppData, getDefaultData } from "@/lib/storage/local-store";
import { resetRateLimit } from "@/lib/rate-limit";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

describe("useAppStore", () => {
  beforeEach(() => {
    clearAppData();
    resetRateLimit();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("loads and exposes app data", async () => {
    const seed = getDefaultData();
    seed.settings.userName = "TestUser";
    seed.moods = [
      { id: "m1", date: "2026-06-13", mood: 4, triggers: [] },
    ];
    saveAppData(seed);

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.data.settings.userName).toBe("TestUser");
  });

  it("adds a valid mood entry", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addMood({
        date: "2026-06-13",
        mood: 4,
        triggers: ["Mock Test"],
      });
    });

    expect(result.current.data.moods.some((m) => m.mood === 4)).toBe(true);
  });

  it("rejects invalid mood with validation error", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    const before = result.current.data.moods.length;

    act(() => {
      result.current.addMood({
        date: "bad-date",
        mood: 4,
        triggers: [],
      });
    });

    expect(result.current.data.moods.length).toBe(before);
    expect(result.current.validationError).toBeTruthy();
  });

  it("adds journal with analysis", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addJournal(
        "I failed my mock test today and feel very anxious about the upcoming exam.",
      );
    });

    expect(result.current.data.journals.length).toBeGreaterThan(0);
    expect(result.current.data.journals[0].analysis).toBeDefined();
  });

  it("rejects short journal content", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addJournal("too short");
    });

    expect(result.current.validationError).toBeTruthy();
  });

  it("sends coach message and receives response", async () => {
    const data = getDefaultData();
    data.moods = [{ id: "m1", date: "2026-06-13", mood: 3, triggers: [] }];
    data.coachMessages = [];
    saveAppData(data);
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.sendCoachMessage("I failed my mock test");
    });

    expect(result.current.data.coachMessages.length).toBe(2);
    expect(result.current.data.coachMessages[1].role).toBe("assistant");
  });

  it("toggles action plan item", async () => {
    const data = getDefaultData();
    data.actionPlan = [{ id: "p1", title: "Walk", category: "Recovery", completed: false }];
    saveAppData(data);

    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.toggleActionItem("p1");
    });

    expect(result.current.data.actionPlan[0].completed).toBe(true);
  });

  it("updates settings with validation", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.updateSettings({ userName: "Aarav", examType: "NEET" });
    });

    expect(result.current.data.settings.userName).toBe("Aarav");
    expect(result.current.data.settings.examType).toBe("NEET");
  });

  it("rejects invalid settings", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.updateSettings({ userName: "" });
    });

    expect(result.current.validationError).toBeTruthy();
  });

  it("imports valid data", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    const payload = JSON.stringify({
      ...getDefaultData(),
      settings: { examType: "CAT", userName: "Imported" },
    });

    act(() => {
      result.current.importData(payload);
    });

    expect(result.current.data.settings.examType).toBe("CAT");
    expect(result.current.data.settings.userName).toBe("Imported");
  });

  it("sets storage error on invalid import", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.importData("{ invalid json");
    });

    expect(result.current.storageError).toBeTruthy();
  });

  it("clears all data", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.clearData();
    });

    expect(result.current.data.moods).toEqual([]);
  });

  it("computes burnout score", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.burnoutScore).toHaveProperty("score");
    expect(result.current.burnoutScore).toHaveProperty("riskLevel");
  });

  it("loads sample data", async () => {
    const data = getDefaultData();
    data.moods = [{ id: "m1", date: "2026-06-13", mood: 3, triggers: [] }];
    saveAppData(data);
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.loadSampleData();
    });

    expect(result.current.data.journals.length).toBeGreaterThan(0);
  });

  it("regenerates action plan", async () => {
    const data = getDefaultData();
    data.moods = [{ id: "m1", date: "2026-06-13", mood: 2, triggers: ["Mock Test"] }];
    saveAppData(data);
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.regenerateActionPlan();
    });

    expect(result.current.data.actionPlan.length).toBeGreaterThan(0);
  });

  it("clears validation error", async () => {
    saveAppData(getDefaultData());
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addJournal("short");
      result.current.clearValidationError();
    });

    expect(result.current.validationError).toBeNull();
  });

  it("blocks journal submissions when rate limited", async () => {
    const data = getDefaultData();
    data.moods = [{ id: "m1", date: "2026-06-13", mood: 3, triggers: [] }];
    saveAppData(data);
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    const entry =
      "This is a long enough journal entry to pass validation for rate limit testing purposes.";

    for (let i = 0; i < 11; i++) {
      act(() => {
        result.current.addJournal(`${entry} ${i}`);
      });
    }

    expect(result.current.validationError).toContain("wait");
  });

  it("blocks coach messages when rate limited", async () => {
    const data = getDefaultData();
    data.moods = [{ id: "m1", date: "2026-06-13", mood: 3, triggers: [] }];
    data.coachMessages = [];
    saveAppData(data);
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    for (let i = 0; i < 11; i++) {
      act(() => {
        result.current.sendCoachMessage(`Test message number ${i} for rate limit`);
      });
    }

    expect(result.current.validationError).toContain("wait");
  });

  it("surfaces storage error on save failure", async () => {
    const data = getDefaultData();
    data.moods = [{ id: "m1", date: "2026-06-13", mood: 3, triggers: [] }];
    saveAppData(data);
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      const error = new DOMException("QuotaExceededError", "QuotaExceededError");
      Object.assign(error, { code: 22, name: "QuotaExceededError" });
      throw error;
    });

    act(() => {
      result.current.addMood({
        date: "2026-06-14",
        mood: 4,
        triggers: [],
      });
    });

    expect(result.current.storageError).toBeTruthy();
    setItem.mockRestore();
  });
});
