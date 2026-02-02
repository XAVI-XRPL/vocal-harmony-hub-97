import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Music, MoreVertical, Trash2, Edit } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Playlist } from "@/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit?: (playlist: Playlist) => void;
  onDelete?: (playlist: Playlist) => void;
  className?: string;
}

export function PlaylistCard({ playlist, onEdit, onDelete, className }: PlaylistCardProps) {
  const navigate = useNavigate();
  const songCount = playlist.songs?.length || 0;
  const coverImages = playlist.songs?.slice(0, 4).map(ps => ps.song?.coverArt).filter(Boolean) || [];

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.songs && playlist.songs.length > 0) {
      navigate(`/training/${playlist.songs[0].song_id}`);
    }
  };

  return (
    <GlassCard
      onClick={handleClick}
      className={cn("overflow-hidden group cursor-pointer", className)}
      padding="none"
      glow
    >
      {/* Cover art grid */}
      <div className="relative aspect-square overflow-hidden">
        {coverImages.length >= 4 ? (
          <div className="grid grid-cols-2 w-full h-full">
            {coverImages.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-full h-full object-cover"
              />
            ))}
          </div>
        ) : coverImages.length > 0 ? (
          <img
            src={coverImages[0]}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Music className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            disabled={songCount === 0}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              "shadow-2xl backdrop-blur-sm gradient-bg",
              songCount === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </motion.button>
        </motion.div>

        {/* More menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
              >
                <MoreVertical className="w-4 h-4 text-white" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/10">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(playlist); }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete?.(playlist); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-medium text-foreground truncate">{playlist.name}</p>
        <p className="text-sm text-muted-foreground">
          {songCount} {songCount === 1 ? 'exercise' : 'exercises'}
        </p>
      </div>
    </GlassCard>
  );
}