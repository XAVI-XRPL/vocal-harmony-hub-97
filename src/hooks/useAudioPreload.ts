import { useCallback, useEffect, useRef } from 'react';
import { Song } from '@/types';
import { useAudioPreloadStore } from '@/stores/audioPreloadStore';

/**
 * Hook to trigger audio preloading for songs.
 * Provides methods to preload on hover/touch and on mount.
 */
export function useAudioPreload() {
  const queuePreload = useAudioPreloadStore((state) => state.queuePreload);
  const isPreloaded = useAudioPreloadStore((state) => state.isPreloaded);
  const getLoadingState = useAudioPreloadStore((state) => state.getLoadingState);
  const getProgress = useAudioPreloadStore((state) => state.getProgress);
  const getBlobUrl = useAudioPreloadStore((state) => state.getBlobUrl);
  const getCachedStems = useAudioPreloadStore((state) => state.getCachedStems);
  
  // Debounce ref to prevent too many rapid calls
  const debounceRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  /**
   * Trigger preload for a song with debounce (for hover events)
   */
  const preloadOnHover = useCallback((song: Song, delay = 300) => {
    const songId = song.id;
    
    // Clear any existing timeout for this song
    const existingTimeout = debounceRef.current.get(songId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      queuePreload(song);
      debounceRef.current.delete(songId);
    }, delay);
    
    debounceRef.current.set(songId, timeout);
  }, [queuePreload]);
  
  /**
   * Cancel a pending preload (e.g., on mouse leave)
   */
  const cancelPreload = useCallback((songId: string) => {
    const timeout = debounceRef.current.get(songId);
    if (timeout) {
      clearTimeout(timeout);
      debounceRef.current.delete(songId);
    }
  }, []);
  
  /**
   * Immediately queue a song for preloading (no debounce)
   */
  const preloadNow = useCallback((song: Song) => {
    queuePreload(song);
  }, [queuePreload]);
  
  /**
   * Preload multiple songs (used on page load)
   */
  const preloadSongs = useCallback((songs: Song[], limit = 2) => {
    const songsToPreload = songs.slice(0, limit);
    songsToPreload.forEach(song => {
      queuePreload(song);
    });
  }, [queuePreload]);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      debounceRef.current.forEach(timeout => clearTimeout(timeout));
      debounceRef.current.clear();
    };
  }, []);
  
  return {
    preloadOnHover,
    cancelPreload,
    preloadNow,
    preloadSongs,
    isPreloaded,
    getLoadingState,
    getProgress,
    getBlobUrl,
    getCachedStems,
  };
}

/**
 * Hook to auto-preload songs when component mounts.
 * Useful for Library and Home pages.
 */
export function useAutoPreload(songs: Song[] | undefined, limit = 2) {
  const { preloadSongs } = useAudioPreload();
  
  useEffect(() => {
    if (songs && songs.length > 0) {
      // Small delay to let the page render first
      const timeout = setTimeout(() => {
        preloadSongs(songs, limit);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [songs, limit, preloadSongs]);
}
