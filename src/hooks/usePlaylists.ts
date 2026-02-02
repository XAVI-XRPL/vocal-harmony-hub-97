import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Playlist, PlaylistSong, Song } from '@/types';
import { mockSongs } from '@/data/mockSongs';
import { useToast } from '@/hooks/use-toast';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlaylists = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setPlaylists([]);
        return;
      }

      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch songs for each playlist
      const playlistsWithSongs = await Promise.all(
        (data || []).map(async (playlist) => {
          const { data: songs } = await supabase
            .from('playlist_songs')
            .select('*')
            .eq('playlist_id', playlist.id)
            .order('position');

          const playlistSongs: PlaylistSong[] = (songs || []).map((ps) => ({
            ...ps,
            song: mockSongs.find((s) => s.id === ps.song_id),
          }));

          return { ...playlist, songs: playlistSongs };
        })
      );

      setPlaylists(playlistsWithSongs);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast({
        title: 'Error',
        description: 'Failed to load playlists',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createPlaylist = async (name: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to create playlists',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Playlist created',
        description: `"${name}" has been created`,
      });

      await fetchPlaylists();
      return data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to create playlist',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updatePlaylist = async (id: string, updates: { name?: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Playlist updated',
        description: 'Your changes have been saved',
      });

      await fetchPlaylists();
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update playlist',
        variant: 'destructive',
      });
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Playlist deleted',
        description: 'The playlist has been removed',
      });

      await fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete playlist',
        variant: 'destructive',
      });
    }
  };

  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    try {
      // Get current max position
      const { data: existingSongs } = await supabase
        .from('playlist_songs')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = existingSongs && existingSongs.length > 0 
        ? existingSongs[0].position + 1 
        : 0;

      const { error } = await supabase
        .from('playlist_songs')
        .insert({
          playlist_id: playlistId,
          song_id: songId,
          position: nextPosition,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already added',
            description: 'This exercise is already in the playlist',
          });
          return;
        }
        throw error;
      }

      const song = mockSongs.find(s => s.id === songId);
      toast({
        title: 'Added to playlist',
        description: `"${song?.title || 'Exercise'}" has been added`,
      });

      await fetchPlaylists();
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to add to playlist',
        variant: 'destructive',
      });
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('song_id', songId);

      if (error) throw error;

      toast({
        title: 'Removed from playlist',
        description: 'The exercise has been removed',
      });

      await fetchPlaylists();
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove from playlist',
        variant: 'destructive',
      });
    }
  };

  const reorderPlaylistSongs = async (playlistId: string, songIds: string[]) => {
    try {
      // Update positions for all songs
      const updates = songIds.map((songId, index) => 
        supabase
          .from('playlist_songs')
          .update({ position: index })
          .eq('playlist_id', playlistId)
          .eq('song_id', songId)
      );

      await Promise.all(updates);
      await fetchPlaylists();
    } catch (error) {
      console.error('Error reordering playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder playlist',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return {
    playlists,
    isLoading,
    fetchPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    reorderPlaylistSongs,
  };
}

export function usePlaylist(id: string | undefined) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlaylist = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch songs for this playlist
      const { data: songs } = await supabase
        .from('playlist_songs')
        .select('*')
        .eq('playlist_id', id)
        .order('position');

      const playlistSongs: PlaylistSong[] = (songs || []).map((ps) => ({
        ...ps,
        song: mockSongs.find((s) => s.id === ps.song_id),
      }));

      setPlaylist({ ...data, songs: playlistSongs });
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load playlist',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  return { playlist, isLoading, refetch: fetchPlaylist };
}