"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BotMessageSquare, X } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CoachChatConversation } from "@/components/coach/CoachChatConversation";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export function CoachChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useFocusTrap(open);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (pathname === "/coach") {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-[60] lg:bottom-6 lg:right-6">
      {open && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="coach-chat-title"
          className="glass-strong mb-3 flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl shadow-xl"
          style={{ height: "min(520px, 70vh)" }}
        >
          <div className="flex items-center gap-3 border-b border-border bg-primary-subtle/50 px-4 py-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white"
              aria-hidden="true"
            >
              <BotMessageSquare className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="coach-chat-title"
                className="font-display text-sm font-semibold text-foreground"
              >
                Wellness Coach
              </h2>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                Online · here to help
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
              aria-label="Close coach chat"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ErrorBoundary fallbackTitle="Coach unavailable">
            <CoachChatConversation variant="widget" />
          </ErrorBoundary>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="glass-strong flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        aria-label={open ? "Minimize coach chat" : "Open coach chat"}
        aria-expanded={open}
      >
        <BotMessageSquare className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        Coach Chat
      </button>
    </div>
  );
}
