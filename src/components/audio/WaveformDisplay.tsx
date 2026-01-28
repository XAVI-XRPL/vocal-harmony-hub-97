import { useMemo } from "react";
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
}: WaveformDisplayProps) {
  const progress = duration > 0 ? currentTime / duration : 0;

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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    onSeek(Math.max(0, Math.min(time, duration)));
  };

  return (
    <div
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-lg",
        className
      )}
      style={{ height }}
      onClick={handleClick}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 rounded-lg opacity-20 blur-xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, transparent ${progress * 100 + 10}%)`,
        }}
      />

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
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
    </div>
  );
}
