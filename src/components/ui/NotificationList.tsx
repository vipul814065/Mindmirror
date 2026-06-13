"use client";

import { Bell } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { DemoNotification } from "@/types/wellness";

interface NotificationListProps {
  items: DemoNotification[];
  limit?: number;
}

export function NotificationList({ items, limit = 5 }: NotificationListProps) {
  const shown = items.slice(0, limit);
  const unread = shown.filter((n) => !n.read).length;

  return (
    <GlassCard ariaLabel="Notifications">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-foreground">
          Notifications
        </h2>
        {unread > 0 && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
            {unread} new
          </span>
        )}
      </div>
      {shown.length === 0 ? (
        <p className="py-4 text-center text-sm text-subtle">No notifications.</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((item) => (
            <li
              key={item.id}
              className={`flex gap-3 rounded-xl p-3 ${item.read ? "bg-transparent" : "bg-primary-subtle"}`}
            >
              <Bell
                className={`mt-0.5 h-4 w-4 shrink-0 ${item.read ? "text-muted" : "text-primary"}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted">{item.message}</p>
                <p className="mt-1 text-xs text-subtle">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
