import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Music2, Volume2, Waves, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AudioLoadingOverlayProps {
  isVisible: boolean;
  loadingProgress: number;
  bufferedCount: number;
  totalStemCount: number;
  songTitle?: string;
  songArtist?: string;
  audioMode?: 'mixdown' | 'crossfading' | 'stems';
}

export function AudioLoadingOverlay({
  isVisible,
  loadingProgress,
  bufferedCount,
  totalStemCount,
  songTitle,
  songArtist,
  audioMode = 'stems',
}: AudioLoadingOverlayProps) {
  // Calculate phase based on progress
  const isLoadingFiles = loadingProgress < 100;
  
  // Phase messaging based on Web Audio loading
  let phase = "Loading audio...";
  let phaseDetail = "Preparing stems for playback";
  
  if (bufferedCount === 0) {
    phase = "Initializing...";
    phaseDetail = "Setting up audio engine";
  } else if (isLoadingFiles) {
    phase = "Decoding stems...";
    phaseDetail = `${bufferedCount} of ${totalStemCount} tracks decoded`;
  } else {
    phase = "Almost ready...";
    phaseDetail = "Preparing synchronized playback";
  }
  
  const progress = totalStemCount > 0
    ? (bufferedCount / totalStemCount) * 100
    : loadingProgress;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className={cn(
            "fixed inset-0 z-[100] flex flex-col items-center justify-center",
            "bg-background/95 backdrop-blur-xl"
          )}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -inset-[100px] opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.4) 0%, transparent 50%)",
                  "radial-gradient(circle at 70% 50%, hsl(var(--primary) / 0.4) 0%, transparent 50%)",
                  "radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.4) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="relative z-10 flex flex-col items-center gap-6 px-8 max-w-sm w-full"
          >
            {/* Icon with Web Audio waveform animation */}
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/30">
                <Waves className="w-10 h-10 text-primary-foreground" />
              </div>
              {/* Loading spinner around icon */}
              <motion.div
                className="absolute -inset-2 rounded-3xl border-2 border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ borderTopColor: "hsl(var(--primary))" }}
              />
            </motion.div>

            {/* Song info */}
            {songTitle && (
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground">{songTitle}</h2>
                {songArtist && (
                  <p className="text-sm text-muted-foreground">{songArtist}</p>
                )}
              </div>
            )}

            {/* Progress section */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {phase}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>

              <Progress value={progress} className="h-2" />

              {/* Stem counter with detail */}
              {totalStemCount > 0 && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Volume2 className="w-3 h-3" />
                  <span>{phaseDetail}</span>
                </div>
              )}
            </div>

            {/* Web Audio API indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-medium">
                Web Audio Engine
              </span>
            </div>

            {/* Preparing hint */}
            <p className="text-xs text-muted-foreground text-center">
              Decoding audio for sample-accurate sync...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}