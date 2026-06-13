"use client";

import { DEMO_COACH_PROMPT } from "@/lib/constants/demo";

interface CoachQuickRepliesProps {
  quickReplies: string[];
  prompts: string[];
  onSelectReply: (text: string, isDemo: boolean) => void;
  onSelectPrompt: (text: string) => void;
}

export function CoachQuickReplies({
  quickReplies,
  prompts,
  onSelectReply,
  onSelectPrompt,
}: CoachQuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {quickReplies.map((p, i) => (
        <button
          key={p}
          type="button"
          onClick={() => onSelectReply(i === 0 ? DEMO_COACH_PROMPT : p, i === 0)}
          className={`rounded-full px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
            i === 0
              ? "bg-primary-subtle font-medium text-primary ring-1 ring-primary/20"
              : "bg-surface text-muted hover:bg-primary-subtle hover:text-primary"
          }`}
        >
          {i === 0 ? `Demo: ${p}` : p}
        </button>
      ))}
      {prompts.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onSelectPrompt(p)}
          className="rounded-full bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:bg-primary-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
