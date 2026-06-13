"use client";
import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { ProfileCard } from "@/components/ui/ProfileCard";
import type { ExamType } from "@/types/wellness";
const EXAMS: ExamType[] = ["JEE", "NEET", "UPSC", "CAT", "CUET"];
export default function SettingsPage() {
  const { data, updateSettings, exportData, importData, clearData } = useApp();
  const [name, setName] = useState(data.settings.userName);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Profile and data preferences." />
      <ProfileCard name={data.settings.userName} examType={data.settings.examType} />
      <GlassCard className="space-y-4">
        <GlassInput label="Display name" value={name} onChange={e => setName(e.target.value)} />
        <div className="flex flex-wrap gap-2">{EXAMS.map(e => <GlassButton key={e} size="sm" variant={data.settings.examType === e ? "primary" : "outline"} onClick={() => updateSettings({ examType: e })}>{e}</GlassButton>)}</div>
        <GlassButton onClick={() => updateSettings({ userName: name.trim() || "Student" })}>Save Profile</GlassButton>
      </GlassCard>
      <GlassCard className="space-y-3">
        <GlassButton variant="outline" onClick={() => { const j = exportData(); const b = new Blob([j], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "mindmirror-backup.json"; a.click(); }}>Export Data</GlassButton>
        <GlassButton variant="outline" onClick={() => { const j = prompt("Paste backup JSON"); if (j) importData(j); }}>Import Data</GlassButton>
        <GlassButton variant="ghost" onClick={() => { if (confirm("Clear all data?")) clearData(); }}>Clear All Data</GlassButton>
      </GlassCard>
    </div>
  );
}
