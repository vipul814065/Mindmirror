import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadAppData,
  saveAppData,
  clearAppData,
  getDefaultData,
  exportAppData,
  importAppData,
  StorageError,
  ImportError,
} from "@/lib/storage/local-store";
import type { AppData } from "@/types/wellness";

describe("local-store", () => {
  beforeEach(() => {
    clearAppData();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("returns default data when storage is empty", () => {
    const data = loadAppData();
    expect(data.moods).toEqual([]);
    expect(data.settings.examType).toBe("JEE");
  });

  it("persists and loads valid data", () => {
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

  it("returns defaults on corrupt JSON", () => {
    localStorage.setItem("mindmirror-data", "{ not valid json");
    const data = loadAppData();
    expect(data.moods).toEqual([]);
  });

  it("returns defaults when stored data fails validation", () => {
    localStorage.setItem(
      "mindmirror-data",
      JSON.stringify({ moods: "not-an-array", settings: { examType: "JEE", userName: "X" } }),
    );
    const data = loadAppData();
    expect(data.moods).toEqual([]);
    expect(data.settings.userName).toBe("Student");
  });

  it("throws StorageError on quota exceeded", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      const error = new DOMException("QuotaExceededError");
      error.name = "QuotaExceededError";
      throw error;
    });

    expect(() => saveAppData(getDefaultData())).toThrow(StorageError);
    setItem.mockRestore();
  });

  it("export and import round-trip", () => {
    const data: AppData = {
      ...getDefaultData(),
      settings: { examType: "UPSC", userName: "RoundTrip" },
    };
    const json = exportAppData(data);
    const imported = importAppData(json);
    expect(imported.settings.examType).toBe("UPSC");
    expect(imported.settings.userName).toBe("RoundTrip");
  });

  it("rejects oversized import", () => {
    const huge = "x".repeat(513 * 1024);
    expect(() => importAppData(huge)).toThrow(ImportError);
  });

  it("rejects invalid JSON on import", () => {
    expect(() => importAppData("{ bad")).toThrow(ImportError);
  });

  it("throws generic StorageError on save failure", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Unknown error");
    });

    expect(() => saveAppData(getDefaultData())).toThrow("Failed to save data");
    setItem.mockRestore();
  });
});
