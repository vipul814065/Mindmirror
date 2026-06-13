"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}

export function NavLink({
  href,
  label,
  icon: Icon,
  active,
  compact,
  onNavigate,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
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
