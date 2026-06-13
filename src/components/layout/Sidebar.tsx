"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "./NavLink";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/mood", label: "Mood", icon: Smile },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/burnout", label: "Burnout", icon: Flame },
  { href: "/plan", label: "Plan", icon: ClipboardList },
  { href: "/insights/weekly", label: "Insights", icon: BarChart3 },
];

export function Sidebar() {
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
          aria-current={pathname === "/insights/triggers" ? "page" : undefined}
          className={`ml-7 px-3 py-2 text-xs ${
            pathname === "/insights/triggers" ? "text-primary" : "text-subtle"
          }`}
        >
          Stress Triggers
        </Link>
        <Link
          href="/mindfulness"
          aria-current={pathname === "/mindfulness" ? "page" : undefined}
          className={`ml-7 px-3 py-2 text-xs ${
            pathname === "/mindfulness" ? "text-primary" : "text-subtle"
          }`}
        >
          Mindfulness
        </Link>
      </nav>
      <div className="mt-auto pt-4">
        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
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
