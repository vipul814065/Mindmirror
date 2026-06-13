"use client";

import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QUICK_REPLIES } from "@/lib/ai/mock-engine";

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
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-wrap gap-2">
          {[...QUICK_REPLIES.slice(0, 3), ...PROMPTS].slice(0, 5).map((p) => (
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
