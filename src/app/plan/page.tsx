"use client";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
export default function PlanPage() {
  const { data, toggleActionItem, regenerateActionPlan } = useApp();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Action Plan" description="Steps based on your wellness data."><GlassButton variant="outline" size="sm" onClick={regenerateActionPlan}>Regenerate</GlassButton></PageHeader>
      {data.actionPlan.length === 0 ? <GlassCard><p className="py-6 text-center text-subtle">No plan yet.</p><GlassButton onClick={regenerateActionPlan}>Generate</GlassButton></GlassCard> : data.actionPlan.map(item => (
        <GlassCard key={item.id} className="!p-4"><label className="flex gap-3"><input type="checkbox" checked={item.completed} onChange={() => toggleActionItem(item.id)} className="mt-1" /><span className={item.completed ? "text-subtle line-through" : "text-foreground"}>{item.title}</span></label></GlassCard>
      ))}
    </div>
  );
}
