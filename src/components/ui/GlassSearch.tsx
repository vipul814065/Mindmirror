"use client";
import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
export function GlassSearch({ className = "", onChange, ...props }: InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (<div className={`relative ${className}`}><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" /><input type="search" className="glass-surface w-full rounded-2xl py-2.5 pl-11 pr-4 text-sm text-foreground placeholder:text-subtle focus:ring-2 focus:ring-primary-light" onChange={onChange} {...props} /></div>);
}
