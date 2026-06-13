"use client";
import { memo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { MoodEntry } from "@/types/wellness";
import { GlassCard } from "@/components/ui/GlassCard";
function formatDate(d: string){return new Date(d).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});}
function MoodChartComponent({ moods, compact = false }: { moods: MoodEntry[]; compact?: boolean }) {
  const data=[...moods].sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()).slice(-14).map(m=>({date:formatDate(m.date),mood:m.mood}));
  if(!data.length)return(<GlassCard ariaLabel="Mood history chart"><p className="py-8 text-center text-sm text-muted">No mood data yet.</p></GlassCard>);
  return(<GlassCard ariaLabel="Mood history chart"><ResponsiveContainer width="100%" height={compact?120:240}><AreaChart data={data} margin={{top:5,right:5,left:-20,bottom:0}}><defs><linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A855F7" stopOpacity={0.4}/><stop offset="100%" stopColor="#7C3AED" stopOpacity={0.04}/></linearGradient></defs>{!compact&&<XAxis dataKey="date" tick={{fill:"#9CA3AF",fontSize:11}} axisLine={false} tickLine={false}/>}<YAxis domain={[1,5]} ticks={[1,2,3,4,5]} tick={{fill:"#9CA3AF",fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"rgba(255,255,255,0.95)",border:"1px solid rgba(0,0,0,0.06)",borderRadius:"16px",color:"#0F0F12"}}/><Area type="monotone" dataKey="mood" stroke="#A855F7" strokeWidth={2} fill="url(#moodGradient)"/></AreaChart></ResponsiveContainer></GlassCard>);
}
export const MoodChart = memo(MoodChartComponent);
