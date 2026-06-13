"use client";

import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QUICK_REPLIES } from "@/lib/ai/mock-engine";
import { DEMO_COACH_PROMPT } from "@/lib/constants/demo";

const PROMPTS = [
  "I'm feeling overwhelmed by my syllabus.",
  "I can't focus today.",
  "How do I manage exam anxiety?",
];

export default function CoachPage() {
  const { data, sendCoachMessage, validationError } = useApp();
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (!msg.trim()) return;
    sendCoachMessage(msg.trim());
    setMsg("");
  };

  const sendDemoPrompt = () => {
    sendCoachMessage(DEMO_COACH_PROMPT);
    setMsg("");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Wellness Coach"
        description="A supportive space to talk through exam stress."
      />

      {validationError && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {validationError}
        </div>
      )}

      <GlassCard className="!p-4">
        <p className="text-sm text-muted">Competition demo</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <GlassBadge variant="primary">PromptWars demo</GlassBadge>
          <GlassButton variant="outline" size="sm" onClick={sendDemoPrompt}>
            Try: “{DEMO_COACH_PROMPT}”
          </GlassButton>
        </div>
      </GlassCard>

      <ErrorBoundary fallbackTitle="Coach unavailable">
        <GlassCard className="max-h-[60vh] space-y-4 overflow-y-auto">
          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Coach conversation"
          >
            {data.coachMessages.length === 0 && (
              <p className="py-8 text-center text-sm text-subtle">
                Start a conversation — your coach is here to listen.
              </p>
            )}
            {data.coachMessages.map((m) => (
              <div
                key={m.id}
                className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-white"
                      : "glass-surface text-foreground"
                  }`}
                  aria-label={m.role === "user" ? "You said" : "Coach said"}
                >
                  {m.role === "assistant" && (
                    <span className="mb-1 block text-xs font-medium text-primary">
                      AI Coach
                    </span>
                  )}
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-wrap gap-2">
          {QUICK_REPLIES.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => (i === 0 ? sendDemoPrompt() : setMsg(p))}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
                i === 0
                  ? "bg-primary-subtle font-medium text-primary ring-1 ring-primary/20"
                  : "bg-surface text-muted hover:bg-primary-subtle hover:text-primary"
              }`}
            >
              {i === 0 ? `Demo: ${p}` : p}
            </button>
          ))}
          {PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setMsg(p)}
              className="rounded-full bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:bg-primary-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <GlassInput
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Share what's on your mind..."
            aria-label="Message to coach"
            maxLength={2000}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && msg.trim()) handleSend();
            }}
          />
          <GlassButton onClick={handleSend}>Send</GlassButton>
        </div>
      </ErrorBoundary>
    </div>
  );
}
