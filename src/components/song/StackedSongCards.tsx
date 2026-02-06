import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Lock, Clock, Music2 } from "lucide-react";
import { Song } from "@/types";
import { useAudioStore } from "@/stores/audioStore";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";

interface StackedSongCardsProps {
  songs: Song[];
}

const difficultyColors = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

function StackedCard({ song, index, totalCards }: { song: Song; index: number; totalCards: number }) {
  const navigate = useNavigate();
  const { setCurrentSong } = useAudioStore();
  const canAccessPremium = useUserStore((state) => state.canAccessPremiumContent());
  const containerRef = useRef<HTMLDivElement>(null);

  const isLocked = song.isPremium && !canAccessPremium;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const targetScale = 1 - (totalCards - index) * 0.05;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.85, 0.6]);

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
    setCurrentSong(song);
    navigate(`/training/${song.id}`);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      navigate("/subscription");
      return;
    }
    setCurrentSong(song);
  };

  return (
    <div
      ref={containerRef}
      className="h-[55vh] md:h-[50vh] flex items-start justify-center"
      style={{
        position: "sticky",
        top: 0,
      }}
    >
      <motion.div
        onClick={handleClick}
        className={cn(
          "relative w-full max-w-lg mx-auto cursor-pointer",
          "rounded-3xl overflow-hidden isolate",
          "will-change-transform"
        )}
        style={{
          scale,
          opacity,
          top: `calc(120px + ${index * 16}px)`,
          transformOrigin: "center top",
        }}
      >
        {/* Full-bleed cover art */}
        <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full">
          <img
            src={song.coverArt}
            alt={song.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
          />

          {/* Glass overlay gradient from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top glass shine line */}
          <div
            className="absolute top-2 left-4 right-4 h-[2px] rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
            }}
          />

          {/* Glass reflection overlay */}
          <div
            className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none rounded-t-3xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
            }}
          />

          {/* Glass border */}
          <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />

          {/* Shadow */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          />

          {/* Locked overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm text-white font-bold tracking-wide">Unlock with Premium</span>
              </div>
            </div>
          )}

          {/* Premium badge */}
          {song.isPremium && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold text-white shadow-lg z-10">
              PRO
            </div>
          )}

          {/* Play button */}
          {!isLocked && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="absolute bottom-20 right-5 w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-2xl z-10"
            >
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </motion.button>
          )}

          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{song.title}</h3>
            <p className="text-sm text-white/70 mb-3">{song.artist}</p>

            {/* Meta row */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-white/60">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(song.duration)}
              </span>
              <span
                className={cn(
                  "text-xs font-medium capitalize",
                  difficultyColors[song.difficulty]
                )}
              >
                {song.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/60 ml-auto">
                <Music2 className="w-3.5 h-3.5" />
                {song.stems.length} stems
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function StackedSongCards({ songs }: StackedSongCardsProps) {
  return (
    <div className="relative">
      {songs.map((song, index) => (
        <StackedCard
          key={song.id}
          song={song}
          index={index}
          totalCards={songs.length}
        />
      ))}
      {/* Bottom spacer so last card has room */}
      <div className="h-[10vh]" />
    </div>
  );
}
