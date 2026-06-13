"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { GlassSearch } from "@/components/ui/GlassSearch";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { JournalAnalysisPanel } from "@/components/journal/JournalAnalysisPanel";
import { DEMO_JOURNAL_ENTRY } from "@/lib/constants/demo";

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
            <GlassButton onClick={handleSubmit} disabled={content.trim().length < 10 || analyzing}>
              {analyzing ? "Analyzing…" : "Analyze Entry"}
            </GlassButton>
          </div>
        </GlassCard>

        {analyzing && (
          <JournalAnalysisPanel
            analysis={{
              sentiment: 0,
              sentimentLabel: "neutral",
              moodScore: 3,
              stressLevel: "Medium",
              burnoutRiskPercent: 50,
              confidenceScore: 50,
              triggers: [],
              themes: [],
              triggerSummary: "",
              reflection: "",
              coachingTip: "",
              recommendation: "",
              aiReasoning: "",
            }}
            loading
          />
        )}

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
