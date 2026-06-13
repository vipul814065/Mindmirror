import type { ReactNode } from "react";
export function GlassTable({ children }: { children: ReactNode }) {
  return <div className="glass overflow-hidden rounded-[24px]"><table className="w-full text-sm">{children}</table></div>;
}
