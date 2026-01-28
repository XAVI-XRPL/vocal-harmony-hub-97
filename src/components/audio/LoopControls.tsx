import { motion } from "framer-motion";
import { Repeat, X } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";

interface LoopControlsProps {
  currentTime: number;
  duration: number;
  loopStart: number;
  loopEnd: number;
  isLooping: boolean;
  onSetLoopStart: () => void;
  onSetLoopEnd: () => void;
  onToggleLoop: () => void;
  onClearLoop: () => void;
  className?: string;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function LoopControls({
  currentTime,
  duration,
  loopStart,
  loopEnd,
  isLooping,
  onSetLoopStart,
  onSetLoopEnd,
  onToggleLoop,
  onClearLoop,
  className,
}: LoopControlsProps) {
  const hasLoopRegion = loopEnd > loopStart;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header with loop badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              rotate: isLooping ? [0, 360] : 0,
            }}
            transition={{
              duration: 2,
              repeat: isLooping ? Infinity : 0,
              ease: "linear",
            }}
          >
            <Repeat
              className={cn(
                "w-4 h-4",
                isLooping ? "text-primary" : "text-muted-foreground"
              )}
            />
          </motion.div>
          <span className="text-xs font-medium text-muted-foreground">A-B Loop</span>
        </div>

        {/* Loop range badge */}
        {hasLoopRegion && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium",
              isLooping
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {formatTime(loopStart)} - {formatTime(loopEnd)}
          </motion.div>
        )}
      </div>

      {/* Set A/B buttons and controls */}
      <div className="flex items-center gap-2">
        {/* Set A button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSetLoopStart}
          className={cn(
            "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
            "border",
            loopStart > 0
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-glass border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-hover"
          )}
        >
          <span className="font-bold mr-1">A</span>
          {loopStart > 0 ? formatTime(loopStart) : "Set Start"}
        </motion.button>

        {/* Set B button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSetLoopEnd}
          className={cn(
            "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
            "border",
            loopEnd > 0
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "bg-glass border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-hover"
          )}
        >
          <span className="font-bold mr-1">B</span>
          {loopEnd > 0 ? formatTime(loopEnd) : "Set End"}
        </motion.button>

        {/* Toggle/Clear buttons */}
        {hasLoopRegion && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleLoop}
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                "border",
                isLooping
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-glass border-glass-border text-muted-foreground hover:text-foreground"
              )}
            >
              <Repeat className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearLoop}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-glass border border-glass-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </>
        )}
      </div>

      {/* Instructions hint */}
      {!hasLoopRegion && (
        <p className="text-[10px] text-muted-foreground text-center">
          Set A and B points to create a loop region
        </p>
      )}
    </div>
  );
}
