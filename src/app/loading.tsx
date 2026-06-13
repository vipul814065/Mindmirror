import { GlassSkeleton } from "@/components/ui/GlassSkeleton";
export default function Loading() {
  return (<div className="mx-auto max-w-5xl space-y-6"><GlassSkeleton className="h-12 w-64" /><GlassSkeleton className="h-32" /><GlassSkeleton className="h-48" /></div>);
}
