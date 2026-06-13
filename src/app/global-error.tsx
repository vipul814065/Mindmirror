"use client";
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (<html lang="en"><body className="flex min-h-screen items-center justify-center bg-background text-foreground"><div className="text-center"><h1 className="text-2xl font-bold">MindMirror encountered an error</h1><p className="mt-2 text-muted">Please refresh the page.</p><button onClick={reset} className="mt-4 rounded-2xl bg-primary px-6 py-2.5 text-sm font-medium text-white">Try Again</button></div></body></html>);
}
