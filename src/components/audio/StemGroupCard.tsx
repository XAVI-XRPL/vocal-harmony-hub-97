import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Loader2, Music2, Download, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StemTrack } from "@/components/audio/StemTrack";
import { Stem } from "@/types";
import { StemGroupState } from "@/services/webAudioEngine";
import { cn } from "@/lib/utils";

interface StemGroupCardProps {
  groupState: StemGroupState;
  stems: Stem[];
  currentTime: number;
  duration: number;
  loopStart: number;
  loopEnd: number;
  isLooping: boolean;
  onSeek: (time: number) => void;
  onLoadGroup: (groupId: string) => void;
  onVolumeChange: (stemId: string, volume: number) => void;
  onMuteToggle: (stemId: string) => void;
  onSoloToggle: (stemId: string) => void;
}

export function StemGroupCard({
  groupState,
  stems,
  currentTime,
  duration,
  loopStart,
  loopEnd,
  isLooping,
  onSeek,
  onLoadGroup,
  onVolumeChange,
  onMuteToggle,
  onSoloToggle,
}: StemGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTap = () => {
    if (!groupState.isLoaded && !groupState.isLoading) {
      // First tap: start loading and expand
      setIsExpanded(true);
      onLoadGroup(groupState.id);
    } else {
      // Already loaded or loading: just toggle expand
      setIsExpanded(!isExpanded);
    }
  };

  const loadedCount = stems.length; // Will show progress per-stem inside
  
  return (
    <GlassCard padding="sm" hover={false}>
      {/* Header - always visible */}
      <button
        onClick={handleTap}
        className="w-full flex items-center justify-between py-1"
      >
        <div className="flex items-center gap-2">
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/20">
            <Music2 className="w-4 h-4 text-accent-foreground" />
          </div>

          {/* Name and badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">{groupState.name}</span>
            <span className="text-[10px] text-muted-foreground">
              ({stems.length} tracks)
            </span>

            {/* Status badge */}
            {!groupState.isLoaded && !groupState.isLoading && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-primary/20 text-primary">
                <Download className="w-2.5 h-2.5" />
                Tap to load
              </span>
            )}

            {groupState.isLoading && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-warning/20 text-warning">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Loading...
              </span>
            )}

            {groupState.isLoaded && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-primary/20 text-primary">
                <Check className="w-2.5 h-2.5" />
                Ready
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div className="p-1">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content - stem tracks */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {stems.map((stem) => (
                <StemTrack
                  key={stem.id}
                  stem={stem}
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={onSeek}
                  loopStart={loopStart}
                  loopEnd={loopEnd}
                  isLooping={isLooping}
                  onVolumeChange={onVolumeChange}
                  onMuteToggle={onMuteToggle}
                  onSoloToggle={onSoloToggle}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
