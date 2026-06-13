"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Smile,
  BookOpen,
  MessageCircle,
  Flame,
  ClipboardList,
  BarChart3,
  Settings,
  LineChart,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
import { AppProvider, useApp } from "@/hooks/useAppStore";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/mood", label: "Mood", icon: Smile },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/burnout", label: "Burnout", icon: Flame },
  { href: "/plan", label: "Plan", icon: ClipboardList },
  { href: "/insights/weekly", label: "Insights", icon: BarChart3 },
];

const MOBILE_PRIMARY = NAV.slice(0, 4);
const MOBILE_MORE = NAV.slice(4);

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  compact,
}: NavItem & { active: boolean; compact?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium ${
        active
          ? "bg-primary-subtle text-primary"
          : "text-muted hover:bg-surface hover:text-foreground"
      } ${compact ? "min-h-[44px] flex-col justify-center gap-1 text-xs" : ""}`}
    >
      {!compact && active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <Icon className={compact ? "h-5 w-5" : "h-4 w-4"} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-strong hidden lg:flex lg:w-[280px] lg:flex-col lg:border-r lg:border-border lg:p-5">
      <div className="mb-8 px-2">
        <p className="font-display text-xl font-bold text-gradient">MindMirror</p>
        <p className="mt-1 text-xs text-muted">AI Wellness Companion</p>
      </div>
      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return <NavLink key={item.href} {...item} active={active} />;
        })}
        <Link
          href="/insights/triggers"
          className={`ml-7 px-3 py-2 text-xs ${
            pathname === "/insights/triggers" ? "text-primary" : "text-subtle"
          }`}
        >
          Stress Triggers
        </Link>
      </nav>
      <div className="mt-auto pt-4">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm ${
            pathname === "/settings"
              ? "bg-primary-subtle text-primary"
              : "text-muted"
          }`}
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setMoreOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 lg:hidden"
      >
        {moreOpen && (
          <div className="glass-strong mb-2 space-y-1 rounded-[28px] p-2">
            {MOBILE_MORE.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <NavLink key={item.href} {...item} active={active} compact />
              );
            })}
            <Link
              href="/settings"
              className={`flex min-h-[44px] flex-col items-center justify-center text-xs ${
                pathname === "/settings" ? "text-primary" : "text-muted"
              }`}
              onClick={() => setMoreOpen(false)}
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
              <span>Settings</span>
            </Link>
          </div>
        )}
        <div className="glass-strong flex justify-around rounded-[28px] px-2 py-2">
          {MOBILE_PRIMARY.map((item) => {
            const active = pathname === item.href;
            return <NavLink key={item.href} {...item} active={active} compact />;
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={`flex min-h-[44px] flex-col items-center justify-center text-xs ${
              moreOpen ? "text-primary" : "text-muted"
            }`}
            aria-expanded={moreOpen}
            aria-label="More navigation options"
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}

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
          <BottomNav />
        </div>
      </div>
    </AppProvider>
  );
}
