"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { QUICK_REPLIES } from "@/lib/ai/mock-engine";
import { CoachMessageBubble } from "@/components/coach/CoachMessageBubble";
import { CoachQuickReplies } from "@/components/coach/CoachQuickReplies";

const PAGE_PROMPTS = [
  "I'm feeling overwhelmed by my syllabus.",
  "I can't focus today.",
  "How do I manage exam anxiety?",
];

const WIDGET_PROMPTS = PAGE_PROMPTS.slice(0, 2);

interface CoachChatConversationProps {
  variant?: "page" | "widget";
  className?: string;
}

export function CoachChatConversation({
  variant = "page",
  className,
}: CoachChatConversationProps) {
  const { data, sendCoachMessage, validationError } = useApp();
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isWidget = variant === "widget";
  const prompts = isWidget ? WIDGET_PROMPTS : PAGE_PROMPTS;
  const quickReplies = isWidget ? QUICK_REPLIES.slice(0, 2) : QUICK_REPLIES;

  const handleSend = (text?: string) => {
    const content = (text ?? msg).trim();
    if (!content || sending) return;
    setSending(true);
    sendCoachMessage(content);
    setMsg("");
    setTimeout(() => setSending(false), 300);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [data.coachMessages.length]);

  const messageArea = (
    <div
      ref={scrollRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Coach conversation"
      className={`overflow-y-auto ${isWidget ? "flex-1 min-h-0 px-4 py-3" : ""} ${className ?? ""}`}
    >
      {data.coachMessages.length === 0 && (
        <p className={`text-center text-sm text-subtle ${isWidget ? "py-6" : "py-8"}`}>
          Start a conversation — your coach is here to listen.
        </p>
      )}
      {data.coachMessages.map((m) => (
        <CoachMessageBubble key={m.id} message={m} />
      ))}
    </div>
  );

  const footer = (
    <div className={isWidget ? "space-y-2 border-t border-border px-4 py-3" : "space-y-4"}>
      {validationError && (
        <div className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
          {validationError}
        </div>
      )}

      <CoachQuickReplies
        quickReplies={quickReplies}
        prompts={prompts}
        onSelectReply={(text, isDemo) => (isDemo ? handleSend(text) : setMsg(text))}
        onSelectPrompt={setMsg}
      />

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
        <GlassButton onClick={() => handleSend()} size={isWidget ? "sm" : "md"} disabled={sending || !msg.trim()}>
          Send
        </GlassButton>
      </div>
    </div>
  );

  if (isWidget) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {messageArea}
        {footer}
      </div>
    );
  }

  return (
    <>
      <GlassCard className="max-h-[60vh] space-y-4 overflow-y-auto">{messageArea}</GlassCard>
      {footer}
    </>
  );
}
