import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Edit, Trash2, Plus, Music, Loader2, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlaylist, usePlaylists } from "@/hooks/usePlaylists";
import { useAudioStore } from "@/stores/audioStore";
import { mockSongs } from "@/data/mockSongs";
import { Song } from "@/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlist, isLoading, refetch } = usePlaylist(id);
  const { updatePlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist } = usePlaylists();
  const { setCurrentSong } = useAudioStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [songToRemove, setSongToRemove] = useState<string | null>(null);

  const handlePlayAll = () => {
    if (playlist?.songs && playlist.songs.length > 0 && playlist.songs[0].song) {
      setCurrentSong(playlist.songs[0].song);
      navigate(`/training/${playlist.songs[0].song_id}`);
    }
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    navigate(`/training/${song.id}`);
  };

  const handleEdit = () => {
    setEditName(playlist?.name || "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (playlist && editName.trim()) {
      await updatePlaylist(playlist.id, { name: editName.trim() });
      await refetch();
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (playlist) {
      await deletePlaylist(playlist.id);
      navigate("/playlists");
    }
  };

  const handleAddSong = async (songId: string) => {
    if (playlist) {
      await addSongToPlaylist(playlist.id, songId);
      await refetch();
    }
  };

  const handleRemoveSong = async () => {
    if (playlist && songToRemove) {
      await removeSongFromPlaylist(playlist.id, songToRemove);
      await refetch();
      setSongToRemove(null);
    }
  };

  const availableSongs = mockSongs.filter(
    song => !playlist?.songs?.some(ps => ps.song_id === song.id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Playlist not found</p>
        <Button variant="ghost" onClick={() => navigate("/playlists")} className="mt-4">
          Back to Playlists
        </Button>
      </div>
    );
  }

  const coverImages = playlist.songs?.slice(0, 4).map(ps => ps.song?.coverArt).filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-6"
    >
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate("/playlists")} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Playlists
      </Button>

      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cover */}
        <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden shrink-0">
          {coverImages.length >= 4 ? (
            <div className="grid grid-cols-2 w-full h-full">
              {coverImages.slice(0, 4).map((img, i) => (
                <img key={i} src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              ))}
            </div>
          ) : coverImages.length > 0 ? (
            <img src={coverImages[0]} alt={playlist.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Music className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Playlist</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-muted-foreground mb-4">{playlist.description}</p>
          )}
          <p className="text-sm text-muted-foreground mb-4">
            {playlist.songs?.length || 0} exercises
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handlePlayAll}
              disabled={!playlist.songs?.length}
              className="gradient-bg gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Play All
            </Button>
            <Button variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Exercises</h2>
          <Button variant="outline" size="sm" onClick={() => setShowAddSongs(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Exercises
          </Button>
        </div>

        {playlist.songs && playlist.songs.length > 0 ? (
          <div className="space-y-2">
            {playlist.songs.map((ps, index) => (
              <motion.div
                key={ps.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="flex items-center gap-3 p-3" padding="none">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    {ps.song?.coverArt ? (
                      <img src={ps.song.coverArt} alt={ps.song.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Music className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{ps.song?.title || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground truncate">{ps.song?.artist || 'Unknown'}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => ps.song && handlePlaySong(ps.song)}
                    className="shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSongToRemove(ps.song_id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <GlassCard className="flex flex-col items-center justify-center py-12 text-center">
            <Music className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No exercises in this playlist yet</p>
            <Button onClick={() => setShowAddSongs(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Exercise
            </Button>
          </GlassCard>
        )}
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="glass-card-3d border-white/10">
          <DialogHeader>
            <DialogTitle>Edit Playlist Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Playlist name"
              className="glass-card border-white/10"
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="flex-1 gradient-bg">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Songs Dialog */}
      <Dialog open={showAddSongs} onOpenChange={setShowAddSongs}>
        <DialogContent className="glass-card-3d border-white/10 max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Exercises</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {availableSongs.length > 0 ? (
              availableSongs.map((song) => (
                <motion.button
                  key={song.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAddSong(song.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <img src={song.coverArt} alt={song.title} className="w-12 h-12 rounded-lg object-cover" loading="lazy" decoding="async" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  <Plus className="w-5 h-5 text-primary" />
                </motion.button>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                All exercises have been added to this playlist
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="glass-card-3d border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Song Confirmation */}
      <AlertDialog open={!!songToRemove} onOpenChange={() => setSongToRemove(null)}>
        <AlertDialogContent className="glass-card-3d border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Exercise?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove this exercise from the playlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveSong}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}