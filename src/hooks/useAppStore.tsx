"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppData,
  CoachMessage,
  JournalEntry,
  MoodEntry,
} from "@/types/wellness";
import {
  getDefaultData,
  loadAppData,
  saveAppData,
  clearAppData,
  exportAppData,
  importAppData,
  StorageError,
  ImportError,
} from "@/lib/storage/local-store";
import { createSeedData } from "@/lib/ai/seed-data";
import {
  moodEntrySchema,
  journalEntrySchema,
  coachMessageSchema,
  appSettingsSchema,
} from "@/lib/validation/schemas";
import {
  analyzeJournal,
  getCoachResponse,
  generateActionPlan,
} from "@/lib/ai/mock-engine";
import { calculateBurnoutScore, getTopTriggers } from "@/lib/scoring/burnout";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { sanitizeUserInput } from "@/lib/ai/safety";

interface AppContextValue {
  data: AppData;
  isLoaded: boolean;
  storageError: string | null;
  validationError: string | null;
  addMood: (entry: Omit<MoodEntry, "id">) => void;
  addJournal: (content: string) => void;
  sendCoachMessage: (content: string) => void;
  toggleActionItem: (id: string) => void;
  regenerateActionPlan: () => void;
  updateSettings: (settings: Partial<AppData["settings"]>) => void;
  loadSampleData: () => void;
  exportData: () => string;
  importData: (json: string) => void;
  clearData: () => void;
  clearValidationError: () => void;
  burnoutScore: ReturnType<typeof calculateBurnoutScore>;
}

const AppContext = createContext<AppContextValue | null>(null);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(getDefaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadAppData();
    const isEmpty = loaded.moods.length === 0 && loaded.journals.length === 0;
    const dataToUse = isEmpty ? createSeedData() : loaded;
    queueMicrotask(() => {
      setData(dataToUse);
      setIsLoaded(true);
      if (isEmpty) {
        try {
          saveAppData(dataToUse);
        } catch {
          // storage error handled on next persist
        }
      }
    });
  }, []);

  const persist = useCallback((updater: AppData | ((prev: AppData) => AppData)) => {
    setData((prev) => {
      const newData = typeof updater === "function" ? updater(prev) : updater;
      try {
        saveAppData(newData);
        setStorageError(null);
        return newData;
      } catch (error) {
        if (error instanceof StorageError) {
          setStorageError(error.message);
        }
        return prev;
      }
    });
  }, []);

  const addMood = useCallback((entry: Omit<MoodEntry, "id">) => {
    const mood: MoodEntry = { ...entry, id: generateId() };
    const result = moodEntrySchema.safeParse(mood);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "Invalid mood entry.");
      return;
    }
    setValidationError(null);
    persist((prev) => ({ ...prev, moods: [...prev.moods, mood] }));
  }, [persist]);

  const addJournal = useCallback((content: string) => {
    if (!checkRateLimit("journal", RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      setValidationError("Please wait a moment before submitting another journal entry.");
      return;
    }

    const sanitized = sanitizeUserInput(content, 5000);
    const analysis = analyzeJournal(sanitized);
    const journal: JournalEntry = {
      id: generateId(),
      date: new Date().toISOString().split("T")[0],
      content: sanitized,
      analysis,
    };

    const result = journalEntrySchema.safeParse(journal);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "Invalid journal entry.");
      return;
    }
    setValidationError(null);
    persist((prev) => ({ ...prev, journals: [journal, ...prev.journals] }));
  }, [persist]);

  const sendCoachMessage = useCallback((content: string) => {
    if (!checkRateLimit("coach", RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      setValidationError("Please wait a moment before sending another message.");
      return;
    }

    const sanitized = sanitizeUserInput(content, 2000);
    const userMsg: CoachMessage = {
      id: generateId(),
      role: "user",
      content: sanitized,
      timestamp: new Date().toISOString(),
    };

    const userResult = coachMessageSchema.safeParse(userMsg);
    if (!userResult.success) {
      setValidationError(userResult.error.issues[0]?.message ?? "Invalid message.");
      return;
    }

    setValidationError(null);
    persist((prev) => {
      const response = getCoachResponse(sanitized, prev.settings.examType);
      const assistantMsg: CoachMessage = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };
      return {
        ...prev,
        coachMessages: [...prev.coachMessages, userMsg, assistantMsg],
      };
    });
  }, [persist]);

  const toggleActionItem = useCallback((id: string) => {
    persist((prev) => ({
      ...prev,
      actionPlan: prev.actionPlan.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    }));
  }, [persist]);

  const regenerateActionPlan = useCallback(() => {
    persist((prev) => {
      const burnout = calculateBurnoutScore(prev.moods, prev.journals);
      const triggers = getTopTriggers(prev.moods, prev.journals);
      const plan = generateActionPlan(burnout.score, triggers);
      return { ...prev, actionPlan: plan };
    });
  }, [persist]);

  const updateSettings = useCallback((settings: Partial<AppData["settings"]>) => {
    persist((prev) => {
      const merged = { ...prev.settings, ...settings };
      const result = appSettingsSchema.safeParse(merged);
      if (!result.success) {
        setValidationError(result.error.issues[0]?.message ?? "Invalid settings.");
        return prev;
      }
      setValidationError(null);
      return { ...prev, settings: result.data };
    });
  }, [persist]);

  const loadSampleData = useCallback(() => {
    persist(createSeedData());
  }, [persist]);

  const exportDataFn = useCallback(() => exportAppData(data), [data]);

  const importDataFn = useCallback(
    (json: string) => {
      try {
        persist(importAppData(json));
        setValidationError(null);
      } catch (error) {
        if (error instanceof ImportError) {
          setStorageError(error.message);
        } else {
          setStorageError("Invalid data file. Please check the format.");
        }
      }
    },
    [persist],
  );

  const clearDataFn = useCallback(() => {
    clearAppData();
    resetRateLimit();
    setData(getDefaultData());
    setStorageError(null);
    setValidationError(null);
  }, []);

  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  const burnoutScore = useMemo(
    () => calculateBurnoutScore(data.moods, data.journals),
    [data.moods, data.journals],
  );

  const value = useMemo(
    () => ({
      data,
      isLoaded,
      storageError,
      validationError,
      addMood,
      addJournal,
      sendCoachMessage,
      toggleActionItem,
      regenerateActionPlan,
      updateSettings,
      loadSampleData,
      exportData: exportDataFn,
      importData: importDataFn,
      clearData: clearDataFn,
      clearValidationError,
      burnoutScore,
    }),
    [
      data,
      isLoaded,
      storageError,
      validationError,
      addMood,
      addJournal,
      sendCoachMessage,
      toggleActionItem,
      regenerateActionPlan,
      updateSettings,
      loadSampleData,
      exportDataFn,
      importDataFn,
      clearDataFn,
      clearValidationError,
      burnoutScore,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useAppData(): AppData {
  return useApp().data;
}
