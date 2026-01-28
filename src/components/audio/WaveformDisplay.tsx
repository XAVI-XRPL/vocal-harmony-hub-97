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
}: WaveformDisplayProps) {
  const progress = duration > 0 ? currentTime / duration : 0;

  // Normalize waveform data
  const normalizedData = useMemo(() => {
    const max = Math.max(...waveformData);
    return waveformData.map((v) => v / max);
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
      {/* Waveform bars */}
      <div className="absolute inset-0 flex items-center gap-[2px]">
        {normalizedData.map((value, index) => {
          const barProgress = index / normalizedData.length;
          const isPlayed = barProgress < progress;

          return (
            <motion.div
              key={index}
              className="flex-1 rounded-full transition-colors duration-100"
              style={{
                height: `${value * 100}%`,
                backgroundColor: isPlayed ? color : `${color}33`,
                minWidth: 2,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.002, duration: 0.3 }}
            />
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
