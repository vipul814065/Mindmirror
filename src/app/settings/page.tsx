"use client";

import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { ImportDataModal } from "@/components/ui/ImportDataModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EXAM_TYPES } from "@/lib/constants/exams";

export default function SettingsPage() {
  const { data, updateSettings, exportData, importData, clearData, storageError } = useApp();
  const [name, setName] = useState(data.settings.userName);
  const [importOpen, setImportOpen] = useState(false);
  const { settings } = data;

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mindmirror-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Profile and data preferences." />

      {storageError && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {storageError}
        </div>
      )}

      <ErrorBoundary fallbackTitle="Settings unavailable">
        <ProfileCard name={settings.userName} examType={settings.examType} settings={settings} />
        <GlassCard className="space-y-4">
          <GlassInput
            label="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Exam type">
            {EXAM_TYPES.map((e) => (
              <GlassButton
                key={e}
                size="sm"
                variant={settings.examType === e ? "primary" : "outline"}
                aria-pressed={settings.examType === e}
                onClick={() => updateSettings({ examType: e })}
              >
                {e}
              </GlassButton>
            ))}
          </div>
          <GlassButton onClick={() => updateSettings({ userName: name.trim() || "Student" })}>
            Save Profile
          </GlassButton>
        </GlassCard>

        {(settings.age || settings.goal || settings.studyHoursPerDay || settings.streakDays) && (
          <GlassCard className="space-y-2">
            <h2 className="font-display text-sm font-semibold text-foreground">Student Profile</h2>
            {settings.age && <p className="text-sm text-muted">Age: {settings.age}</p>}
            {settings.goal && <p className="text-sm text-muted">Goal: {settings.goal}</p>}
            {settings.studyHoursPerDay && (
              <p className="text-sm text-muted">Study hours: {settings.studyHoursPerDay}/day</p>
            )}
            {settings.streakDays && (
              <p className="text-sm text-muted">Current streak: {settings.streakDays} days</p>
            )}
          </GlassCard>
        )}

        <GlassCard className="space-y-3">
          <p className="text-sm text-muted">
            Your wellness data is stored locally in this browser as plain text. It is not encrypted
            and may be visible to browser extensions on shared devices.
          </p>
          <GlassButton variant="outline" onClick={handleExport}>
            Export Data
          </GlassButton>
          <GlassButton variant="outline" onClick={() => setImportOpen(true)}>
            Import Data
          </GlassButton>
          <GlassButton
            variant="ghost"
            onClick={() => {
              if (confirm("Clear all data?")) clearData();
            }}
          >
            Clear All Data
          </GlassButton>
        </GlassCard>
      </ErrorBoundary>

      <ImportDataModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={importData}
      />
    </div>
  );
}
