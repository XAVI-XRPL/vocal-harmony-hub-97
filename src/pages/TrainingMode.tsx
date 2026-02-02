import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { WaveformDisplay } from "@/components/audio/WaveformDisplay";
import { StemTrack } from "@/components/audio/StemTrack";
import { TempoControl } from "@/components/audio/TempoControl";
import { LoopControls } from "@/components/audio/LoopControls";
import { LoopRegion } from "@/components/audio/LoopRegion";
import { getSongById, generateMockWaveform } from "@/data/mockSongs";
import { useAudioStore } from "@/stores/audioStore";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

export default function TrainingMode() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const song = getSongById(id || "");
  const intervalRef = useRef<number | null>(null);
  const [showControls, setShowControls] = React.useState(false);

  // Audio player hook for real audio
  const { isLoaded, loadingProgress, seekTo, hasRealAudio } = useAudioPlayer();

  // Practice session tracking
  usePracticeSession(song?.id);

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isLooping,
    loopStart,
    loopEnd,
    playbackRate,
    stemStates,
    setCurrentSong,
    togglePlayPause,
    seek,
    setLoop,
    toggleLoop,
    clearLoop,
    setPlaybackRate,
    resetMixer,
    updateCurrentTime,
  } = useAudioStore();

  // Calculate master volume/mute from stem states
  const hasSoloedStems = stemStates.some(s => s.isSolo);
  const allMuted = stemStates.every(s => s.isMuted);
  const masterVolume = stemStates.length > 0 
    ? stemStates.reduce((acc, s) => acc + s.volume, 0) / stemStates.length 
    : 1;

  // Set current song on mount
  useEffect(() => {
    if (song && (!currentSong || currentSong.id !== song.id)) {
      setCurrentSong(song);
    }
  }, [song, currentSong, setCurrentSong]);

  // Simulate playback timer for mock songs (no real audio)
  useEffect(() => {
    // Only use simulated timer if no real audio is loaded
    if (hasRealAudio) return;

    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        useAudioStore.getState().updateCurrentTime(
          Math.min(
            useAudioStore.getState().currentTime + 0.1,
            useAudioStore.getState().duration
          )
        );
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, hasRealAudio]);

  // Redirect if song not found
  useEffect(() => {
    if (!song) {
      navigate("/library");
    }
  }, [song, navigate]);

  if (!song) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    if (hasRealAudio) {
      seekTo(newTime);
    } else {
      seek(newTime);
    }
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    if (hasRealAudio) {
      seekTo(newTime);
    } else {
      seek(newTime);
    }
  };

  const handleSeek = (time: number) => {
    if (hasRealAudio) {
      seekTo(time);
    } else {
      seek(time);
    }
  };

  const handleSetLoopStart = () => {
    setLoop(currentTime, loopEnd > currentTime ? loopEnd : duration);
  };

  const handleSetLoopEnd = () => {
    if (currentTime > loopStart) {
      setLoop(loopStart, currentTime);
    }
  };

  // Generate master waveform from all stems combined
  const masterWaveform = generateMockWaveform(200);

  // Check if this song has real audio
  const songHasRealAudio = song.stems.some(stem => stem.url && stem.url.length > 0);

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">
      {/* Header - Compact */}
      <div className="z-40 glass-card rounded-none border-x-0 border-t-0 flex-shrink-0">
        <div className="flex items-center justify-between h-12 px-3 safe-top">
          <div className="flex items-center gap-2">
            <IconButton
              icon={ArrowLeft}
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/song/${song.id}`)}
              label="Go back"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{song.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{song.artist}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Loading indicator */}
            {songHasRealAudio && !isLoaded && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{Math.round(loadingProgress)}%</span>
              </div>
            )}
            <GlassButton
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={resetMixer}
            >
              Reset
            </GlassButton>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main content area - flex grow with hidden overflow */}
      <div className="flex-1 flex flex-col min-h-0 px-3 py-2">
        {/* Master Waveform - With indicator for real audio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 mb-2"
        >
          <GlassCard 
            padding="sm" 
            hover={false}
            className={cn(
              "transition-opacity duration-200",
              allMuted && "opacity-50"
            )}
          >
            {/* Master header row with controls */}
            <div className="flex items-center gap-2 mb-2">
              {/* Icon and label */}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full gradient-bg" />
                <span className="text-xs font-medium">Master</span>
                {songHasRealAudio && isLoaded && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-500/20 text-green-500">
                    LIVE
                  </span>
                )}
              </div>

              {/* Volume indicator */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                {allMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-destructive shrink-0" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-bg transition-all duration-200"
                    style={{ width: `${masterVolume * 100}%` }}
                  />
                </div>
              </div>

              {/* Time display */}
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Waveform with Loop Region */}
            <div className="relative">
              <WaveformDisplay
                waveformData={masterWaveform}
                currentTime={currentTime}
                duration={duration}
                color="#818cf8"
                height={40}
                onSeek={handleSeek}
                isPlaying={isPlaying}
                mirrored={true}
                showProgress={!allMuted}
              />
              {/* Loop region overlay */}
              {loopEnd > loopStart && (
                <LoopRegion
                  loopStart={loopStart}
                  loopEnd={loopEnd}
                  duration={duration}
                  isLooping={isLooping}
                  height={40}
                />
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Tempo & Loop Controls - Expandable */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex-shrink-0 mb-2"
        >
          <GlassCard padding="sm" hover={false}>
            {/* Toggle header */}
            <button
              onClick={() => setShowControls(!showControls)}
              className="w-full flex items-center justify-between py-2 px-3 -mx-3 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/30 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="text-xs font-semibold text-foreground relative z-10">
                Training Controls
              </span>
              <div className="flex items-center gap-2">
                {/* Active indicators */}
                {playbackRate !== 1 && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/20 text-primary">
                    {Math.round(playbackRate * 100)}%
                  </span>
                )}
                {loopEnd > loopStart && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/20 text-primary">
                    Loop
                  </span>
                )}
                {showControls ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Expandable content */}
            {showControls && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-3 space-y-4"
              >
                {/* Tempo Control */}
                <TempoControl
                  playbackRate={playbackRate}
                  onPlaybackRateChange={setPlaybackRate}
                />

                {/* Loop Controls */}
                <LoopControls
                  currentTime={currentTime}
                  duration={duration}
                  loopStart={loopStart}
                  loopEnd={loopEnd}
                  isLooping={isLooping}
                  onSetLoopStart={handleSetLoopStart}
                  onSetLoopEnd={handleSetLoopEnd}
                  onToggleLoop={toggleLoop}
                  onClearLoop={clearLoop}
                />
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Stem Tracks - Scrollable if needed */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto hide-scrollbar space-y-2 pb-2"
        >
          {song.stems.map((stem) => (
            <motion.div key={stem.id} variants={itemVariants}>
              <StemTrack
                stem={stem}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Fixed Transport Controls - More compact */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "z-50 flex-shrink-0",
          "glass-card-solid rounded-t-2xl border-x-0 border-b-0",
          "safe-bottom"
        )}
      >
        <div className="px-4 py-3">
          {/* Progress bar */}
          <div 
            className="h-1 bg-muted/30 rounded-full mb-3 overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              handleSeek(percent * duration);
            }}
          >
            <motion.div
              className="h-full gradient-bg"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {/* Skip back */}
            <IconButton
              icon={SkipBack}
              variant="ghost"
              onClick={handleSkipBack}
              label="Skip back 10 seconds"
            />

            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              disabled={songHasRealAudio && !isLoaded}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center",
                "gradient-bg shadow-xl relative",
                songHasRealAudio && !isLoaded && "opacity-50"
              )}
            >
              {/* Pulsing ring when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-foreground/30"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {songHasRealAudio && !isLoaded ? (
                <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
              ) : (
                <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
              )}
            </motion.button>

            {/* Skip forward */}
            <IconButton
              icon={SkipForward}
              variant="ghost"
              onClick={handleSkipForward}
              label="Skip forward 10 seconds"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
