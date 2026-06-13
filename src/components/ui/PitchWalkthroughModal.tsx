"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/hooks/useAppStore";
import { GlassButton } from "./GlassButton";
import { PITCH_STEPS } from "@/lib/pitch/pitch-steps";
import { DEMO_COACH_PROMPT } from "@/lib/constants/demo";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface PitchWalkthroughModalProps {
  open: boolean;
  onClose: () => void;
  onLoadSample: () => void;
}

const STEP_HINTS: Record<string, string> = {
  dashboard:
    "Review wellness metrics, burnout ring, and the hero AI insight on the dashboard.",
  "weekly-insights":
    "Open Weekly Insights to see pattern cards and the signature mock-test stress narrative.",
  journal:
    "Use “Try demo entry” to analyze a mock-test journal and view full AI output.",
  coach: `Send “${DEMO_COACH_PROMPT}” to see an empathetic, exam-specific coach response.`,
  plan: "View personalized action items with category badges and checkboxes.",
  burnout: "See the animated burnout meter with factor breakdown and tips.",
  triggers: "View auto-detected stress triggers and the 43% mock-test breakdown chart.",
  analytics: "Explore 8 production-ready charts including mood trend and study heatmap.",
  mindfulness: "Try adaptive breathing and grounding exercises matched to your triggers.",
  motivation: "See daily encouragement and coach responses with motivational closings.",
  academic: "Track study hours, mock tests, and confidence growth in analytics.",
  "hyper-insights": "Read hyper-personalized AI insights and the signature hero quote.",
};

export function PitchWalkthroughModal({
  open,
  onClose,
  onLoadSample,
}: PitchWalkthroughModalProps) {
  const router = useRouter();
  const { markPitchStepComplete, sendCoachMessage } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const containerRef = useFocusTrap(open);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStepIndex(0);
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const step = PITCH_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === PITCH_STEPS.length - 1;

  const handleGoToStep = () => {
    markPitchStepComplete(step.id);
    if (step.id === "coach") {
      sendCoachMessage(DEMO_COACH_PROMPT);
    }
    const href =
      step.id === "journal" ? `${step.href}?demo=mock` : step.href;
    router.push(href);
    if (isLast) {
      onClose();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pitch-walkthrough-title"
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => {
          setStepIndex(0);
          onClose();
        }}
        aria-hidden="true"
      />
      <div ref={containerRef} className="glass-strong relative w-full max-w-lg rounded-[28px] p-6 shadow-xl">
        <button
          type="button"
          onClick={() => {
            setStepIndex(0);
            onClose();
          }}
          className="absolute right-4 top-4 rounded-full p-1 text-muted hover:bg-surface hover:text-foreground"
          aria-label="Close walkthrough"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Step {stepIndex + 1} of {PITCH_STEPS.length}
        </p>
        <h2 id="pitch-walkthrough-title" className="mt-2 font-display text-xl font-bold text-foreground">
          {step.label}
        </h2>
        <p className="mt-2 text-sm text-muted">{step.requirement}</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {STEP_HINTS[step.id]}
        </p>

        {stepIndex === 0 && (
          <GlassButton
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onLoadSample}
          >
            Load Sample Week first
          </GlassButton>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <GlassButton
            variant="ghost"
            size="sm"
            disabled={isFirst}
            onClick={() => setStepIndex((i) => i - 1)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </GlassButton>
          <div className="flex gap-2">
            <Link
              href={step.href}
              className="text-sm text-muted hover:text-primary"
              onClick={() => markPitchStepComplete(step.id)}
            >
              Skip to page
            </Link>
            <GlassButton size="sm" onClick={handleGoToStep}>
              {isLast ? "Finish" : "Go & next"}
              {!isLast && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
}
