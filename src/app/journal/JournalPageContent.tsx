"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { GlassSearch } from "@/components/ui/GlassSearch";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DEMO_JOURNAL_ENTRY } from "@/lib/constants/demo";
import type { JournalAnalysis } from "@/types/wellness";

const SENTIMENT_VARIANT: Record<
  JournalAnalysis["sentimentLabel"],
  "success" | "warning" | "default"
> = {
  positive: "success",
  neutral: "default",
  negative: "warning",
};

function JournalAnalysisPanel({ analysis }: { analysis: JournalAnalysis }) {
  return (
    <div className="space-y-3 rounded-2xl border-l-4 border-l-primary/40 bg-primary-subtle p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-medium text-primary">AI Analysis</p>
        <GlassBadge variant={SENTIMENT_VARIANT[analysis.sentimentLabel]}>
          {analysis.sentimentLabel} · {analysis.sentiment}/5
        </GlassBadge>
      </div>
      <p className="text-sm text-muted">{analysis.reflection}</p>
      {analysis.triggers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {analysis.triggers.map((t) => (
            <GlassBadge key={t} variant="primary">
              {t}
            </GlassBadge>
          ))}
        </div>
      )}
      {analysis.themes.length > 0 && (
        <p className="text-xs text-subtle">Themes: {analysis.themes.join(", ")}</p>
      )}
      <div className="rounded-xl bg-surface px-3 py-2">
        <p className="text-xs font-medium text-primary">Coaching tip</p>
        <p className="mt-1 text-sm text-foreground">{analysis.coachingTip}</p>
      </div>
    </div>
  );
}

export default function JournalPageContent() {
  const { data, addJournal, validationError } = useApp();
  const searchParams = useSearchParams();
  const demoMock = searchParams.get("demo") === "mock";
  const [content, setContent] = useState(() =>
    demoMock ? DEMO_JOURNAL_ENTRY : "",
  );
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const filtered = data.journals.filter(
    (j) => !query || j.content.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSubmit = () => {
    if (!content.trim()) return;
    setAnalyzing(true);
    addJournal(content.trim());
    setContent("");
    setTimeout(() => setAnalyzing(false), 600);
  };

  const loadDemoEntry = () => {
    setContent(DEMO_JOURNAL_ENTRY);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Journal" description="Write freely. AI analysis follows each entry." />

      {validationError && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {validationError}
        </div>
      )}

      <ErrorBoundary fallbackTitle="Journal unavailable">
        <GlassCard className="space-y-4">
          <GlassTextarea
            label="Today's entry"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={5000}
            error={
              content.length > 0 && content.length < 10
                ? "Journal must be at least 10 characters"
                : undefined
            }
          />
          <div className="flex flex-wrap justify-end gap-2">
            <GlassButton variant="outline" size="sm" onClick={loadDemoEntry}>
              Try demo entry
            </GlassButton>
            <GlassButton onClick={handleSubmit} disabled={content.trim().length < 10}>
              {analyzing ? "Analyzing…" : "Analyze Entry"}
            </GlassButton>
          </div>
        </GlassCard>

        {data.journals.length === 0 ? (
          <GlassCard>
            <p className="py-6 text-center text-sm text-subtle">
              No journal entries yet. Use “Try demo entry” to see full AI analysis.
            </p>
          </GlassCard>
        ) : (
          <>
            <GlassSearch
              placeholder="Search entries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search journal entries"
            />
            {filtered.length === 0 ? (
              <GlassCard>
                <p className="py-6 text-center text-sm text-subtle">
                  No entries match your search.
                </p>
              </GlassCard>
            ) : (
              filtered.map((j) => (
                <GlassCard key={j.id} className="!p-4 space-y-3">
                  <p className="text-xs text-subtle">{j.date}</p>
                  <p className="text-sm text-foreground">{j.content}</p>
                  {j.analysis && <JournalAnalysisPanel analysis={j.analysis} />}
                </GlassCard>
              ))
            )}
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}
