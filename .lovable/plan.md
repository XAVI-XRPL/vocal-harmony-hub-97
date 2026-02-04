
# Audio Sync Verification and Improvements for DONT LEAVE EXERCISE

## Summary
The "3. DONT LEAVE EXERCISE" song has 12 stems compared to 9 (Testify) and 6 (Throwback). The existing synchronization system is robust, but a few targeted improvements will ensure rock-solid sync for larger stem counts and smoother A-B loop behavior.

## Current Architecture Analysis

The audio synchronization system uses:
- **Howler.js** with HTML5 audio mode for streaming
- **Master Clock** reference (wall-clock time) for accurate position tracking
- **Drift Correction** at 1-second intervals with a 0.15s threshold
- **Synchronized Seeking** with pause-seek-verify-resume cycle

## Identified Improvements

### 1. Increase Seek Sync Delay for Larger Stem Counts
With 12 stems, HTML5 audio buffers need slightly more time to stabilize after seeking. Increase the delay from 150ms to 200ms.

### 2. Tighter Drift Tolerance
Reduce the correction threshold from 0.15s to 0.10s to catch drift earlier before it becomes audible.

### 3. Staggered Stem Start for Better Sync
When resuming playback, start stems in small batches rather than all at once to reduce browser audio thread contention.

### 4. Loop Boundary Buffer
Add a small safety margin when detecting loop end to prevent overshoot on slower devices.

### 5. Force Sync on Loop Reset
Explicitly re-sync all stems when looping back to start point, not just seek.

## Technical Implementation

### File: `src/hooks/useAudioPlayer.ts`

#### Change 1: Adjust timing constants for 12-stem songs
```typescript
// Current
const SEEK_SYNC_DELAY_MS = 150;
const DRIFT_CORRECTION_THRESHOLD = 0.15;

// New (optimized for larger stem counts)
const SEEK_SYNC_DELAY_MS = 200;
const DRIFT_CORRECTION_THRESHOLD = 0.10;
```

#### Change 2: Improve loop detection with buffer zone
In the animation frame update loop, add a small buffer before the loop end point to prevent overshoot:
```typescript
// Current
if (time >= state.loopEnd) {

// New - add 0.05s buffer for detection
if (time >= state.loopEnd - 0.05) {
```

#### Change 3: Force sync on loop reset
When looping back to start, add a brief pause-sync-resume cycle instead of direct seek for tighter synchronization:
```typescript
// Pause all, seek to loop start, resume
stemHowlsRef.current.forEach(({ howl }) => howl.pause());
stemHowlsRef.current.forEach(({ howl }) => howl.seek(state.loopStart));

// Small delay then resume
setTimeout(() => {
  stemHowlsRef.current.forEach(({ howl }) => howl.play());
}, 20);
```

#### Change 4: Add stem-count-aware sync verification
Scale the sync tolerance based on the number of stems:
```typescript
const getSyncTolerance = (stemCount: number): number => {
  // More stems = slightly looser tolerance to avoid overcorrection
  if (stemCount > 10) return 0.10;
  if (stemCount > 6) return 0.08;
  return 0.06;
};
```

## Expected Results
- All 12 stems in DONT LEAVE EXERCISE will stay in perfect sync during playback
- Skip forward/backward will properly re-sync all stems before resuming
- A-B loop will smoothly reset without drift accumulation
- No audio overlapping or phasing artifacts

## Testing Checklist
After implementation:
1. Play DONT LEAVE EXERCISE from start - verify all 12 stems are in sync
2. Skip forward 10s multiple times - stems should resync each time
3. Set an A-B loop and let it repeat 5+ times - no drift should accumulate
4. Drag the loop markers while playing - playback should remain smooth
5. Double-tap to clear loop - verify seamless continuation
