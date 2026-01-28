import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import { GlassSlider } from "@/components/ui/glass-slider";
import { cn } from "@/lib/utils";

interface TempoControlProps {
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  className?: string;
}

const TEMPO_PRESETS = [
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1.0, label: "100%" },
  { value: 1.25, label: "125%" },
  { value: 1.5, label: "150%" },
];

export function TempoControl({
  playbackRate,
  onPlaybackRateChange,
  className,
}: TempoControlProps) {
  const getTempoColor = () => {
    if (playbackRate < 0.9) return "text-blue-400";
    if (playbackRate > 1.1) return "text-orange-400";
    return "text-foreground";
  };

  const getTempoGradient = () => {
    if (playbackRate < 0.9) {
      return "from-blue-500/20 to-blue-500/5";
    }
    if (playbackRate > 1.1) {
      return "from-orange-500/20 to-orange-500/5";
    }
    return "from-primary/20 to-primary/5";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              rotate: playbackRate !== 1 ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <Gauge className={cn("w-4 h-4", getTempoColor())} />
          </motion.div>
          <span className="text-xs font-medium text-muted-foreground">Tempo</span>
        </div>
        
        {/* Current tempo badge */}
        <motion.div
          key={playbackRate}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-bold",
            "bg-gradient-to-r",
            getTempoGradient(),
            getTempoColor()
          )}
        >
          {Math.round(playbackRate * 100)}%
        </motion.div>
      </div>

      {/* Tempo slider */}
      <GlassSlider
        value={playbackRate}
        min={0.5}
        max={1.5}
        step={0.05}
        onChange={onPlaybackRateChange}
        showValue={false}
        className="w-full"
      />

      {/* Preset buttons */}
      <div className="flex items-center justify-between gap-1">
        {TEMPO_PRESETS.map((preset) => (
          <motion.button
            key={preset.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPlaybackRateChange(preset.value)}
            className={cn(
              "flex-1 py-1 px-1.5 rounded-md text-[10px] font-medium transition-all",
              "border border-transparent",
              playbackRate === preset.value
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-glass hover:bg-glass-hover text-muted-foreground hover:text-foreground"
            )}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
