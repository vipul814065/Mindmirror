import type { AppData, AppSettings } from "@/types/wellness";

const STORAGE_KEY = "mindmirror-data";

const DEFAULT_SETTINGS: AppSettings = {
  examType: "JEE",
  userName: "Student",
};

const DEFAULT_DATA: AppData = {
  moods: [],
  journals: [],
  coachMessages: [],
  actionPlan: [],
  settings: DEFAULT_SETTINGS,
};

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export function getDefaultData(): AppData {
  return structuredClone(DEFAULT_DATA);
}

export function loadAppData(): AppData {
  if (typeof window === "undefined") {
    return getDefaultData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();

    const parsed = JSON.parse(raw) as AppData;
    return {
      ...getDefaultData(),
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    };
  } catch {
    return getDefaultData();
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.code === 22)
    ) {
      throw new StorageError(
        "Storage is full. Please export and clear old data.",
      );
    }
    throw new StorageError("Failed to save data. Please try again.");
  }
}

export function exportAppData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importAppData(json: string): AppData {
  const parsed = JSON.parse(json) as AppData;
  return {
    ...getDefaultData(),
    ...parsed,
    settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
  };
}

export function clearAppData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
