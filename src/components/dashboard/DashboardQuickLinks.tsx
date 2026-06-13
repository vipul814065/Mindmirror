"use client";

import Link from "next/link";
import {
  Smile,
  BookOpen,
  MessageCircle,
  BarChart3,
} from "lucide-react";

const LINKS = [
  { href: "/mood", label: "Mood", icon: Smile },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function DashboardQuickLinks() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="glass-surface inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </div>
  );
}
