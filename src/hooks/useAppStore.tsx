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
import type { AppData, MoodEntry } from "@/types/wellness";
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
import { calculateBurnoutScore } from "@/lib/scoring/burnout";
import { resetRateLimit } from "@/lib/rate-limit";
import {
  loadPitchCompletedSteps,
  markPitchStep,
  resetPitchSteps,
} from "@/lib/pitch/pitch-storage";
import {
  createMoodEntry,
  createJournalEntry,
  createCoachExchange,
  mergeSettings,
  buildActionPlan,
} from "@/hooks/app-store-actions";

interface AppContextValue {
  data: AppData;
  isLoaded: boolean;
  storageError: string | null;
  validationError: string | null;
  pitchCompletedSteps: string[];
  addMood: (entry: Omit<MoodEntry, "id">) => void;
  addJournal: (content: string) => void;
  sendCoachMessage: (content: string) => void;
  toggleActionItem: (id: string) => void;
  regenerateActionPlan: () => void;
  updateSettings: (settings: Partial<AppData["settings"]>) => void;
  loadSampleData: () => void;
  markPitchStepComplete: (stepId: string) => void;
  resetPitchProgress: () => void;
  exportData: () => string;
  importData: (json: string) => void;
  clearData: () => void;
  clearValidationError: () => void;
  burnoutScore: ReturnType<typeof calculateBurnoutScore>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(getDefaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [pitchCompletedSteps, setPitchCompletedSteps] = useState<string[]>(() =>
    typeof window !== "undefined" ? loadPitchCompletedSteps() : [],
  );

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
    const result = createMoodEntry(entry);
    if ("error" in result) {
      setValidationError(result.error);
      return;
    }
    setValidationError(null);
    persist((prev) => ({ ...prev, moods: [...prev.moods, result.mood] }));
  }, [persist]);

  const addJournal = useCallback((content: string) => {
    const result = createJournalEntry(content);
    if ("error" in result) {
      setValidationError(result.error);
      return;
    }
    setValidationError(null);
    persist((prev) => ({ ...prev, journals: [result.journal, ...prev.journals] }));
  }, [persist]);

  const sendCoachMessage = useCallback((content: string) => {
    persist((prev) => {
      const result = createCoachExchange(content, prev.settings.examType);
      if ("error" in result) {
        setValidationError(result.error);
        return prev;
      }
      setValidationError(null);
      return {
        ...prev,
        coachMessages: [...prev.coachMessages, result.userMsg, result.assistantMsg],
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
    persist((prev) => buildActionPlan(prev));
  }, [persist]);

  const updateSettings = useCallback((settings: Partial<AppData["settings"]>) => {
    persist((prev) => {
      const result = mergeSettings(prev, settings);
      if ("error" in result) {
        setValidationError(result.error);
        return prev;
      }
      setValidationError(null);
      return result;
    });
  }, [persist]);

  const loadSampleData = useCallback(() => {
    persist(createSeedData());
  }, [persist]);

  const markPitchStepComplete = useCallback((stepId: string) => {
    setPitchCompletedSteps(markPitchStep(stepId));
  }, []);

  const resetPitchProgress = useCallback(() => {
    resetPitchSteps();
    setPitchCompletedSteps([]);
  }, []);

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
    resetPitchSteps();
    setData(getDefaultData());
    setStorageError(null);
    setValidationError(null);
    setPitchCompletedSteps([]);
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
      pitchCompletedSteps,
      addMood,
      addJournal,
      sendCoachMessage,
      toggleActionItem,
      regenerateActionPlan,
      updateSettings,
      loadSampleData,
      markPitchStepComplete,
      resetPitchProgress,
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
      pitchCompletedSteps,
      addMood,
      addJournal,
      sendCoachMessage,
      toggleActionItem,
      regenerateActionPlan,
      updateSettings,
      loadSampleData,
      markPitchStepComplete,
      resetPitchProgress,
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
