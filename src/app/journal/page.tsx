"use client";
import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { GlassSearch } from "@/components/ui/GlassSearch";
export default function JournalPage() {
  const { data, addJournal } = useApp();
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const filtered = data.journals.filter(j => !query || j.content.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Journal" description="Write freely. AI analysis follows each entry." />
      <GlassCard className="space-y-4">
        <GlassTextarea label="Today's entry" value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" maxLength={2000} />
        <div className="flex justify-end"><GlassButton onClick={() => { if (content.trim()) { addJournal(content.trim()); setContent(""); } }}>Analyze Entry</GlassButton></div>
      </GlassCard>
      {data.journals.length > 0 && <GlassSearch placeholder="Search entries..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Search journal entries" />}
      {filtered.map(j => (
        <GlassCard key={j.id} className="!p-4 space-y-3">
          <p className="text-xs text-subtle">{j.date}</p>
          <p className="text-sm text-foreground">{j.content}</p>
          {j.analysis && (
          <div className="rounded-2xl border-l-4 border-l-primary/40 bg-primary-subtle p-4">
            <p className="text-xs font-medium text-primary">AI Analysis</p>
            <p className="mt-2 text-sm text-muted">{j.analysis.reflection}</p>
            {j.analysis.themes.length > 0 && <p className="mt-2 text-xs text-subtle">Themes: {j.analysis.themes.join(", ")}</p>}
          </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
