
# Fix: AudioContext Mobile Crash

## Problem Summary

The app crashes when opening exercises on mobile because `AudioContext` is being created in a `useEffect` hook (when song data loads), not in a user tap/click handler. Mobile browsers block this.

---

## Root Cause

```text
User navigates to /training/testify-exercise
         ↓
useEffect fires when currentSong changes (useAudioEngine.ts:91)
         ↓
webAudioEngine.loadSong() called from useEffect ❌
         ↓
loadSong() calls ensureContextCreated() (line 218)
         ↓
new AudioContext() created (line 155)
         ↓
Mobile browser BLOCKS this → crash
```

---

## Solution Overview

Split the loading flow into two phases:

| Phase | When | What |
|-------|------|------|
| **Prepare** | On mount/song change | Store song config only (metadata, URLs) |
| **Initialize** | On Play tap | Create AudioContext + load buffers |

---

## Files to Change

| File | Changes |
|------|---------|
| `src/services/webAudioEngine.ts` | Add `prepareSong()` method that stores config without creating AudioContext |
| `src/hooks/useAudioEngine.ts` | Call `prepareSong()` in useEffect instead of `loadSong()` |
| `src/pages/TrainingMode.tsx` | Call `loadSong()` (with init) inside Play button handler |

---

## Detailed Changes

### 1. `src/services/webAudioEngine.ts`

Add a new `prepareSong()` method that stores the song configuration without touching AudioContext:

```typescript
/**
 * Prepare song configuration without creating AudioContext.
 * Safe to call from useEffect - no user gesture required.
 */
prepareSong(config: SongConfig): void {
  // Abort any pending loads
  this.abort();
  this.cleanup();
  
  this.currentSongId = config.songId;
  this.currentSongConfig = config;
  
  // Initialize stem progress tracking (UI only)
  const stemProgress: StemLoadProgress[] = config.stems.map(s => ({
    stemId: s.id,
    stemName: s.name,
    progress: 0,
    loaded: false,
  }));
  
  this.updateState({
    playbackState: 'idle',
    audioMode: 'mixdown',
    currentTime: 0,
    duration: config.duration || 0,
    mixdownProgress: 0,
    mixdownReady: false,
    stemLoadProgress: stemProgress,
    allStemsReady: false,
  });
  
  console.log(`📋 Song prepared: ${config.songId} (waiting for user gesture)`);
}

/**
 * Check if a song is prepared but not loaded.
 */
isPrepared(): boolean {
  return this.currentSongConfig !== null && !this.mixdownBuffer;
}
```

Modify `loadSong()` to work with prepared config:

```typescript
async loadSong(config?: SongConfig): Promise<void> {
  // Use stored config if none provided
  const songConfig = config || this.currentSongConfig;
  if (!songConfig) {
    console.warn('No song config to load');
    return;
  }
  
  // ... rest of existing loadSong implementation
}
```

### 2. `src/hooks/useAudioEngine.ts`

Change the song loading effect to use `prepareSong()` instead of `loadSong()`:

```typescript
// Prepare song when currentSong changes (safe - no AudioContext)
useEffect(() => {
  if (!currentSong || currentSong.id === prevSongIdRef.current) return;
  if (isLoadingRef.current) return;
  
  prevSongIdRef.current = currentSong.id;

  const stemsWithAudio = currentSong.stems.filter((stem) => stem.url && stem.url.length > 0);
  if (stemsWithAudio.length === 0) {
    console.log('No audio stems for this song');
    return;
  }

  const songConfig: SongConfig = {
    songId: currentSong.id,
    mixdownUrl: currentSong.fullMixUrl || undefined,
    stems: stemsWithAudio.map((stem) => ({
      id: stem.id,
      name: stem.name,
      url: stem.url,
      color: stem.color,
      type: stem.type,
    })),
    duration: currentSong.duration,
  };

  // CHANGED: Prepare only - don't load (no AudioContext created)
  webAudioEngine.prepareSong(songConfig);
}, [currentSong?.id]);
```

Add a new `load` function that's safe to call from click handlers:

```typescript
const load = useCallback(async () => {
  if (webAudioEngine.isPrepared()) {
    await webAudioEngine.loadSong();
  }
}, []);
```

Update the `init` callback to include loading:

```typescript
const init = useCallback(async () => {
  await webAudioEngine.init();
  // If song is prepared but not loaded, load it now
  if (webAudioEngine.isPrepared()) {
    await webAudioEngine.loadSong();
  }
}, []);
```

### 3. `src/pages/TrainingMode.tsx`

Update the Play handler to ensure full initialization:

```typescript
const handlePlayPause = async () => {
  if (songHasRealAudio) {
    // User gesture - safe to init AudioContext and load audio
    await initAudioEngine(); // This now handles: init() + loadSong() if prepared
    engineTogglePlayPause();
  } else {
    storeTogglePlayPause();
  }
};
```

---

## Flow After Fix

```text
User navigates to /training/testify-exercise
         ↓
useEffect fires → prepareSong() called
         ↓
Song config stored (metadata only, no AudioContext) ✓
         ↓
UI shows song info, Play button ready
         ↓
User taps Play button
         ↓
initAudioEngine() called from onClick ✓
         ↓
new AudioContext() created (in user gesture) ✓
         ↓
loadSong() fetches and decodes audio buffers ✓
         ↓
Audio plays!
```

---

## Mobile Compatibility Notes

- `AudioContext` is only created inside `init()` which is only called from click handlers
- `prepareSong()` can safely run in `useEffect` because it only stores metadata
- The first Play tap may have a brief delay as audio loads, but won't crash
- Subsequent taps are instant since audio is already loaded

---

## Testing Checklist

After implementing:

1. **Desktop Chrome/Safari**: Open exercise, press Play, verify audio works
2. **Mobile Safari (iPhone)**: Open exercise, verify no crash, tap Play, verify audio plays
3. **Mobile Chrome (Android)**: Same as above
4. **Lock screen**: Verify media controls work after playing
5. **Navigation**: Leave Training Mode, verify audio stops

---

## Summary

| Before | After |
|--------|-------|
| `loadSong()` in useEffect | `prepareSong()` in useEffect |
| AudioContext created on mount | AudioContext created on Play tap |
| Mobile crashes | Mobile works |
