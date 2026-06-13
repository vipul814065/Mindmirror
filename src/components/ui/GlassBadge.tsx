import type { ReactNode } from "react";
export function GlassBadge({ children, variant = "default", className = "" }: { children: ReactNode; variant?: "default" | "primary" | "success" | "warning" | "danger"; className?: string }) {
  const v = { default: "bg-surface text-muted border border-border", primary: "bg-primary-subtle text-primary", success: "bg-emerald-50 text-emerald-700", warning: "bg-amber-50 text-amber-700", danger: "bg-red-50 text-red-700" };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${v[variant]} ${className}`}>{children}</span>;
}
