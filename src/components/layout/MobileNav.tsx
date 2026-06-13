"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Settings, MoreHorizontal } from "lucide-react";
import { NavLink } from "./NavLink";
import { NAV } from "./Sidebar";

const MOBILE_PRIMARY = NAV.slice(0, 4);
const MOBILE_MORE = NAV.slice(4);

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setMoreOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMoreOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
        />
      )}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 lg:hidden"
      >
        {moreOpen && (
          <div className="glass-strong mb-2 space-y-1 rounded-[28px] p-2">
            {MOBILE_MORE.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <NavLink
                  key={item.href}
                  {...item}
                  active={active}
                  compact
                  onNavigate={() => setMoreOpen(false)}
                />
              );
            })}
            <Link
              href="/mindfulness"
              aria-current={pathname === "/mindfulness" ? "page" : undefined}
              className={`flex min-h-[44px] flex-col items-center justify-center text-xs ${
                pathname === "/mindfulness" ? "text-primary" : "text-muted"
              }`}
              onClick={() => setMoreOpen(false)}
            >
              <span>Mindfulness</span>
            </Link>
            <Link
              href="/settings"
              aria-current={pathname === "/settings" ? "page" : undefined}
              className={`flex min-h-[44px] flex-col items-center justify-center text-xs ${
                pathname === "/settings" ? "text-primary" : "text-muted"
              }`}
              onClick={() => setMoreOpen(false)}
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
              <span>Settings</span>
            </Link>
          </div>
        )}
        <div className="glass-strong flex justify-around rounded-[28px] px-2 py-2">
          {MOBILE_PRIMARY.map((item) => {
            const active = pathname === item.href;
            return <NavLink key={item.href} {...item} active={active} compact />;
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={`flex min-h-[44px] flex-col items-center justify-center text-xs ${
              moreOpen ? "text-primary" : "text-muted"
            }`}
            aria-expanded={moreOpen}
            aria-label="More navigation options"
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
