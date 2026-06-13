import { describe, it, expect, beforeEach } from "vitest";
import { loadAppData, saveAppData, clearAppData, getDefaultData } from "@/lib/storage/local-store";
import type { AppData } from "@/types/wellness";

describe("local-store", () => {
  beforeEach(() => {
    clearAppData();
  });

  it("returns default data when storage is empty", () => {
    const data = loadAppData();
    expect(data.moods).toEqual([]);
    expect(data.settings.examType).toBe("JEE");
  });

  it("persists and loads data", () => {
    const data: AppData = {
      ...getDefaultData(),
      settings: { examType: "NEET", userName: "TestUser" },
    };
    saveAppData(data);
    const loaded = loadAppData();
    expect(loaded.settings.examType).toBe("NEET");
    expect(loaded.settings.userName).toBe("TestUser");
  });

  it("clears data", () => {
    saveAppData(getDefaultData());
    clearAppData();
    expect(localStorage.getItem("mindmirror-data")).toBeNull();
  });
});
