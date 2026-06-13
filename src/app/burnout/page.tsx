"use client";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { BURNOUT_TIPS } from "@/lib/scoring/burnout";
export default function BurnoutPage() {
  const { burnoutScore } = useApp();
  const tips = BURNOUT_TIPS[burnoutScore.riskLevel];
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Burnout Risk Meter" description="Composite score from mood, journals, and triggers." />
      <GlassCard className="flex flex-col items-center gap-6 py-8"><ProgressRing score={burnoutScore.score} riskLevel={burnoutScore.riskLevel} size={200} /></GlassCard>
      <GlassCard><ul className="space-y-3">{burnoutScore.factors.map((f, i) => <li key={i} className="text-sm text-muted">{f}</li>)}</ul></GlassCard>
      {tips.map((t, i) => <GlassCard key={i} className="!p-4"><p className="text-sm text-foreground">{t}</p></GlassCard>)}
    </div>
  );
}
