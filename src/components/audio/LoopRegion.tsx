import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoopRegionProps {
  loopStart: number;
  loopEnd: number;
  duration: number;
  isLooping: boolean;
  height: number;
  className?: string;
  onLoopStartChange?: (time: number) => void;
  onLoopEndChange?: (time: number) => void;
  onClearLoop?: () => void;
}

// Double-tap detection timing
const DOUBLE_TAP_THRESHOLD_MS = 300;

export function LoopRegion({
  loopStart,
  loopEnd,
  duration,
  isLooping,
  height,
  className,
  onLoopStartChange,
  onLoopEndChange,
  onClearLoop,
}: LoopRegionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingMarker, setDraggingMarker] = useState<'start' | 'end' | null>(null);
  const lastTapTimeRef = useRef<{ start: number; end: number; region: number }>({ start: 0, end: 0, region: 0 });
  const throttleRef = useRef<number>(0);
  const THROTTLE_MS = 50;

  const startPercent = duration > 0 ? (loopStart / duration) * 100 : 0;
  const endPercent = duration > 0 ? (loopEnd / duration) * 100 : 0;
  const widthPercent = endPercent - startPercent;

  // Calculate time from pointer position
  const getTimeFromEvent = useCallback((e: React.PointerEvent | PointerEvent): number => {
    if (!containerRef.current || duration === 0) return 0;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return percentage * duration;
  }, [duration]);

  // Handle double-tap on marker to clear that point
  const handleMarkerDoubleTap = useCallback((marker: 'start' | 'end') => {
    const now = Date.now();
    const lastTap = marker === 'start' ? lastTapTimeRef.current.start : lastTapTimeRef.current.end;
    
    if (now - lastTap < DOUBLE_TAP_THRESHOLD_MS) {
      // Double tap detected - clear the loop
      onClearLoop?.();
      lastTapTimeRef.current[marker] = 0;
    } else {
      lastTapTimeRef.current[marker] = now;
    }
  }, [onClearLoop]);

  // Handle double-tap on region to clear entire loop
  const handleRegionDoubleTap = useCallback(() => {
    const now = Date.now();
    const lastTap = lastTapTimeRef.current.region;
    
    if (now - lastTap < DOUBLE_TAP_THRESHOLD_MS) {
      // Double tap detected - clear the loop
      onClearLoop?.();
      lastTapTimeRef.current.region = 0;
    } else {
      lastTapTimeRef.current.region = now;
    }
  }, [onClearLoop]);

  // Handle marker drag start
  const handleMarkerPointerDown = useCallback((marker: 'start' | 'end', e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Check for double-tap first
    handleMarkerDoubleTap(marker);
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingMarker(marker);
  }, [handleMarkerDoubleTap]);

  // Handle marker drag move with throttling to prevent React queue corruption
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingMarker) return;
    
    // Throttle updates to prevent high-frequency state changes
    const now = Date.now();
    if (now - throttleRef.current < THROTTLE_MS) return;
    throttleRef.current = now;
    
    const time = getTimeFromEvent(e);
    
    if (draggingMarker === 'start') {
      // Ensure start doesn't go past end - 0.5s minimum
      const maxStart = loopEnd - 0.5;
      const clampedTime = Math.max(0, Math.min(time, maxStart));
      onLoopStartChange?.(clampedTime);
    } else {
      // Ensure end doesn't go before start + 0.5s minimum
      const minEnd = loopStart + 0.5;
      const clampedTime = Math.max(minEnd, Math.min(time, duration));
      onLoopEndChange?.(clampedTime);
    }
  }, [draggingMarker, getTimeFromEvent, loopEnd, loopStart, duration, onLoopStartChange, onLoopEndChange]);

  // Handle marker drag end
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingMarker) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      setDraggingMarker(null);
    }
  }, [draggingMarker]);

  // Early return after all hooks
  if (duration === 0 || loopEnd <= loopStart) return null;


  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0", className)}
      style={{ height }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Loop region highlight - clickable for double-tap to clear */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLooping ? 1 : 0.5 }}
        className="absolute top-0 bottom-0 cursor-pointer"
        style={{
          left: `${startPercent}%`,
          width: `${widthPercent}%`,
        }}
        onClick={handleRegionDoubleTap}
      >
        {/* Main highlight area */}
        <div
          className={cn(
            "absolute inset-0 rounded-sm",
            isLooping
              ? "bg-primary/20 border-y border-primary/40"
              : "bg-muted/30 border-y border-muted/50"
          )}
        />

        {/* Animated pulse when looping */}
        {isLooping && (
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-sm"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {/* Start marker (A) - Draggable */}
      <motion.div
        className={cn(
          "absolute top-0 bottom-0 w-3 -ml-1.5 cursor-ew-resize z-20",
          isLooping ? "bg-green-500/20" : "bg-green-500/10"
        )}
        style={{ left: `${startPercent}%` }}
        onPointerDown={(e) => handleMarkerPointerDown('start', e)}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Visible marker line */}
        <div
          className={cn(
            "absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2",
            isLooping ? "bg-green-500" : "bg-green-500/50"
          )}
        />
        
        {/* A marker label */}
        <div
          className={cn(
            "absolute -top-0.5 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded text-[8px] font-bold select-none",
            isLooping
              ? "bg-green-500 text-white"
              : "bg-green-500/50 text-white/80"
          )}
        >
          A
        </div>
        
        {/* Glow effect */}
        {isLooping && (
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-green-500"
            animate={{
              boxShadow: [
                "0 0 4px hsl(142 76% 36% / 0.4)",
                "0 0 12px hsl(142 76% 36% / 0.6)",
                "0 0 4px hsl(142 76% 36% / 0.4)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* End marker (B) - Draggable */}
      <motion.div
        className={cn(
          "absolute top-0 bottom-0 w-3 -mr-1.5 cursor-ew-resize z-20",
          isLooping ? "bg-red-500/20" : "bg-red-500/10"
        )}
        style={{ left: `${endPercent}%`, transform: 'translateX(-50%)' }}
        onPointerDown={(e) => handleMarkerPointerDown('end', e)}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
      >
        {/* Visible marker line */}
        <div
          className={cn(
            "absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2",
            isLooping ? "bg-red-500" : "bg-red-500/50"
          )}
        />
        
        {/* B marker label */}
        <div
          className={cn(
            "absolute -top-0.5 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded text-[8px] font-bold select-none",
            isLooping
              ? "bg-red-500 text-white"
              : "bg-red-500/50 text-white/80"
          )}
        >
          B
        </div>
        
        {/* Glow effect */}
        {isLooping && (
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-red-500"
            animate={{
              boxShadow: [
                "0 0 4px hsl(0 84% 60% / 0.4)",
                "0 0 12px hsl(0 84% 60% / 0.6)",
                "0 0 4px hsl(0 84% 60% / 0.4)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
          />
        )}
      </motion.div>
    </div>
  );
}
