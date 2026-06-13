"use client";

import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { GlassSearch } from "@/components/ui/GlassSearch";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function JournalPage() {
  const { data, addJournal, validationError } = useApp();
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const filtered = data.journals.filter(
    (j) => !query || j.content.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSubmit = () => {
    if (!content.trim()) return;
    addJournal(content.trim());
    setContent("");
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
          <div className="flex justify-end">
            <GlassButton onClick={handleSubmit} disabled={content.trim().length < 10}>
              Analyze Entry
            </GlassButton>
          </div>
        </GlassCard>

        {data.journals.length === 0 ? (
          <GlassCard>
            <p className="py-6 text-center text-sm text-subtle">
              No journal entries yet. Write your first entry above to get AI-powered insights.
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
                  {j.analysis && (
                    <div className="rounded-2xl border-l-4 border-l-primary/40 bg-primary-subtle p-4">
                      <p className="text-xs font-medium text-primary">AI Analysis</p>
                      <p className="mt-2 text-sm text-muted">{j.analysis.reflection}</p>
                      {j.analysis.themes.length > 0 && (
                        <p className="mt-2 text-xs text-subtle">
                          Themes: {j.analysis.themes.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </GlassCard>
              ))
            )}
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}
