import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  color?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

const GlassSlider = React.forwardRef<HTMLDivElement, GlassSliderProps>(
  (
    {
      value,
      min = 0,
      max = 1,
      step = 0.01,
      onChange,
      label,
      showValue = true,
      color = "hsl(var(--primary))",
      size = "md",
      disabled = false,
      className,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    const percentage = ((value - min) / (max - min)) * 100;

    const handleInteraction = React.useCallback(
      (clientX: number) => {
        if (disabled || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const newPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const newValue = min + (newPercentage / 100) * (max - min);
        const steppedValue = Math.round(newValue / step) * step;
        onChange(Math.max(min, Math.min(max, steppedValue)));
      },
      [disabled, min, max, step, onChange]
    );

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      handleInteraction(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      setIsDragging(true);
      handleInteraction(e.touches[0].clientX);
    };

    React.useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => handleInteraction(e.clientX);
      const handleTouchMove = (e: TouchEvent) => handleInteraction(e.touches[0].clientX);
      const handleEnd = () => setIsDragging(false);

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleEnd);
      };
    }, [isDragging, handleInteraction]);

    const trackHeight = size === "sm" ? "h-1.5" : "h-2";
    const thumbSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    return (
      <div
        ref={ref}
        className={cn("relative flex items-center", className)}
      >
        {label && (
          <span className="mr-3 text-xs text-muted-foreground whitespace-nowrap">
            {label}
          </span>
        )}

        <div
          ref={sliderRef}
          className={cn(
            "relative flex-1 h-10 flex items-center cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Track background */}
          <div
            className={cn(
              "absolute w-full rounded-full bg-secondary/50",
              trackHeight
            )}
          >
            {/* Fill */}
            <motion.div
              className={cn("h-full rounded-full", trackHeight)}
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${color}99, ${color})`,
              }}
              layout
            />
          </div>

          {/* Thumb */}
          <motion.div
            className={cn(
              "absolute rounded-full cursor-grab active:cursor-grabbing",
              "border-2 border-background",
              thumbSize
            )}
            style={{
              left: `calc(${percentage}% - ${size === "sm" ? "8px" : "10px"})`,
              background: color,
              boxShadow: `0 0 ${isDragging ? 20 : 10}px ${color}80`,
            }}
            animate={{
              scale: isDragging ? 1.3 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Inner glow */}
            <div className="absolute inset-1 rounded-full bg-white/30" />
          </motion.div>

          {/* Value tooltip */}
          <AnimatePresence>
            {isDragging && showValue && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-8 px-2 py-1 rounded-lg bg-popover/90 text-xs text-popover-foreground backdrop-blur-sm border border-glass-border"
                style={{ left: `calc(${percentage}% - 16px)` }}
              >
                {Math.round(value * 100)}%
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

GlassSlider.displayName = "GlassSlider";

export { GlassSlider };
