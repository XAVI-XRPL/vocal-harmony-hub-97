
# Fix: Seeking Jumps Back to Beginning

## Problem Summary
When clicking on the waveform to seek during playback, the song jumps back to the beginning instead of seeking to the clicked position.

## Root Cause Analysis

After examining the code, I found the issue in `src/services/webAudioEngine.ts` in the `seek()` method (lines 390-408):

```typescript
seek(time: number): void {
  const clampedTime = Math.max(0, Math.min(time, this.state.duration));
  
  if (this.state.playbackState === 'playing') {
    this.stopAllSources();
    
    if (this.state.audioMode === 'stems' && this.state.allStemsReady) {
      this.createAndStartStemSources(clampedTime);
    } else if (this.mixdownBuffer) {
      this.createAndStartMixdownSource(clampedTime);
    }
    
    this.updateState({ currentTime: clampedTime });
  } else {
    this.updateState({ currentTime: clampedTime });
  }
}
```

**The bug**: The `seek()` method stops all sources and creates new ones, which correctly updates `playStartOffset`. However, there's a subtle timing issue:

1. When `stopAllSources()` is called, it stops the loop checking interval
2. The new sources are started with `createAndStartStemSources(clampedTime)` or `createAndStartMixdownSource(clampedTime)`
3. These methods call `startLoopChecking()` but NOT `startTimeTracking()`
4. The time tracking animation frame is still running with the OLD references

The time tracking continues to run (never stopped during seek), but after `stopAllSources()`, there may be a brief window where `getCurrentTime()` returns stale data before the new `playStartTime` and `playStartOffset` are set.

Additionally, when stems mode is active but the condition `this.state.audioMode === 'stems' && this.state.allStemsReady` is checked, if `audioMode` hasn't been updated to `'stems'` yet (still `'mixdown'`), it falls through to `mixdownBuffer` but the mixdown source might not be the current active source.

## Solution

Update the `seek()` method to:
1. Properly restart time tracking after creating new sources
2. Ensure the correct audio mode is checked

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/services/webAudioEngine.ts` | Fix the seek method to properly restart time tracking and handle audio mode transition |

---

## Implementation

### `src/services/webAudioEngine.ts`

Update the `seek()` method around line 390:

```typescript
seek(time: number): void {
  const clampedTime = Math.max(0, Math.min(time, this.state.duration));
  
  console.log(`🎵 Seeking to ${clampedTime.toFixed(2)}s (playbackState: ${this.state.playbackState}, audioMode: ${this.state.audioMode})`);
  
  if (this.state.playbackState === 'playing') {
    // Stop current sources
    this.stopAllSources();
    this.stopTimeTracking(); // Also stop time tracking
    
    // Restart sources at new position
    // Check allStemsReady first since audioMode might still be 'mixdown' during transition
    if (this.state.allStemsReady) {
      this.createAndStartStemSources(clampedTime);
    } else if (this.mixdownBuffer) {
      this.createAndStartMixdownSource(clampedTime);
    }
    
    // Update state and restart time tracking
    this.updateState({ currentTime: clampedTime });
    this.startTimeTracking(); // Restart time tracking with new offset
  } else {
    // Just update the position for when we resume
    this.updateState({ currentTime: clampedTime });
  }
}
```

**Key changes:**
1. Call `stopTimeTracking()` before stopping sources
2. Check `allStemsReady` first (not `audioMode === 'stems'`) since mode might not be updated yet
3. Call `startTimeTracking()` after creating new sources to ensure fresh timing
4. Add debug logging to help trace seek operations

---

## Testing Checklist

After implementation:
1. Play audio
2. Click on the waveform to seek to middle of track - should jump to that position
3. Click on the waveform to seek to near the end - should jump to that position
4. Use skip forward/back buttons - should work correctly
5. Seek while in mixdown mode (before stems load) - should work
6. Seek while in stems mode (after stems load) - should work
