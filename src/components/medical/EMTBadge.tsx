import { cn } from "@/lib/utils";

interface EMTBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const crossSizes = {
  sm: { width: 1.5, height: 3 },
  md: { width: 2.5, height: 5 },
  lg: { width: 4, height: 8 },
};

export function EMTBadge({ size = "md", className }: EMTBadgeProps) {
  const dimensions = crossSizes[size];

  return (
    <div
      className={cn(
        sizes[size],
        "relative flex items-center justify-center",
        "rounded-lg bg-accent-medical/20 border border-accent-medical/30",
        "shadow-[0_0_12px_hsl(var(--accent-medical)/0.3)]",
        className
      )}
    >
      {/* Vertical Bar */}
      <div
        className="absolute bg-accent-medical rounded-sm"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      />
      {/* Horizontal Bar */}
      <div
        className="absolute bg-accent-medical rounded-sm"
        style={{
          width: `${dimensions.height}px`,
          height: `${dimensions.width}px`,
        }}
      />
    </div>
  );
}
