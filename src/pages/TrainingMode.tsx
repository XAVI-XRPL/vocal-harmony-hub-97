import { useEffect, useRef, useState } from "react";
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
  Volume2,
  VolumeX,
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassSlider } from "@/components/ui/glass-slider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

  // Master track controls
  const [masterVolume, setMasterVolume] = useState(1);
  const [masterMuted, setMasterMuted] = useState(false);
  const [masterSolo, setMasterSolo] = useState(false);

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
  const masterWaveform = generateMockWaveform(200);

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
        {/* Master Waveform - With Solo/Mute controls */}
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
              masterMuted && "opacity-50"
            )}
          >
            {/* Master header row with controls */}
            <div className="flex items-center gap-2 mb-2">
              {/* Icon and label */}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full gradient-bg" />
                <span className="text-xs font-medium">Master</span>
              </div>

              {/* Solo button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMasterSolo(!masterSolo)}
                className={cn(
                  "w-7 h-7 rounded-lg border flex items-center justify-center",
                  "transition-all duration-200",
                  masterSolo
                    ? "border-transparent"
                    : "bg-glass border-glass-border hover:border-glass-border-hover"
                )}
                style={masterSolo ? {
                  background: "linear-gradient(135deg, #818cf8 0%, #a855f7 100%)",
                  boxShadow: "0 0 16px rgba(129, 140, 248, 0.5)",
                } : undefined}
              >
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    masterSolo ? "text-white" : "text-muted-foreground"
                  )}
                >
                  S
                </span>
              </motion.button>

              {/* Mute button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMasterMuted(!masterMuted)}
                className={cn(
                  "w-7 h-7 rounded-lg border flex items-center justify-center",
                  "transition-all duration-200",
                  masterMuted
                    ? "bg-destructive/30 border-destructive/60"
                    : "bg-glass border-glass-border hover:border-glass-border-hover"
                )}
              >
                {masterMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-destructive" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </motion.button>

              {/* Volume slider */}
              <div className="flex-1 min-w-0">
                <GlassSlider
                  value={masterVolume}
                  onChange={setMasterVolume}
                  color="#818cf8"
                  size="sm"
                  disabled={masterMuted}
                />
              </div>

              {/* Time display */}
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Waveform */}
            <WaveformDisplay
              waveformData={masterWaveform}
              currentTime={currentTime}
              duration={duration}
              color="#818cf8"
              height={40}
              onSeek={seek}
              isPlaying={isPlaying}
              mirrored={true}
              showProgress={!masterMuted}
            />
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
                onSeek={seek}
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
          <div className="h-1 bg-muted/30 rounded-full mb-3 overflow-hidden">
            <motion.div
              className="h-full gradient-bg"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {/* Loop toggle */}
            <IconButton
              icon={Repeat}
              variant="accent"
              size="sm"
              active={isLooping}
              onClick={toggleLoop}
              label="Toggle loop"
            />

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
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center",
                "gradient-bg shadow-xl relative"
              )}
            >
              {/* Pulsing ring when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
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

              {isPlaying ? (
                <Pause className="w-6 h-6 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              )}
            </motion.button>

            {/* Skip forward */}
            <IconButton
              icon={SkipForward}
              variant="ghost"
              onClick={handleSkipForward}
              label="Skip forward 10 seconds"
            />

            {/* Placeholder for symmetry */}
            <div className="w-10 h-10" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
