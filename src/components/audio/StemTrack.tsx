import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { Mic2, Music, Guitar, Drum, Piano, VolumeX, Volume2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassSlider } from "@/components/ui/glass-slider";
import { WaveformDisplay } from "@/components/audio/WaveformDisplay";
import { useAudioStore, useEffectiveStemVolume } from "@/stores/audioStore";
import { Stem, StemType } from "@/types";
import { cn } from "@/lib/utils";

// Stem icon mapping with appropriate icons
const stemIcons: Record<StemType, typeof Mic2> = {
  vocal: Mic2,
  harmony: Music,
  instrumental: Guitar,
  drums: Drum,
  bass: Guitar,
  keys: Piano,
  other: Music,
};

interface StemTrackProps {
  stem: Stem;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  // Loop props for unified display
  loopStart?: number;
  loopEnd?: number;
  isLooping?: boolean;
}

export const StemTrack = forwardRef<HTMLDivElement, StemTrackProps>(
  ({ stem, currentTime, duration, onSeek, loopStart = 0, loopEnd = 0, isLooping = false }, ref) => {
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
        ref={ref}
        padding="sm"
        hover={false}
        className={cn(
          "transition-all duration-200",
          (isMuted || isEffectivelyMuted) && "opacity-40"
        )}
      >
        {/* Compact single-row header: Icon, Name, Solo, Mute, Volume */}
        <div className="flex items-center gap-2 mb-2">
          {/* Icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${stem.color}25` }}
          >
            <Icon className="w-4 h-4" style={{ color: stem.color }} />
          </div>

          {/* Name */}
          <span className="text-xs font-medium truncate flex-shrink-0 w-16">
            {stem.name}
          </span>

          {/* Solo button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleStemSolo(stem.id)}
            className={cn(
              "w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0",
              "transition-all duration-200",
              isSolo
                ? "border-transparent"
                : "bg-glass border-glass-border hover:border-glass-border-hover"
            )}
            style={isSolo ? {
              background: `${stem.color}30`,
              borderColor: `${stem.color}60`,
              boxShadow: `0 0 16px ${stem.color}50`,
            } : undefined}
          >
            <span
              className={cn(
                "text-[10px] font-bold",
                isSolo ? "" : "text-muted-foreground"
              )}
              style={isSolo ? { color: stem.color } : undefined}
            >
              S
            </span>
          </motion.button>

          {/* Mute button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleStemMute(stem.id)}
            className={cn(
              "w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0",
              "transition-all duration-200",
              isMuted
                ? "bg-destructive/30 border-destructive/60"
                : "bg-glass border-glass-border hover:border-glass-border-hover"
            )}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-destructive" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </motion.button>

          {/* Volume slider - takes remaining space */}
          <div className="flex-1 min-w-0">
            <GlassSlider
              value={volume}
              onChange={(v) => setStemVolume(stem.id, v)}
              color={stem.color}
              size="sm"
              disabled={isMuted}
            />
          </div>
        </div>

        {/* Compact waveform with loop region */}
        <WaveformDisplay
          waveformData={stem.waveformData || []}
          currentTime={currentTime}
          duration={duration}
          color={stem.color}
          height={32}
          onSeek={onSeek}
          isPlaying={isPlaying}
          showProgress={!isMuted && !isEffectivelyMuted}
          mirrored={true}
          loopStart={loopStart}
          loopEnd={loopEnd}
          isLooping={isLooping}
        />
      </GlassCard>
    );
  }
);

StemTrack.displayName = "StemTrack";
