import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Lock, Clock, Music2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Song } from "@/types";
import { useAudioStore } from "@/stores/audioStore";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

const difficultyColors = {
  beginner: "text-green-400 bg-green-400/20",
  intermediate: "text-yellow-400 bg-yellow-400/20",
  advanced: "text-red-400 bg-red-400/20",
};

export function SongCard({ song, variant = "default", className }: SongCardProps) {
  const navigate = useNavigate();
  const { setCurrentSong } = useAudioStore();
  const canAccessPremium = useUserStore((state) => state.canAccessPremiumContent());

  const isLocked = song.isPremium && !canAccessPremium;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (isLocked) {
      navigate("/subscription");
      return;
    }
    navigate(`/song/${song.id}`);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      navigate("/subscription");
      return;
    }
    setCurrentSong(song);
  };

  if (variant === "compact") {
    return (
      <GlassCard
        onClick={handleClick}
        className={cn("flex items-center gap-3 p-3", className)}
        padding="none"
      >
        {/* Cover art */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
          <img
            src={song.coverArt}
            alt={song.title}
            className="w-full h-full object-cover"
          />
          {isLocked && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>

        {/* Play button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlay}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            isLocked ? "bg-muted" : "gradient-bg"
          )}
        >
          {isLocked ? (
            <Lock className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          )}
        </motion.button>
      </GlassCard>
    );
  }

  if (variant === "featured") {
    return (
      <GlassCard
        onClick={handleClick}
        className={cn("relative overflow-hidden min-w-[280px]", className)}
        padding="none"
        glow
        glowColor="primary"
      >
        {/* Cover art */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={song.coverArt}
            alt={song.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Locked overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Lock className="w-8 h-8 text-white" />
                <span className="text-xs text-white/80">Premium</span>
              </div>
            </div>
          )}

          {/* Play button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className={cn(
              "absolute bottom-4 right-4 w-12 h-12 rounded-full",
              "flex items-center justify-center",
              "shadow-lg",
              isLocked ? "bg-muted" : "gradient-bg"
            )}
          >
            {isLocked ? (
              <Lock className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            )}
          </motion.button>

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-lg font-semibold text-white truncate">{song.title}</p>
            <p className="text-sm text-white/70 truncate">{song.artist}</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  // Default variant
  return (
    <GlassCard
      onClick={handleClick}
      className={cn("overflow-hidden group", className)}
      padding="none"
      glow
    >
      {/* Cover art */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={song.coverArt}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Lock className="w-8 h-8 text-white" />
              <span className="text-xs text-white/80 font-medium">Premium</span>
            </div>
          </div>
        )}

        {/* Play button overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              "shadow-2xl backdrop-blur-sm",
              isLocked ? "bg-muted" : "gradient-bg"
            )}
          >
            {isLocked ? (
              <Lock className="w-6 h-6 text-muted-foreground" />
            ) : (
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            )}
          </motion.button>
        </motion.div>

        {/* Premium badge */}
        {song.isPremium && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-2xs font-medium text-white shadow-lg">
            PRO
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-medium text-foreground truncate">{song.title}</p>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>

        {/* Meta */}
        <div className="flex items-center gap-2 mt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatDuration(song.duration)}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-2xs font-medium capitalize",
              difficultyColors[song.difficulty]
            )}
          >
            {song.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Music2 className="w-3 h-3" />
            {song.stems.length}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
