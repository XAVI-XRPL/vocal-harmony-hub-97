import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Clock, ChevronRight, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useSongs } from "@/hooks/useSongs";
import { cn } from "@/lib/utils";

interface ContinuePracticeProps {
  className?: string;
}

export function ContinuePractice({ className }: ContinuePracticeProps) {
  const navigate = useNavigate();
  const { data: songs, isLoading } = useSongs();
  
  // Get first 2 songs as "recent" practice
  const recentSongs = songs?.slice(0, 2) ?? [];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <motion.div
        className={cn("space-y-3", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">Continue Practice</h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

  if (recentSongs.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={cn("space-y-3", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Continue Practice</h3>
        <motion.button
          onClick={() => navigate("/library")}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          whileHover={{ x: 2 }}
        >
          View all
          <ChevronRight className="w-3 h-3" />
        </motion.button>
      </div>

      <div className="space-y-2">
        {recentSongs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <GlassCard
              padding="sm"
              className="flex items-center gap-3"
              onClick={() => navigate(`/training/${song.id}`)}
            >
              {/* Cover art */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={song.coverArt}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  whileHover={{ opacity: 1 }}
                >
                  <Play className="w-5 h-5 text-white fill-white" />
                </motion.div>
              </div>

              {/* Song info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>

              {/* Duration and play */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDuration(song.duration)}
                </div>
                <motion.div
                  className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary) / 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
