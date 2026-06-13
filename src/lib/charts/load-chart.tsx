"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export function chartSkeleton(height = "h-60") {
  return (
    <div
      className={`glass ${height} animate-pulse rounded-2xl`}
      aria-busy="true"
      aria-label="Loading chart"
    />
  );
}

export function loadChart<P extends object>(
  importFn: () => Promise<{ [key: string]: ComponentType<P> }>,
  exportName: string,
  height = "h-60",
) {
  return dynamic(
    () => importFn().then((mod) => mod[exportName]),
    { ssr: false, loading: () => chartSkeleton(height) },
  );
}
