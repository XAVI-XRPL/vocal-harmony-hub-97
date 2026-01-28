import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Pause, SkipForward, X } from "lucide-react";
import { useAudioStore } from "@/stores/audioStore";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

export function MiniPlayer() {
  const navigate = useNavigate();
  const { currentSong, isPlaying, currentTime, duration, togglePlayPause, setCurrentSong } = useAudioStore();

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleOpenTraining = () => {
    navigate(`/training/${currentSong.id}`);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className={cn(
        "fixed bottom-16 left-0 right-0 z-40",
        "mx-2 rounded-2xl",
        "glass-card-solid border border-glass-border",
        "overflow-hidden"
      )}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted/30">
        <motion.div
          className="h-full gradient-bg"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3 p-3">
        {/* Album art */}
        <motion.button
          onClick={handleOpenTraining}
          whileTap={{ scale: 0.95 }}
          className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0"
        >
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-2xs text-white font-medium">Open</span>
          </div>
        </motion.button>

        {/* Song info */}
        <button
          onClick={handleOpenTraining}
          className="flex-1 min-w-0 text-left"
        >
          <p className="text-sm font-medium text-foreground truncate">
            {currentSong.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentSong.artist}
          </p>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <IconButton
            icon={isPlaying ? Pause : Play}
            size="md"
            variant="accent"
            active={isPlaying}
            onClick={togglePlayPause}
            label={isPlaying ? "Pause" : "Play"}
          />
          <IconButton
            icon={SkipForward}
            size="sm"
            variant="ghost"
            label="Next"
          />
          <IconButton
            icon={X}
            size="sm"
            variant="ghost"
            onClick={() => setCurrentSong(null)}
            label="Close player"
          />
        </div>
      </div>
    </motion.div>
  );
}
