

# Stem Pre-Buffer System for Faster Playback Start

## Overview
Implement a stem preloading system that pre-buffers audio files before users navigate to the Training Mode, resulting in near-instant playback start. This system will work for all current songs and automatically apply to any future songs added to the database.

## Current State
- Audio stems are loaded on-demand when users enter Training Mode (`useAudioPlayer.ts`)
- Each song has 6-12 stems (6-12 individual MP3 files to load)
- Loading happens sequentially with a progress indicator showing 0-100%
- Users must wait for all stems to load before playback is responsive

## Proposed Architecture

```text
+--------------------+      +-------------------+      +------------------+
|   Library / Home   | ---> |  Preload Manager  | ---> |   Audio Cache    |
|   (hover / tap)    |      |   (Background)    |      |  (Blob URLs)     |
+--------------------+      +-------------------+      +------------------+
         |                          |                          |
         v                          v                          v
   User navigates         Fetches stems in          TrainingMode reads
   to Training Mode       priority order            from cache instantly
```

## Implementation Strategy

### 1. Create Audio Preload Store (`src/stores/audioPreloadStore.ts`)
A Zustand store to manage preloaded audio state:

| Field | Type | Purpose |
|-------|------|---------|
| `preloadedSongs` | `Map<songId, StemCache[]>` | Stores blob URLs per stem |
| `loadingStates` | `Map<songId, 'idle' | 'loading' | 'ready'>` | Track preload status |
| `preloadSong(song)` | function | Initiates background preload |
| `getPreloadedStems(songId)` | function | Returns cached blob URLs |
| `clearCache(songId?)` | function | Clears memory when needed |
| `maxCachedSongs` | number | Limit cache to 3 songs (memory management) |

### 2. Create Preload Hook (`src/hooks/useAudioPreload.ts`)
A hook that handles the actual preloading logic:

- Fetches audio files as blobs in the background using `fetch()`
- Creates blob URLs for instant access
- Prioritizes stems by type: Master/Coaching first, then Instrumental, then others
- Implements a queue system to avoid overwhelming the network
- Reports progress for UI indicators (optional)

### 3. Integrate Preloading Triggers

**Trigger Points:**
| Location | Event | Action |
|----------|-------|--------|
| `SongCard.tsx` | `onMouseEnter` / `onTouchStart` | Start preloading that song |
| `ContinuePractice.tsx` | Component mount | Preload first 2 songs on home page load |
| `Library.tsx` | First visible songs | Preload top 2-3 visible songs |
| `useSongs.ts` | After songs fetch | Optionally preload first song |

### 4. Modify `useAudioPlayer.ts` to Use Cache
Update the `loadSong` function to:
1. Check if stems are already preloaded in cache
2. If cached, use blob URLs directly (instant load)
3. If not cached, fall back to current streaming behavior
4. Blend seamlessly so users never notice the difference

### 5. Memory Management
- Limit cache to 3 songs maximum (most recent/likely to play)
- Use LRU (Least Recently Used) eviction when limit exceeded
- Revoke blob URLs when clearing cache to free memory
- Clear cache on song change if memory constrained

## Technical Details

### Stem Cache Structure
```typescript
interface StemCache {
  stemId: string;
  blobUrl: string;
  duration: number;
}

interface PreloadState {
  preloadedSongs: Map<string, StemCache[]>;
  loadingStates: Map<string, 'idle' | 'loading' | 'ready' | 'error'>;
  preloadQueue: string[]; // songIds waiting to preload
}
```

### Priority Loading Order
1. **Coaching/Master vocals** - Most important for practice
2. **Instrumental** - Core backing track
3. **Lead vocals** - Key for learning
4. **Everything else** - Harmonies, individual instruments

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/stores/audioPreloadStore.ts` | Create | Central cache store |
| `src/hooks/useAudioPreload.ts` | Create | Preload logic hook |
| `src/hooks/useAudioPlayer.ts` | Modify | Read from cache first |
| `src/components/song/SongCard.tsx` | Modify | Trigger preload on hover |
| `src/components/home/ContinuePractice.tsx` | Modify | Preload visible songs |
| `src/pages/Library.tsx` | Modify | Preload first few visible songs |

## Expected Performance Improvement

| Metric | Before | After |
|--------|--------|-------|
| Time to first playback | 3-8 seconds | Near-instant (< 500ms) |
| Loading indicator visibility | Always shown | Rarely shown |
| Network efficiency | On-demand | Predictive |
| Memory usage | Low | Moderate (controlled) |

## Compatibility
- Works with all existing songs (fetches from same URLs)
- Works with future songs automatically (no code changes needed)
- Gracefully degrades if preload fails (falls back to streaming)
- Compatible with current Howler.js implementation (blob URLs work with Howler)

