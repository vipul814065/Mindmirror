"use client";

import { Suspense } from "react";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import JournalPageContent from "./JournalPageContent";

export default function JournalPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl space-y-6">
          <GlassSkeleton className="h-12 w-48" />
          <GlassSkeleton className="h-40" />
        </div>
      }
    >
      <JournalPageContent />
    </Suspense>
  );
}
