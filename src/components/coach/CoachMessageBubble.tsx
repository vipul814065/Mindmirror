import type { CoachMessage } from "@/types/wellness";

interface CoachMessageBubbleProps {
  message: CoachMessage;
}

export function CoachMessageBubble({ message }: CoachMessageBubbleProps) {
  return (
    <div
      className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          message.role === "user"
            ? "bg-primary text-white"
            : "glass-surface text-foreground"
        }`}
        aria-label={message.role === "user" ? "You said" : "Coach said"}
      >
        {message.role === "assistant" && (
          <span className="mb-1 block text-xs font-medium text-primary">AI Coach</span>
        )}
        {message.content}
      </div>
    </div>
  );
}
