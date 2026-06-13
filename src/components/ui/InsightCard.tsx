"use client";
import { Sparkles } from "lucide-react";
import { GlassCard } from "./GlassCard";
interface InsightCardProps { patterns: string[]; summary?: string; delay?: number; }
export function InsightCard({ patterns, summary, delay = 0 }: InsightCardProps) {
  return (<GlassCard delay={delay} ariaLabel="Weekly emotional insight" className="border-l-4 border-l-primary/40">{summary && <p className="mb-4 text-sm leading-relaxed text-muted">{summary}</p>}<ul className="space-y-3" aria-live="polite">{patterns.map((pattern, i) => (<li key={i} className="flex items-start gap-3 rounded-2xl bg-primary-subtle px-4 py-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span className="text-sm text-foreground">{pattern}</span></li>))}</ul></GlassCard>);
}
