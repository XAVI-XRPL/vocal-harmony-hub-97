
# Fix Loop Marker Drag Glitch - Audio Restart Issue

## Problem Identified

When dragging the loop markers (A/B tabs), the song glitches and restarts from the beginning. This happens because changing `loopStart` or `loopEnd` values triggers the play/pause effect to re-run, which calls `syncPlay()` and disrupts playback.

---

## Technical Analysis

### Current Bug Flow

```text
User drags loop marker (e.g., B tab)
     ↓
setLoop(loopStart, newTime) called → loopEnd state updates
     ↓
useEffect dependency [loopStart, loopEnd] triggers re-run
     ↓
Effect sees isPlaying=true → calls syncPlay(playbackStartPositionRef.current)
     ↓
playbackStartPositionRef has outdated value (e.g., 0 or old seek position)
     ↓
Audio jumps back to wrong position (usually beginning)
```

### The Bug Location

**File: `src/hooks/useAudioPlayer.ts`** (line 332)

```typescript
useEffect(() => {
  if (isPlaying) {
    if (seekResumeRef.current) {
      seekResumeRef.current = false;
    } else {
      syncPlay(playbackStartPositionRef.current); // ← RUNS ON EVERY loopStart/loopEnd CHANGE
    }
    // ...
  }
}, [isPlaying, isLoaded, isLooping, loopStart, loopEnd, syncPlay, correctDrift, reSeekAllStems]);
//                        ^^^^^^^^^ ^^^^^^^^^ ^^^^^^^ - These cause the effect to re-fire
```

---

## Solution

### Approach: Skip syncPlay when only loop values change

The fix involves:

1. **Track when loop values change during playback** - Use a ref to detect if the effect is re-running due to loop changes vs. play state changes
2. **Only call syncPlay when truly starting playback** - Not when loop boundaries are being adjusted
3. **Keep the master clock ref updated** - Continuously update `playbackStartPositionRef` during playback so it stays current

### Changes Required

**File: `src/hooks/useAudioPlayer.ts`**

1. **Add a ref to track if we're just updating loop values:**
   ```typescript
   const loopChangeRef = useRef(false);
   ```

2. **Add a separate effect to detect loop-only changes:**
   - When `loopStart` or `loopEnd` changes during playback, set `loopChangeRef.current = true`
   - The main effect can then skip `syncPlay` when this flag is set

3. **Alternative (cleaner): Use a "wasPlaying" ref pattern:**
   - Store the previous `isPlaying` state in a ref
   - Only call `syncPlay` when `isPlaying` transitions from `false` to `true`
   - This prevents re-seeking when the effect re-runs for other dependency changes

4. **Keep master clock synchronized during playback:**
   - In the animation frame loop, periodically update `playbackStartPositionRef.current` and `playbackStartTimeRef.current`
   - This ensures if the effect does re-run, it uses the current position

---

## Implementation Details

### Change 1: Add a ref to track previous playing state

```typescript
const wasPlayingRef = useRef(false);
```

### Change 2: Update the play/pause effect to only syncPlay on true play transitions

```typescript
useEffect(() => {
  if (!isLoaded || stemHowlsRef.current.length === 0) return;

  if (isPlaying) {
    // Only call syncPlay if we're truly starting playback (wasPlayingRef was false)
    // OR if we just resumed from a seek (seekResumeRef is handled separately)
    if (seekResumeRef.current) {
      seekResumeRef.current = false;
      // Skip syncPlay - seek already positioned us
    } else if (!wasPlayingRef.current) {
      // Transitioning from paused to playing - sync all stems
      syncPlay(playbackStartPositionRef.current);
    }
    // If wasPlayingRef.current is already true, we're just re-running due to 
    // loop value changes - don't interrupt playback

    wasPlayingRef.current = true;

    // Start the animation frame loop...
  } else {
    wasPlayingRef.current = false;
    // ... pause logic
  }
}, [isPlaying, isLoaded, isLooping, loopStart, loopEnd, syncPlay, correctDrift, reSeekAllStems]);
```

### Change 3: Update master clock periodically during playback

In the animation frame loop, add:

```typescript
// Periodically sync master clock to current playback position
// This ensures playbackStartPositionRef stays accurate
if (time > 0) {
  playbackStartTimeRef.current = Date.now();
  playbackStartPositionRef.current = time;
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Add wasPlayingRef, update effect logic to skip syncPlay on loop changes, keep master clock synced |

---

## Expected Result

| Action | Before | After |
|--------|--------|-------|
| Drag loop start (A) marker | Song restarts from beginning | Playback continues uninterrupted |
| Drag loop end (B) marker | Song glitches/restarts | Playback continues uninterrupted |
| Toggle loop on/off | May cause position jump | Playback continues smoothly |
| Works for all exercises | Only some worked | All exercises work correctly |

---

## Why This Fix Works

1. **Ref tracks play state transitions** - `wasPlayingRef` distinguishes between "starting to play" vs "already playing and something else changed"
2. **Loop changes don't trigger sync** - When `loopStart`/`loopEnd` change during playback, `wasPlayingRef.current` is already `true`, so `syncPlay` is skipped
3. **Master clock stays accurate** - Continuous updates to `playbackStartPositionRef` mean if we do need to sync, we use the correct position
4. **Seek still works** - The `seekResumeRef` flag continues to handle seek-initiated playback correctly

This fix ensures loop marker dragging works smoothly for all exercises across the entire app, without any glitches or position jumps.
