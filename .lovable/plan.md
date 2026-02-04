
# Fix Loop Marker Drag Glitch - Complete Solution

## Problem Summary

When dragging the red B tab (or green A tab) for the loop, the app glitches and the song restarts from the beginning. This occurs on both "TESTIFY EXERCISE" and "THROWBACK EXERCISE" (and would affect any future exercises).

The root cause is a combination of:
1. High-frequency state updates from pointer movement during marker dragging
2. The `useAudioPlayer` effect re-running on every `loopStart`/`loopEnd` change
3. React's internal queue getting corrupted from rapid state updates ("Should have a queue" error)

---

## Technical Analysis

### Current Bug Flow

```text
User drags loop marker (B tab)
     |
     v
onPointerMove fires 60+ times/second
     |
     v
setLoop(loopStart, newTime) called repeatedly
     |
     v
useEffect dependency [loopStart, loopEnd] triggers re-run rapidly
     |
     v
React state queue gets corrupted from high-frequency updates
     |
     v
"Should have a queue" error + audio restarts from beginning
```

### Files Involved

| File | Role |
|------|------|
| `src/hooks/useAudioPlayer.ts` | Audio sync logic with loop dependencies |
| `src/components/audio/LoopRegion.tsx` | Loop marker drag handling |
| `src/stores/audioStore.ts` | Loop state storage (`setLoop`, `loopStart`, `loopEnd`) |

---

## Solution

### Part 1: Remove Loop Dependencies from Play/Pause Effect

The play/pause effect in `useAudioPlayer.ts` should NOT have `loopStart` and `loopEnd` in its dependency array. Loop handling is done inside the animation frame loop (which already reads these values directly from the store via `useAudioStore.getState()`), so re-running the entire effect on loop changes is unnecessary and causes the bug.

**File: `src/hooks/useAudioPlayer.ts`**

```typescript
// BEFORE (line 352):
}, [isPlaying, isLoaded, isLooping, loopStart, loopEnd, syncPlay, correctDrift, reSeekAllStems]);

// AFTER:
}, [isPlaying, isLoaded, syncPlay, correctDrift]);
```

The animation frame loop already handles loop boundary checks using `state.isLooping`, `state.loopStart`, and `state.loopEnd` from `useAudioStore.getState()`, so there's no need for the effect to re-run when these values change.

### Part 2: Throttle Loop Marker Updates

Add throttling to the `LoopRegion` component to reduce the frequency of state updates during dragging.

**File: `src/components/audio/LoopRegion.tsx`**

Add a throttle mechanism to limit `onLoopStartChange` and `onLoopEndChange` calls to once every 50ms:

```typescript
const throttleRef = useRef<number>(0);
const THROTTLE_MS = 50;

const handlePointerMove = useCallback((e: React.PointerEvent) => {
  if (!draggingMarker) return;
  
  const now = Date.now();
  if (now - throttleRef.current < THROTTLE_MS) return; // Skip if too soon
  throttleRef.current = now;
  
  const time = getTimeFromEvent(e);
  // ... rest of logic
}, [/* deps */]);
```

### Part 3: Fix onend Handler Stale Closure

The `onend` handler in `loadSong` (line 221-226) has a stale closure issue - it captures `isLooping` at load time:

```typescript
// BEFORE:
onend: () => {
  if (!isLooping) {  // ← Stale! Always the value from when song loaded
    pause();
    updateCurrentTime(0);
  }
},

// AFTER:
onend: () => {
  const state = useAudioStore.getState();
  if (!state.isLooping) {  // ← Fresh value from store
    state.pause();
    state.updateCurrentTime(0);
  }
},
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Remove `isLooping`, `loopStart`, `loopEnd` from effect deps; fix `onend` stale closure |
| `src/components/audio/LoopRegion.tsx` | Add throttling to reduce state update frequency during drag |

---

## Expected Result

| Action | Before | After |
|--------|--------|-------|
| Drag loop start (A) marker | Song restarts, glitches | Smooth dragging, no restart |
| Drag loop end (B) marker | Song restarts, glitches | Smooth dragging, no restart |
| React queue error | Crashes app on drag | No errors |
| TESTIFY EXERCISE | Has bug | Fixed |
| THROWBACK EXERCISE | Has bug | Fixed |
| Future song uploads | Would have bug | Automatically fixed |

---

## Why This Fix Works

1. **Effect doesn't re-run on loop changes** - Removing `loopStart`/`loopEnd` from dependencies means marker dragging doesn't trigger the effect
2. **Loop logic stays in animation frame** - The frame loop already reads current loop values from the store, so it always has fresh data
3. **Throttling reduces state churn** - Limiting updates to 20 times/second (50ms interval) prevents React queue corruption while still feeling responsive
4. **Works for all songs** - The fix is in shared hooks/components that all exercises use
