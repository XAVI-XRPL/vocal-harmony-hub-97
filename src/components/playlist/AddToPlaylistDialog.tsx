import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ListMusic, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Playlist, Song } from "@/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreatePlaylistDialog } from "./CreatePlaylistDialog";

interface AddToPlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  song: Song | null;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  onCreatePlaylist: (name: string, description?: string) => Promise<unknown>;
}

export function AddToPlaylistDialog({
  open,
  onOpenChange,
  song,
  playlists,
  onAddToPlaylist,
  onCreatePlaylist,
}: AddToPlaylistDialogProps) {
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleAdd = async (playlistId: string) => {
    if (!song) return;
    setIsAdding(playlistId);
    try {
      await onAddToPlaylist(playlistId, song.id);
      onOpenChange(false);
    } finally {
      setIsAdding(null);
    }
  };

  const isSongInPlaylist = (playlist: Playlist) => {
    return playlist.songs?.some(ps => ps.song_id === song?.id);
  };

  const handleCreateAndAdd = async (name: string, description?: string) => {
    const newPlaylist = await onCreatePlaylist(name, description);
    if (newPlaylist && song) {
      await onAddToPlaylist((newPlaylist as Playlist).id, song.id);
    }
    setShowCreate(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card-3d border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-primary" />
              Add to Playlist
            </DialogTitle>
          </DialogHeader>

          {song && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4">
              <img
                src={song.coverArt}
                alt={song.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{song.title}</p>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {/* Create new playlist option */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowCreate(true)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl",
                "bg-primary/10 hover:bg-primary/20 transition-colors",
                "border border-dashed border-primary/30"
              )}
            >
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-primary">Create New Playlist</span>
            </motion.button>

            {/* Existing playlists */}
            {playlists.map((playlist) => {
              const isInPlaylist = isSongInPlaylist(playlist);
              const isLoading = isAdding === playlist.id;

              return (
                <motion.button
                  key={playlist.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => !isInPlaylist && handleAdd(playlist.id)}
                  disabled={isInPlaylist || isLoading}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                    isInPlaylist 
                      ? "bg-green-500/10 cursor-default" 
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  {/* Cover thumbnail */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                    {playlist.songs && playlist.songs.length > 0 && playlist.songs[0].song?.coverArt ? (
                      <img
                        src={playlist.songs[0].song.coverArt}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ListMusic className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium truncate">{playlist.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {playlist.songs?.length || 0} exercises
                    </p>
                  </div>

                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : isInPlaylist ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.button>
              );
            })}

            {playlists.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No playlists yet. Create one to get started!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreatePlaylistDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreate={handleCreateAndAdd}
      />
    </>
  );
}
