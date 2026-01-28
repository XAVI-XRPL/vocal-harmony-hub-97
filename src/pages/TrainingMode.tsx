import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  RotateCcw,
  Settings,
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { WaveformDisplay } from "@/components/audio/WaveformDisplay";
import { StemTrack } from "@/components/audio/StemTrack";
import { getSongById, generateMockWaveform } from "@/data/mockSongs";
import { useAudioStore } from "@/stores/audioStore";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function TrainingMode() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const song = getSongById(id || "");
  const intervalRef = useRef<number | null>(null);

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isLooping,
    setCurrentSong,
    togglePlayPause,
    seek,
    toggleLoop,
    resetMixer,
  } = useAudioStore();

  // Set current song on mount
  useEffect(() => {
    if (song && (!currentSong || currentSong.id !== song.id)) {
      setCurrentSong(song);
    }
  }, [song, currentSong, setCurrentSong]);

  // Simulate playback timer
  useEffect(() => {
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
  }, [isPlaying]);

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
    seek(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    seek(Math.min(duration, currentTime + 10));
  };

  // Generate master waveform from all stems combined
  const masterWaveform = generateMockWaveform(400);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0">
        <div className="flex items-center justify-between h-14 px-4 safe-top">
          <div className="flex items-center gap-3">
            <IconButton
              icon={ArrowLeft}
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/song/${song.id}`)}
              label="Go back"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{song.title}</p>
              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
            </div>
          </div>
          <IconButton
            icon={Settings}
            variant="ghost"
            size="sm"
            label="Settings"
          />
        </div>
      </div>

      <div className="px-4 pb-40">
        {/* Master Waveform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 mb-6"
        >
          <GlassCard padding="md" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full gradient-bg" />
              <span className="text-sm font-medium">Master</span>
            </div>
            <WaveformDisplay
              waveformData={masterWaveform}
              currentTime={currentTime}
              duration={duration}
              color="hsl(var(--primary))"
              height={60}
              onSeek={seek}
              isPlaying={isPlaying}
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stem Tracks */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {song.stems.map((stem) => (
            <motion.div key={stem.id} variants={itemVariants}>
              <StemTrack
                stem={stem}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Reset button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <GlassButton
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={resetMixer}
          >
            Reset Mixer
          </GlassButton>
        </motion.div>
      </div>

      {/* Fixed Transport Controls */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "glass-card-solid rounded-t-3xl border-x-0 border-b-0",
          "safe-bottom"
        )}
      >
        <div className="px-6 py-4">
          {/* Progress bar */}
          <div className="h-1 bg-muted/30 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-full gradient-bg"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Loop toggle */}
            <IconButton
              icon={Repeat}
              variant="accent"
              active={isLooping}
              onClick={toggleLoop}
              label="Toggle loop"
            />

            {/* Skip back */}
            <IconButton
              icon={SkipBack}
              variant="ghost"
              size="lg"
              onClick={handleSkipBack}
              label="Skip back 10 seconds"
            />

            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                "gradient-bg shadow-2xl relative"
              )}
            >
              {/* Pulsing ring when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {isPlaying ? (
                <Pause className="w-7 h-7 text-white fill-white" />
              ) : (
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              )}
            </motion.button>

            {/* Skip forward */}
            <IconButton
              icon={SkipForward}
              variant="ghost"
              size="lg"
              onClick={handleSkipForward}
              label="Skip forward 10 seconds"
            />

            {/* Placeholder for symmetry */}
            <div className="w-11 h-11" />
          </div>

          {/* Time display */}
          <div className="flex justify-center mt-2">
            <span className="text-sm text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
