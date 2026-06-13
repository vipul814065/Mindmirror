import type { AppData, AppSettings } from "@/types/wellness";
import { appDataSchema } from "@/lib/validation/schemas";

const STORAGE_KEY = "mindmirror-data";
const MAX_IMPORT_BYTES = 512 * 1024;

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

export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportError";
  }
}

export function getDefaultData(): AppData {
  return structuredClone(DEFAULT_DATA);
}

function validateAppData(data: unknown): AppData | null {
  const result = appDataSchema.safeParse(data);
  if (!result.success) return null;
  return result.data;
}

export function loadAppData(): AppData {
  if (typeof window === "undefined") {
    return getDefaultData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();

    const parsed = JSON.parse(raw) as unknown;
    const validated = validateAppData(parsed);
    if (validated) return validated;

    console.warn("MindMirror: stored data failed validation, using defaults.");
    return getDefaultData();
  } catch {
    return getDefaultData();
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === "undefined") return;

  const validated = validateAppData(data);
  if (!validated) {
    throw new StorageError("Data failed validation and could not be saved.");
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
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
  if (new TextEncoder().encode(json).length > MAX_IMPORT_BYTES) {
    throw new ImportError("Import file is too large. Maximum size is 512KB.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ImportError("Invalid JSON format.");
  }

  const validated = validateAppData(parsed);
  if (!validated) {
    throw new ImportError("Data file failed validation. Check the format.");
  }

  return validated;
}

export function clearAppData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
