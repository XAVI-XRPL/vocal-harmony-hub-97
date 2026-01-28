import { motion } from "framer-motion";
import { Mic2, Volume2, VolumeX } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassSlider } from "@/components/ui/glass-slider";
import { IconButton } from "@/components/ui/icon-button";
import { WaveformDisplay } from "@/components/audio/WaveformDisplay";
import { useAudioStore, useEffectiveStemVolume } from "@/stores/audioStore";
import { Stem, StemType } from "@/types";
import { cn } from "@/lib/utils";

// Stem icon mapping
const stemIcons: Record<StemType, typeof Mic2> = {
  vocal: Mic2,
  harmony: Mic2,
  instrumental: Mic2,
  drums: Mic2,
  bass: Mic2,
  keys: Mic2,
  other: Mic2,
};

interface StemTrackProps {
  stem: Stem;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function StemTrack({ stem, currentTime, duration, onSeek }: StemTrackProps) {
  const stemStates = useAudioStore((state) => state.stemStates);
  const setStemVolume = useAudioStore((state) => state.setStemVolume);
  const toggleStemMute = useAudioStore((state) => state.toggleStemMute);
  const toggleStemSolo = useAudioStore((state) => state.toggleStemSolo);
  const isPlaying = useAudioStore((state) => state.isPlaying);

  const stemState = stemStates.find((s) => s.stemId === stem.id);
  const effectiveVolume = useEffectiveStemVolume(stem.id);

  const isMuted = stemState?.isMuted || false;
  const isSolo = stemState?.isSolo || false;
  const volume = stemState?.volume || 1;

  // Check if other stems are soloed (making this one effectively muted)
  const hasSoloedStems = stemStates.some((s) => s.isSolo);
  const isEffectivelyMuted = hasSoloedStems && !isSolo;

  const Icon = stemIcons[stem.type] || Mic2;

  return (
    <GlassCard
      padding="md"
      hover={false}
      className={cn(
        "transition-opacity duration-200",
        (isMuted || isEffectivelyMuted) && "opacity-40"
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${stem.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: stem.color }} />
        </div>

        {/* Name */}
        <span className="text-sm font-medium flex-1">{stem.name}</span>

        {/* Solo button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleStemSolo(stem.id)}
          className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center",
            "transition-all duration-200",
            isSolo
              ? "bg-stem-vocal/30 border-stem-vocal/60"
              : "bg-glass border-glass-border hover:border-glass-border-hover"
          )}
          style={isSolo ? {
            boxShadow: `0 0 20px ${stem.color}40, inset 0 0 10px ${stem.color}20`,
          } : undefined}
        >
          <span
            className={cn(
              "text-xs font-semibold",
              isSolo ? "text-stem-vocal" : "text-muted-foreground"
            )}
          >
            S
          </span>
        </motion.button>

        {/* Mute button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleStemMute(stem.id)}
          className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center",
            "transition-all duration-200",
            isMuted
              ? "bg-destructive/30 border-destructive/60"
              : "bg-glass border-glass-border hover:border-glass-border-hover"
          )}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-destructive" />
          ) : (
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          )}
        </motion.button>
      </div>

      {/* Waveform */}
      <div className="mb-3">
        <WaveformDisplay
          waveformData={stem.waveformData || []}
          currentTime={currentTime}
          duration={duration}
          color={stem.color}
          height={40}
          onSeek={onSeek}
          isPlaying={isPlaying}
          showProgress={!isMuted && !isEffectivelyMuted}
        />
      </div>

      {/* Volume slider */}
      <GlassSlider
        value={volume}
        onChange={(v) => setStemVolume(stem.id, v)}
        color={stem.color}
        size="sm"
        disabled={isMuted}
      />
    </GlassCard>
  );
}
