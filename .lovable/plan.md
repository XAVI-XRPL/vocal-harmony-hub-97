
# Fix Seeking to Middle of Track - Audio Player Bug

## Problem Identified

When a user clicks on the waveform to seek to the middle of a track, the audio restarts from the beginning instead of jumping to the clicked position.

**Root Cause:** In `useAudioPlayer.ts`, the play/pause effect captures `currentTime` in a stale closure. When `seekTo()` completes and resumes playback, the effect's `syncPlay(currentTime)` call uses an outdated `currentTime` value instead of the newly seeked position.

---

## Technical Analysis

### Current Flow (Broken)

```text
User clicks waveform at 1:30
     ↓
seekTo(90) called → pauses all stems → seeks to 90s → resumes playback
     ↓
Resume triggers isPlaying effect
     ↓
syncPlay(currentTime) called with STALE value (e.g., 5s from when effect was created)
     ↓
Audio jumps back to 5s instead of 90s
```

### The Bug Location

File: `src/hooks/useAudioPlayer.ts` (lines 240-294)

```typescript
useEffect(() => {
  if (isPlaying) {
    syncPlay(currentTime);  // ← currentTime is STALE (not in dependency array)
    // ...
  }
}, [isPlaying, isLoaded, ...]); // currentTime NOT included
```

The `seekTo` function correctly seeks all Howl instances, but when it resumes playback, the `isPlaying` state change triggers this effect, which calls `syncPlay(currentTime)` with the old `currentTime` captured when the effect was first mounted.

---

## Solution

### Approach: Use Master Clock Reference Instead of Stale State

Instead of relying on `currentTime` from the store (which may be stale due to React's closure behavior), use `playbackStartPositionRef.current` which is updated by `seekTo()` before resuming playback.

### Changes Required

**File: `src/hooks/useAudioPlayer.ts`**

1. **Update `seekTo()` to set master clock BEFORE resuming playback:**
   - Set `playbackStartPositionRef.current = time` before calling `howl.play()`
   - This ensures the master clock has the correct position

2. **Update the play/pause effect to use the master clock:**
   - Change `syncPlay(currentTime)` to `syncPlay(playbackStartPositionRef.current)`
   - The master clock ref is always current since it's updated synchronously by `seekTo()`

3. **Add a seek-triggered playback flag:**
   - When `seekTo()` resumes playback directly, skip the `syncPlay` in the effect to avoid double-seeking

---

## Implementation Details

### Change 1: Update seekTo to track seek-initiated playback

Add a ref to track when playback is resumed from seeking:

```typescript
const seekResumeRef = useRef(false);
```

In `seekTo()`, before resuming playback:

```typescript
// Set master clock position BEFORE resuming
playbackStartTimeRef.current = Date.now();
playbackStartPositionRef.current = time;
seekResumeRef.current = true; // Mark that we're resuming from seek

// Resume playback
stemHowlsRef.current.forEach(({ howl }) => {
  howl.play();
});
```

### Change 2: Update play/pause effect to respect seek-initiated playback

```typescript
useEffect(() => {
  if (!isLoaded || stemHowlsRef.current.length === 0) return;

  if (isPlaying) {
    // Skip syncPlay if we just resumed from a seek
    if (seekResumeRef.current) {
      seekResumeRef.current = false;
      // Just start the animation frame loop, don't re-seek
    } else {
      // Normal play - use master clock position
      syncPlay(playbackStartPositionRef.current);
    }
    
    // Start animation frame loop...
  }
}, [isPlaying, isLoaded, ...]);
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Fix stale closure by using refs and skip flag |

---

## Expected Result

| Action | Before | After |
|--------|--------|-------|
| Play, click waveform at 1:30 | Jumps back to ~0:05 | Plays from 1:30 |
| Seek while paused, then play | Starts from old position | Starts from seeked position |
| Skip forward/back buttons | May jump to wrong position | Jumps correctly |
| Works for all exercises | Only some worked | All exercises work correctly |

---

## Why This Fix Works

1. **Refs are synchronously updated** - Unlike React state which batches updates, `seekResumeRef.current` is immediately true when set
2. **Master clock is source of truth** - `playbackStartPositionRef.current` always has the correct position because `seekTo()` sets it before resuming
3. **No stale closures** - The fix doesn't rely on the `currentTime` state variable being fresh in the effect

This fix ensures seeking works correctly for all exercises across the entire app, whether the user clicks on the waveform, uses skip buttons, or sets loop markers.
