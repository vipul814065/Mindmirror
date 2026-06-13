"use client";

import { CoachChatWidget } from "@/components/coach/CoachChatWidget";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { AppProvider, useApp } from "@/hooks/useAppStore";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useApp();

  if (!isLoaded) {
    return (
      <main id="main-content" className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-6" aria-busy="true" aria-label="Loading app">
          <GlassSkeleton className="h-12 w-64" />
          <GlassSkeleton className="h-40" />
          <GlassSkeleton className="h-60" />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="flex-1 px-5 py-8 pb-28 lg:px-10 lg:py-10 lg:pb-10">
      {children}
    </main>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <GradientBackground />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <AppContent>{children}</AppContent>
          <MobileNav />
          <CoachChatWidget />
        </div>
      </div>
    </AppProvider>
  );
}
