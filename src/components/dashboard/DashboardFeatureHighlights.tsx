"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Flame,
  Heart,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const FEATURES = [
  {
    href: "/journal",
    label: "AI Journal Analysis",
    description: "Sentiment, stress, burnout & triggers",
    icon: BookOpen,
  },
  {
    href: "/insights/weekly",
    label: "AI Emotional Insights",
    description: "Pattern recognition & mood trends",
    icon: Brain,
  },
  {
    href: "/insights/triggers",
    label: "Stress Trigger Analysis",
    description: "Hidden trigger detection",
    icon: Zap,
  },
  {
    href: "/burnout",
    label: "Burnout Prediction",
    description: "Risk score & factor breakdown",
    icon: Flame,
  },
  {
    href: "/plan",
    label: "Wellness Recommendations",
    description: "Personalized action steps",
    icon: Heart,
  },
  {
    href: "/coach",
    label: "AI Companion",
    description: "Conversational wellness support",
    icon: MessageCircle,
  },
  {
    href: "/mood",
    label: "Mood Trends",
    description: "30-day mood tracking",
    icon: TrendingUp,
  },
  {
    href: "/insights/weekly",
    label: "Emotional Pattern Timeline",
    description: "Weekly hyper-personalized insights",
    icon: Sparkles,
  },
] as const;

export function DashboardFeatureHighlights() {
  return (
    <section aria-labelledby="ai-features-heading">
      <h2
        id="ai-features-heading"
        className="mb-4 font-display text-lg font-semibold text-foreground"
      >
        AI Wellness Features
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ href, label, description, icon: Icon }) => (
          <Link key={label} href={href} className="group block">
            <GlassCard className="h-full transition-transform group-hover:scale-[1.02] !p-4">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-0.5 text-xs text-muted">{description}</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
