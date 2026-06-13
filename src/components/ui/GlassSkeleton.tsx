interface GlassSkeletonProps { className?: string; }
export function GlassSkeleton({ className = "" }: GlassSkeletonProps) {
  return <div className={`shimmer rounded-[24px] bg-surface ${className}`} aria-hidden="true" />;
}
