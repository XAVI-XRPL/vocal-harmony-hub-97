import { cn } from "@/lib/utils";

interface LoadingShimmerProps {
  className?: string;
}

export function LoadingShimmer({ className }: LoadingShimmerProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/50 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}

interface SongCardSkeletonProps {
  className?: string;
}

export function SongCardSkeleton({ className }: SongCardSkeletonProps) {
  return (
    <div className={cn("glass-card p-4", className)}>
      {/* Cover art placeholder */}
      <div className="aspect-square rounded-xl relative overflow-hidden">
        <LoadingShimmer className="absolute inset-0" />
      </div>

      {/* Text placeholders */}
      <div className="mt-4 space-y-2">
        <LoadingShimmer className="h-4 w-3/4" />
        <LoadingShimmer className="h-3 w-1/2" />
      </div>

      {/* Meta placeholder */}
      <div className="mt-3 flex gap-2">
        <LoadingShimmer className="h-6 w-16 rounded-full" />
        <LoadingShimmer className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

interface LibrarySkeletonProps {
  count?: number;
}

export function LibrarySkeleton({ count = 6 }: LibrarySkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 100}ms` }}
          className="animate-fade-in"
        >
          <SongCardSkeleton />
        </div>
      ))}
    </div>
  );
}

interface StemTrackSkeletonProps {
  className?: string;
}

export function StemTrackSkeleton({ className }: StemTrackSkeletonProps) {
  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex items-center gap-4">
        {/* Icon and name */}
        <LoadingShimmer className="w-10 h-10 rounded-xl" />
        <LoadingShimmer className="h-4 w-24" />

        {/* Solo/Mute buttons */}
        <div className="flex gap-2 ml-auto">
          <LoadingShimmer className="w-10 h-10 rounded-xl" />
          <LoadingShimmer className="w-10 h-10 rounded-xl" />
        </div>

        {/* Volume slider */}
        <LoadingShimmer className="h-2 w-24 rounded-full" />
      </div>

      {/* Waveform */}
      <div className="mt-4">
        <LoadingShimmer className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}
