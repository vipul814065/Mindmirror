"use client";
import { useState } from "react";
import { useApp } from "@/hooks/useAppStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
const PROMPTS = ["I'm feeling overwhelmed by my syllabus.", "I can't focus today.", "How do I manage exam anxiety?"];
export default function CoachPage() {
  const { data, sendCoachMessage } = useApp();
  const [msg, setMsg] = useState("");
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Wellness Coach" description="A supportive space to talk through exam stress." />
      <GlassCard className="max-h-[60vh] space-y-4 overflow-y-auto">
        {data.coachMessages.length === 0 && <p className="py-8 text-center text-sm text-subtle">Start a conversation — your coach is here to listen.</p>}
        {data.coachMessages.map(m => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-white" : "glass-surface text-foreground"}`}>{m.content}</div>
          </div>
        ))}
      </GlassCard>
      <div className="flex flex-wrap gap-2">{PROMPTS.map(p => <button key={p} type="button" onClick={() => setMsg(p)} className="rounded-full bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:bg-primary-subtle hover:text-primary">{p}</button>)}</div>
      <div className="flex gap-2">
        <GlassInput value={msg} onChange={e => setMsg(e.target.value)} placeholder="Share what's on your mind..." aria-label="Message to coach" className="flex-1" onKeyDown={e => { if (e.key === "Enter" && msg.trim()) { sendCoachMessage(msg.trim()); setMsg(""); } }} />
        <GlassButton onClick={() => { if (msg.trim()) { sendCoachMessage(msg.trim()); setMsg(""); } }}>Send</GlassButton>
      </div>
    </div>
  );
}
