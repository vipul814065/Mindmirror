const PITCH_STORAGE_KEY = "mindmirror-pitch-steps";

export function loadPitchCompletedSteps(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PITCH_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function savePitchCompletedSteps(steps: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PITCH_STORAGE_KEY, JSON.stringify(steps));
}

export function markPitchStep(stepId: string): string[] {
  const current = loadPitchCompletedSteps();
  if (current.includes(stepId)) return current;
  const next = [...current, stepId];
  savePitchCompletedSteps(next);
  return next;
}

export function resetPitchSteps(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PITCH_STORAGE_KEY);
}
