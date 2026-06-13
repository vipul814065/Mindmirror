"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { InsightCard } from "@/components/ui/InsightCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { generateWeeklyInsight } from "@/lib/ai/mock-engine";
import { MOODS } from "@/components/ui/MoodPicker";
import { Smile, BookOpen, MessageCircle, Sparkles, Database } from "lucide-react";
import type { ExamType } from "@/types/wellness";
const MoodChart = dynamic(() => import("@/components/charts/MoodChart").then(m => m.MoodChart), { ssr: false });
const EXAMS: ExamType[] = ["JEE", "NEET", "UPSC", "CAT", "CUET"];
export default function DashboardPage() {
  const { data, burnoutScore, loadSampleData, updateSettings, storageError } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const todayMood = data.moods.find(m => m.date === today);
  const insight = generateWeeklyInsight(data.moods, data.journals);
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader title={`${greet}, ${data.settings.userName}`} description={`Preparing for ${data.settings.examType}`}>
        <GlassButton variant="outline" size="sm" onClick={loadSampleData}><Database className="h-4 w-4" />Sample Data</GlassButton>
      </PageHeader>
      {storageError && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{storageError}</div>}
      <ProfileCard name={data.settings.userName} examType={data.settings.examType} />
      <div className="flex flex-wrap gap-2">{EXAMS.map(e => <button key={e} type="button" onClick={() => updateSettings({ examType: e })}><GlassBadge variant={data.settings.examType === e ? "primary" : "default"}>{e}</GlassBadge></button>)}</div>
      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard className="flex flex-col items-center gap-3"><p className="text-sm text-muted">Burnout</p><ErrorBoundary fallbackTitle="Unavailable"><ProgressRing score={burnoutScore.score} riskLevel={burnoutScore.riskLevel} size={140} /></ErrorBoundary></GlassCard>
        <GlassCard><p className="mb-2 text-sm text-muted">Today</p>{todayMood ? <p className="text-2xl">{MOODS.find(m => m.value === todayMood.mood)?.emoji} <span className="text-lg text-foreground">{MOODS.find(m => m.value === todayMood.mood)?.label}</span></p> : <p className="text-subtle">Not logged</p>}</GlassCard>
        <GlassCard><p className="mb-2 flex gap-2 text-sm text-muted"><Sparkles className="h-4 w-4 text-primary" />Insight</p><p className="text-sm text-foreground">{insight.patterns[0]}</p></GlassCard>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/mood"><GlassButton className="w-full" variant="ghost"><Smile className="h-4 w-4" />Mood</GlassButton></Link>
        <Link href="/journal"><GlassButton className="w-full" variant="ghost"><BookOpen className="h-4 w-4" />Journal</GlassButton></Link>
        <Link href="/coach"><GlassButton className="w-full" variant="ghost"><MessageCircle className="h-4 w-4" />Coach</GlassButton></Link>
      </div>
      <div><h2 className="mb-4 font-display text-lg font-semibold text-foreground">Mood Trend</h2><MoodChart moods={data.moods} compact /></div>
      <InsightCard patterns={insight.patterns.slice(0, 3)} summary={insight.summary} />
    </div>
  );
}
