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
  ExamType,
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
} from "@/lib/storage/local-store";
import { createSeedData } from "@/lib/ai/seed-data";
import { moodEntrySchema, journalEntrySchema, coachMessageSchema } from "@/lib/validation/schemas";
import { analyzeJournal, getCoachResponse } from "@/lib/ai/mock-engine";
import { generateActionPlan } from "@/lib/ai/mock-engine";
import { calculateBurnoutScore, getTopTriggers } from "@/lib/scoring/burnout";

interface AppContextValue {
  data: AppData;
  isLoaded: boolean;
  storageError: string | null;
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
  burnoutScore: ReturnType<typeof calculateBurnoutScore>;
}

const AppContext = createContext<AppContextValue | null>(null);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(getDefaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadAppData();
    queueMicrotask(() => {
      setData(loaded);
      setIsLoaded(true);
    });
  }, []);

  const persist = useCallback((newData: AppData) => {
    try {
      saveAppData(newData);
      setStorageError(null);
      setData(newData);
    } catch (error) {
      if (error instanceof StorageError) {
        setStorageError(error.message);
      }
    }
  }, []);

  const addMood = useCallback(
    (entry: Omit<MoodEntry, "id">) => {
      const mood: MoodEntry = { ...entry, id: generateId() };
      const result = moodEntrySchema.safeParse(mood);
      if (!result.success) return;

      const newData = { ...data, moods: [...data.moods, mood] };
      persist(newData);
    },
    [data, persist],
  );

  const addJournal = useCallback(
    (content: string) => {
      const analysis = analyzeJournal(content);
      const journal: JournalEntry = {
        id: generateId(),
        date: new Date().toISOString().split("T")[0],
        content,
        analysis,
      };

      const result = journalEntrySchema.safeParse(journal);
      if (!result.success) return;

      const newData = { ...data, journals: [journal, ...data.journals] };
      persist(newData);
    },
    [data, persist],
  );

  const sendCoachMessage = useCallback(
    (content: string) => {
      const userMsg: CoachMessage = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      if (!coachMessageSchema.safeParse(userMsg).success) return;

      const response = getCoachResponse(content);
      const assistantMsg: CoachMessage = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };

      const newData = {
        ...data,
        coachMessages: [...data.coachMessages, userMsg, assistantMsg],
      };
      persist(newData);
    },
    [data, persist],
  );

  const toggleActionItem = useCallback(
    (id: string) => {
      const newPlan = data.actionPlan.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      );
      persist({ ...data, actionPlan: newPlan });
    },
    [data, persist],
  );

  const regenerateActionPlan = useCallback(() => {
    const burnout = calculateBurnoutScore(data.moods, data.journals);
    const triggers = getTopTriggers(data.moods, data.journals);
    const plan = generateActionPlan(burnout.score, triggers);
    persist({ ...data, actionPlan: plan });
  }, [data, persist]);

  const updateSettings = useCallback(
    (settings: Partial<AppData["settings"]>) => {
      persist({
        ...data,
        settings: { ...data.settings, ...settings },
      });
    },
    [data, persist],
  );

  const loadSampleData = useCallback(() => {
    persist(createSeedData());
  }, [persist]);

  const exportDataFn = useCallback(() => exportAppData(data), [data]);

  const importDataFn = useCallback(
    (json: string) => {
      try {
        persist(importAppData(json));
      } catch {
        setStorageError("Invalid data file. Please check the format.");
      }
    },
    [persist],
  );

  const clearDataFn = useCallback(() => {
    clearAppData();
    setData(getDefaultData());
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
      burnoutScore,
    }),
    [
      data,
      isLoaded,
      storageError,
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

export function useExamType(): ExamType {
  return useApp().data.settings.examType;
}
