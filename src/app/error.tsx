"use client";

import { GlassButton } from "@/components/ui/GlassButton";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-muted">
        We encountered an unexpected error. Your data is safe in local storage.
      </p>
      <GlassButton onClick={reset}>Try Again</GlassButton>
    </div>
  );
}
