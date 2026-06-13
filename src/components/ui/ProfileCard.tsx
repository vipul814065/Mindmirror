"use client";
import { GlassCard } from "./GlassCard";
export function ProfileCard({ name, examType }: { name: string; examType: string }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (<GlassCard className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle font-bold text-primary">{initials}</div><div><p className="font-display text-lg font-semibold text-foreground">{name}</p><p className="text-sm text-muted">{examType}</p></div></GlassCard>);
}
