import { create } from 'zustand';
import { Song, Stem } from '@/types';

// Priority order for preloading stems - most important first
const STEM_PRIORITY: Record<string, number> = {
  'coaching': 0,
  'master': 0,
  'instrumental': 1,
  'lead': 2,
  'vocal': 3,
  'harmony': 4,
  'keys': 5,
  'drums': 6,
  'bass': 7,
  'guitar': 8,
  'other': 9,
};

interface StemCache {
  stemId: string;
  blobUrl: string;
  originalUrl: string;
}

interface SongCache {
  songId: string;
  stems: StemCache[];
  loadedAt: number;
}

type LoadingState = 'idle' | 'loading' | 'ready' | 'error';

interface AudioPreloadState {
  // Cached songs with blob URLs
  cachedSongs: Map<string, SongCache>;
  // Loading states per song
  loadingStates: Map<string, LoadingState>;
  // Progress per song (0-100)
  loadingProgress: Map<string, number>;
  // Queue of songs waiting to preload
  preloadQueue: string[];
  // Currently loading song ID
  currentlyLoading: string | null;
  // Maximum cached songs (LRU eviction)
  maxCachedSongs: number;
  // Pending song data for queue processing (replaces window.__preloadSongData)
  pendingSongData: Map<string, Song>;
  
  // Actions
  getLoadingState: (songId: string) => LoadingState;
  getProgress: (songId: string) => number;
  getCachedStems: (songId: string) => StemCache[] | null;
  getBlobUrl: (songId: string, stemId: string) => string | null;
  isPreloaded: (songId: string) => boolean;
  startPreload: (song: Song) => void;
  queuePreload: (song: Song) => void;
  clearCache: (songId?: string) => void;
  processQueue: () => void;
}

// Get priority for a stem based on name/type
function getStemPriority(stem: Stem): number {
  const nameLower = stem.name.toLowerCase();
  
  // Check for coaching/master stems first (highest priority)
  if (nameLower.includes('coaching') || nameLower.includes('master')) return 0;
  if (nameLower.includes('instrumental')) return 1;
  if (nameLower.includes('lead')) return 2;
  if (stem.type === 'vocal') return 3;
  if (stem.type === 'harmony') return 4;
  
  return STEM_PRIORITY[stem.type] ?? 9;
}

// Sort stems by priority
function sortStemsByPriority(stems: Stem[]): Stem[] {
  return [...stems].sort((a, b) => getStemPriority(a) - getStemPriority(b));
}

export const useAudioPreloadStore = create<AudioPreloadState>((set, get) => ({
  cachedSongs: new Map(),
  loadingStates: new Map(),
  loadingProgress: new Map(),
  preloadQueue: [],
  currentlyLoading: null,
  maxCachedSongs: 4,
  pendingSongData: new Map(),

  getLoadingState: (songId) => {
    return get().loadingStates.get(songId) ?? 'idle';
  },

  getProgress: (songId) => {
    return get().loadingProgress.get(songId) ?? 0;
  },

  getCachedStems: (songId) => {
    const cache = get().cachedSongs.get(songId);
    return cache?.stems ?? null;
  },

  getBlobUrl: (songId, stemId) => {
    const cache = get().cachedSongs.get(songId);
    if (!cache) return null;
    const stem = cache.stems.find(s => s.stemId === stemId);
    return stem?.blobUrl ?? null;
  },

  isPreloaded: (songId) => {
    return get().loadingStates.get(songId) === 'ready';
  },

  queuePreload: (song) => {
    const state = get();
    const songId = song.id;
    
    // Skip if already cached, loading, or in queue
    if (state.cachedSongs.has(songId)) return;
    if (state.loadingStates.get(songId) === 'loading') return;
    if (state.preloadQueue.includes(songId)) return;
    
    // Store song data in Zustand state for later processing
    set(state => {
      const newPending = new Map(state.pendingSongData);
      newPending.set(songId, song);
      return {
        preloadQueue: [...state.preloadQueue, songId],
        pendingSongData: newPending,
      };
    });
    
    // Start processing if not currently loading
    if (!state.currentlyLoading) {
      get().processQueue();
    }
  },

  processQueue: () => {
    const state = get();
    
    if (state.currentlyLoading) return;
    if (state.preloadQueue.length === 0) return;
    
    const nextSongId = state.preloadQueue[0];
    const song = state.pendingSongData.get(nextSongId);
    
    if (!song) {
      // Remove from queue and try next
      set(state => ({
        preloadQueue: state.preloadQueue.slice(1),
      }));
      get().processQueue();
      return;
    }
    
    // Start preloading
    get().startPreload(song);
  },

  startPreload: async (song) => {
    const songId = song.id;
    const state = get();
    
    // Skip if already cached or loading
    if (state.cachedSongs.has(songId)) return;
    if (state.loadingStates.get(songId) === 'loading') return;
    
    // Filter stems with URLs
    const stemsWithUrls = song.stems.filter((s: Stem) => s.url && s.url.length > 0);
    if (stemsWithUrls.length === 0) {
      set(state => {
        const newStates = new Map(state.loadingStates);
        newStates.set(songId, 'ready');
        return { loadingStates: newStates };
      });
      return;
    }
    
    // LRU eviction if at capacity
    const { cachedSongs, maxCachedSongs } = get();
    if (cachedSongs.size >= maxCachedSongs) {
      // Find oldest cached song
      let oldestId: string | null = null;
      let oldestTime = Infinity;
      
      cachedSongs.forEach((cache, id) => {
        if (cache.loadedAt < oldestTime) {
          oldestTime = cache.loadedAt;
          oldestId = id;
        }
      });
      
      if (oldestId) {
        get().clearCache(oldestId);
      }
    }
    
    // Set loading state
    set(state => {
      const newStates = new Map(state.loadingStates);
      const newProgress = new Map(state.loadingProgress);
      newStates.set(songId, 'loading');
      newProgress.set(songId, 0);
      
      // Remove from queue
      const newQueue = state.preloadQueue.filter(id => id !== songId);
      
      return {
        loadingStates: newStates,
        loadingProgress: newProgress,
        preloadQueue: newQueue,
        currentlyLoading: songId,
      };
    });
    
    // Sort stems by priority
    const sortedStems = sortStemsByPriority(stemsWithUrls);
    const totalStems = sortedStems.length;
    const loadedStems: StemCache[] = [];
    let loadedCount = 0;
    
    // Reduce concurrent requests for high stem count songs to prevent bandwidth competition
    const isHighStemCount = sortedStems.length >= 10;
    const CONCURRENT_REQUESTS = isHighStemCount ? 2 : 3;
    
    if (isHighStemCount) {
      if (import.meta.env.DEV) console.log(`High stem count song (${sortedStems.length}) - using ${CONCURRENT_REQUESTS} concurrent requests`);
    }
    
    for (let i = 0; i < sortedStems.length; i += CONCURRENT_REQUESTS) {
      const batch = sortedStems.slice(i, i + CONCURRENT_REQUESTS);
      
      const results = await Promise.allSettled(
        batch.map(async (stem: Stem) => {
          try {
            const response = await fetch(stem.url);
            if (!response.ok) throw new Error(`Failed to fetch ${stem.url}`);
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            return {
              stemId: stem.id,
              blobUrl,
              originalUrl: stem.url,
            };
          } catch (error) {
            console.warn(`Failed to preload stem ${stem.id}:`, error);
            return null;
          }
        })
      );
      
      // Collect successful results
      results.forEach(result => {
        loadedCount++;
        if (result.status === 'fulfilled' && result.value) {
          loadedStems.push(result.value);
        }
        
        // Update progress
        set(state => {
          const newProgress = new Map(state.loadingProgress);
          newProgress.set(songId, (loadedCount / totalStems) * 100);
          return { loadingProgress: newProgress };
        });
      });
    }
    
    // Cache the loaded stems
    if (loadedStems.length > 0) {
      set(state => {
        const newCached = new Map(state.cachedSongs);
        const newStates = new Map(state.loadingStates);
        
        newCached.set(songId, {
          songId,
          stems: loadedStems,
          loadedAt: Date.now(),
        });
        newStates.set(songId, 'ready');
        
        return {
          cachedSongs: newCached,
          loadingStates: newStates,
          currentlyLoading: null,
        };
      });
      
      if (import.meta.env.DEV) console.log(`✓ Preloaded ${loadedStems.length}/${totalStems} stems for "${song.title}"`);
    } else {
      set(state => {
        const newStates = new Map(state.loadingStates);
        newStates.set(songId, 'error');
        return {
          loadingStates: newStates,
          currentlyLoading: null,
        };
      });
    }
    
    // Clean up pending song data from store
    set(state => {
      const newPending = new Map(state.pendingSongData);
      newPending.delete(songId);
      return { pendingSongData: newPending };
    });
    
    // Process next in queue
    setTimeout(() => get().processQueue(), 100);
  },

  clearCache: (songId?: string) => {
    const state = get();
    
    if (songId) {
      // Clear specific song
      const cache = state.cachedSongs.get(songId);
      if (cache) {
        // Revoke all blob URLs to free memory
        cache.stems.forEach(stem => {
          URL.revokeObjectURL(stem.blobUrl);
        });
        
        set(state => {
          const newCached = new Map(state.cachedSongs);
          const newStates = new Map(state.loadingStates);
          const newProgress = new Map(state.loadingProgress);
          
          newCached.delete(songId);
          newStates.delete(songId);
          newProgress.delete(songId);
          
          return {
            cachedSongs: newCached,
            loadingStates: newStates,
            loadingProgress: newProgress,
          };
        });
      }
    } else {
      // Clear all cache
      state.cachedSongs.forEach(cache => {
        cache.stems.forEach(stem => {
          URL.revokeObjectURL(stem.blobUrl);
        });
      });
      
      set({
        cachedSongs: new Map(),
        loadingStates: new Map(),
        loadingProgress: new Map(),
        preloadQueue: [],
        currentlyLoading: null,
      });
    }
  },
}));
