import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, Clock, Music2, Zap, Share2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { IconButton } from "@/components/ui/icon-button";
import { WaveformDisplay } from "@/components/audio/WaveformDisplay";
import { getSongById, generateMockWaveform } from "@/data/mockSongs";
import { useAudioStore } from "@/stores/audioStore";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";

const difficultyColors = {
  beginner: "text-green-400 bg-green-400/20 border-green-400/30",
  intermediate: "text-yellow-400 bg-yellow-400/20 border-yellow-400/30",
  advanced: "text-red-400 bg-red-400/20 border-red-400/30",
};

export default function SongDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const song = getSongById(id || "");
  const { currentSong, isPlaying, currentTime, setCurrentSong, togglePlayPause, seek } = useAudioStore();
  const canAccessPremium = useUserStore((state) => state.canAccessPremiumContent());

  const isCurrentSong = currentSong?.id === song?.id;
  const isLocked = song?.isPremium && !canAccessPremium;

  // Generate mock waveform for the full song
  const waveformData = generateMockWaveform(300);

  useEffect(() => {
    if (!song) {
      navigate("/library");
    }
  }, [song, navigate]);

  if (!song) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (isLocked) {
      navigate("/subscription");
      return;
    }

    if (!isCurrentSong) {
      setCurrentSong(song);
    } else {
      togglePlayPause();
    }
  };

  const handleEnterTraining = () => {
    if (isLocked) {
      navigate("/subscription");
      return;
    }
    setCurrentSong(song);
    navigate(`/training/${song.id}`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0">
        <div className="flex items-center gap-3 h-14 px-4 safe-top">
          <IconButton
            icon={ArrowLeft}
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            label="Go back"
          />
          <h1 className="text-lg font-semibold truncate flex-1">{song.title}</h1>
          <IconButton
            icon={Share2}
            variant="ghost"
            size="sm"
            label="Share"
          />
        </div>
      </div>

      <div className="px-4 pb-8">
        {/* Album Art */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mt-6 mb-8"
        >
          <div className="relative max-w-xs mx-auto">
            {/* Gradient border animation */}
            <div className="absolute -inset-1 rounded-3xl gradient-bg opacity-50 blur-lg animate-pulse-glow" />
            
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-glass-border">
              <img
                src={song.coverArt}
                alt={song.title}
                className="w-full h-full object-cover"
              />

              {/* Locked overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium">Premium Song</p>
                    <p className="text-white/60 text-sm">Upgrade to access</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Song Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-bold mb-1">{song.title}</h2>
          <p className="text-muted-foreground">{song.artist}</p>
        </motion.div>

        {/* Meta badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-glass border border-glass-border text-xs">
            <Clock className="w-3 h-3" />
            {formatDuration(song.duration)}
          </span>
          <span
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium capitalize border",
              difficultyColors[song.difficulty]
            )}
          >
            {song.difficulty}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-glass border border-glass-border text-xs">
            {song.genre}
          </span>
          {song.bpm && (
            <span className="px-3 py-1.5 rounded-full bg-glass border border-glass-border text-xs">
              {song.bpm} BPM
            </span>
          )}
          {song.key && (
            <span className="px-3 py-1.5 rounded-full bg-glass border border-glass-border text-xs">
              {song.key}
            </span>
          )}
        </motion.div>

        {/* Waveform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard padding="md" hover={false}>
            <WaveformDisplay
              waveformData={waveformData}
              currentTime={isCurrentSong ? currentTime : 0}
              duration={song.duration}
              color="hsl(var(--primary))"
              height={80}
              onSeek={(time) => {
                if (isCurrentSong) seek(time);
              }}
              isPlaying={isCurrentSong && isPlaying}
            />

            {/* Time display */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{formatDuration(isCurrentSong ? currentTime : 0)}</span>
              <span>{formatDuration(song.duration)}</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Play button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              "shadow-2xl relative",
              isLocked ? "bg-muted" : "gradient-bg"
            )}
          >
            {/* Pulsing ring when playing */}
            {isCurrentSong && isPlaying && (
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

            {isCurrentSong && isPlaying ? (
              <Pause className="w-8 h-8 text-white fill-white" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            )}
          </motion.button>

          {/* Enter Training Mode */}
          <GlassButton
            variant="secondary"
            size="lg"
            icon={<Music2 className="w-5 h-5" />}
            onClick={handleEnterTraining}
            fullWidth
          >
            {isLocked ? "Unlock to Train" : `Enter Training Mode (${song.stems.length} stems)`}
          </GlassButton>
        </motion.div>

        {/* Stems Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold mb-4">Available Stems</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {song.stems.map((stem) => (
              <GlassCard
                key={stem.id}
                padding="sm"
                hover={false}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stem.color }}
                />
                <span className="text-sm text-foreground">{stem.name}</span>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
