"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CoachChatConversation } from "@/components/coach/CoachChatConversation";

export default function CoachPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Wellness Coach"
        description="A supportive space to talk through exam stress."
      />

      <ErrorBoundary fallbackTitle="Coach unavailable">
        <CoachChatConversation variant="page" />
      </ErrorBoundary>
    </div>
  );
}
