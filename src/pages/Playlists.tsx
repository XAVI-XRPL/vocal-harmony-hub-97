import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ListMusic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { CreatePlaylistDialog } from "@/components/playlist/CreatePlaylistDialog";
import { RecordsWallBackground } from "@/components/layout/RecordsWallBackground";
import { usePlaylists } from "@/hooks/usePlaylists";
import { Playlist } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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

export default function Playlists() {
  const navigate = useNavigate();
  const { playlists, isLoading, createPlaylist, deletePlaylist } = usePlaylists();
  const [showCreate, setShowCreate] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEdit = (playlist: Playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (playlistToDelete) {
      await deletePlaylist(playlistToDelete.id);
      setPlaylistToDelete(null);
    }
  };

  if (authLoading) {
    return (
      <>
        <RecordsWallBackground />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <RecordsWallBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] px-4"
        >
          <GlassCard className="max-w-md w-full text-center p-8">
            <ListMusic className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Create an account to build custom playlists of your favorite vocal exercises.
            </p>
            <Button onClick={() => navigate("/auth")} className="gradient-bg">
              Sign In to Continue
            </Button>
          </GlassCard>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <RecordsWallBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 md:p-8 lg:p-12 xl:p-16 space-y-6 md:space-y-8 max-w-[1600px] mx-auto"
      >
      {/* Header */}
      <GlassCard className="p-4 md:p-6" depth="floating">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              My Playlists
            </h1>
            <p className="text-muted-foreground mt-1">Organize your favorite exercises</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gradient-bg gap-2 shadow-lg">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Playlist</span>
          </Button>
        </div>
      </GlassCard>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : playlists.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <GlassCard depth="floating" className="max-w-md w-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
              <ListMusic className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">No Playlists Yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-8">
              Create your first playlist to organize exercises for warm-ups, practice routines, or skill-building.
            </p>
            <Button onClick={() => setShowCreate(true)} className="gradient-bg gap-2 shadow-lg px-6 py-3">
              <Plus className="w-5 h-5" />
              Create Your First Playlist
            </Button>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PlaylistCard
                playlist={playlist}
                onEdit={handleEdit}
                onDelete={setPlaylistToDelete}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreatePlaylistDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreate={createPlaylist}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!playlistToDelete} onOpenChange={() => setPlaylistToDelete(null)}>
        <AlertDialogContent className="glass-card-3d border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{playlistToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </motion.div>
    </>
  );
}