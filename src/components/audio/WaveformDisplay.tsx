import { useMemo, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WaveformDisplayProps {
  waveformData: number[];
  currentTime: number;
  duration: number;
  color: string;
  height?: number;
  onSeek?: (time: number) => void;
  isPlaying?: boolean;
  showProgress?: boolean;
  className?: string;
  mirrored?: boolean;
  // Loop selection props
  onLoopSelect?: (start: number, end: number) => void;
  loopStart?: number;
  loopEnd?: number;
  isLooping?: boolean;
}

export function WaveformDisplay({
  waveformData,
  currentTime,
  duration,
  color,
  height = 60,
  onSeek,
  isPlaying = false,
  showProgress = true,
  className,
  mirrored = true,
  onLoopSelect,
  loopStart = 0,
  loopEnd = 0,
  isLooping = false,
}: WaveformDisplayProps) {
  const progress = duration > 0 ? currentTime / duration : 0;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag state for loop selection
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState<number | null>(null);
  const [dragEndTime, setDragEndTime] = useState<number | null>(null);

  // Normalize and downsample waveform data for cleaner display
  const normalizedData = useMemo(() => {
    const max = Math.max(...waveformData, 0.1);
    const targetBars = Math.min(waveformData.length, 80);
    const step = Math.max(1, Math.floor(waveformData.length / targetBars));
    
    const downsampled: number[] = [];
    for (let i = 0; i < waveformData.length; i += step) {
      const chunk = waveformData.slice(i, i + step);
      const avg = chunk.reduce((a, b) => a + b, 0) / chunk.length;
      downsampled.push(avg / max);
    }
    
    return downsampled;
  }, [waveformData]);

  // Calculate time from mouse/touch position
  const getTimeFromEvent = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): number => {
    if (!containerRef.current || duration === 0) return 0;
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number;
    
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX ?? 0;
    } else {
      clientX = e.clientX;
    }
    
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return percentage * duration;
  }, [duration]);

  // Handle click for seeking (only if not dragging a selection)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || duration === 0 || isDragging) return;
    
    const time = getTimeFromEvent(e);
    onSeek(time);
  };

  // Handle drag start for loop selection
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!onLoopSelect || duration === 0) return;
    
    // Capture pointer for tracking outside the element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    const time = getTimeFromEvent(e);
    setIsDragging(true);
    setDragStartTime(time);
    setDragEndTime(time);
  };

  // Handle drag move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !onLoopSelect) return;
    
    const time = getTimeFromEvent(e);
    setDragEndTime(time);
  };

  // Handle drag end
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartTime === null || dragEndTime === null) {
      setIsDragging(false);
      return;
    }
    
    // Release pointer capture
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    const start = Math.min(dragStartTime, dragEndTime);
    const end = Math.max(dragStartTime, dragEndTime);
    
    // Minimum 0.5s region to avoid accidental micro-selections
    if (end - start >= 0.5 && onLoopSelect) {
      onLoopSelect(start, end);
    } else if (onSeek) {
      // If too small, treat as a seek/click
      onSeek(start);
    }
    
    setIsDragging(false);
    setDragStartTime(null);
    setDragEndTime(null);
  };

  // Calculate drag selection region for preview
  const dragSelection = useMemo(() => {
    if (!isDragging || dragStartTime === null || dragEndTime === null || duration === 0) {
      return null;
    }
    
    const start = Math.min(dragStartTime, dragEndTime);
    const end = Math.max(dragStartTime, dragEndTime);
    const startPercent = (start / duration) * 100;
    const widthPercent = ((end - start) / duration) * 100;
    
    return { startPercent, widthPercent };
  }, [isDragging, dragStartTime, dragEndTime, duration]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-lg touch-none select-none",
        className
      )}
      style={{ height }}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 rounded-lg opacity-20 blur-xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, transparent ${progress * 100 + 10}%)`,
        }}
      />

      {/* Drag selection preview */}
      {dragSelection && (
        <div
          className="absolute inset-y-0 bg-primary/30 border-x-2 border-primary/50 pointer-events-none z-10"
          style={{
            left: `${dragSelection.startPercent}%`,
            width: `${dragSelection.widthPercent}%`,
          }}
        />
      )}

      {/* Waveform bars container */}
      <div className="absolute inset-0 flex items-center px-1" style={{ gap: "2px" }}>
        {normalizedData.map((value, index) => {
          const barProgress = index / normalizedData.length;
          const isPlayed = barProgress < progress;
          const barHeight = Math.max(0.2, value);

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
              style={{ flex: 1, height: "100%", gap: "1px" }}
            >
              {mirrored ? (
                // Mirrored waveform - bars extend from center
                <>
                  {/* Top bar */}
                  <motion.div
                    className="w-full rounded-sm"
                    style={{
                      flex: `0 0 ${barHeight * 45}%`,
                      background: isPlayed
                        ? `linear-gradient(to top, ${color}, ${color})`
                        : `${color}40`,
                      minHeight: 3,
                      minWidth: 3,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ 
                      scaleY: 1,
                      opacity: isPlaying && isPlayed ? [0.8, 1, 0.8] : 1,
                    }}
                    transition={{
                      scaleY: { delay: index * 0.005, duration: 0.3 },
                      opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                  />
                  {/* Center line */}
                  <div 
                    className="w-full"
                    style={{
                      height: 2,
                      background: isPlayed ? `${color}80` : `${color}30`,
                      borderRadius: 1,
                    }}
                  />
                  {/* Bottom bar (mirrored) */}
                  <motion.div
                    className="w-full rounded-sm"
                    style={{
                      flex: `0 0 ${barHeight * 45}%`,
                      background: isPlayed
                        ? `linear-gradient(to bottom, ${color}, ${color})`
                        : `${color}40`,
                      minHeight: 3,
                      minWidth: 3,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ 
                      scaleY: 1,
                      opacity: isPlaying && isPlayed ? [0.8, 1, 0.8] : 1,
                    }}
                    transition={{
                      scaleY: { delay: index * 0.005, duration: 0.3 },
                      opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 },
                    }}
                  />
                </>
              ) : (
                // Single bar - grows from bottom
                <motion.div
                  className="w-full rounded-sm self-end"
                  style={{
                    height: `${barHeight * 100}%`,
                    background: isPlayed
                      ? `linear-gradient(to top, ${color}cc, ${color})`
                      : `${color}40`,
                    minHeight: 3,
                    minWidth: 3,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ 
                    scaleY: 1,
                    opacity: isPlaying && isPlayed ? [0.8, 1, 0.8] : 1,
                  }}
                  transition={{
                    scaleY: { delay: index * 0.005, duration: 0.3 },
                    opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Playhead */}
      {showProgress && (
        <motion.div
          className="playhead"
          style={{
            left: `${progress * 100}%`,
          }}
          animate={{
            opacity: isPlaying ? 1 : 0.8,
          }}
        />
      )}

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
