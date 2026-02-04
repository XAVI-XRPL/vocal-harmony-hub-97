
# Fix Audio Track Synchronization on Throwback Exercise

## Problem Analysis

When seeking (skipping around) in the Throwback Exercise training mode, the audio stems lose synchronization. This is a known challenge with HTML5 audio when playing multiple tracks simultaneously.

---

## Root Causes

After analyzing the `useAudioPlayer.ts` implementation, I identified several issues:

| Issue | Description |
|-------|-------------|
| **Short sync delay** | The 50ms delay after seeking may not be enough for HTML5 audio buffers to stabilize across 6+ stems |
| **Single correction attempt** | After seeking, drift is checked once but only corrected once - persistent drift isn't handled |
| **No pre-playback alignment** | When resuming, stems start playing without verifying they're all at the same position |
| **No continuous drift correction** | During playback, stems can gradually drift apart with no correction mechanism |

---

## Solution Overview

Implement a more robust synchronization system with:

1. **Increased sync delay** - Allow more time for HTML5 buffers to stabilize
2. **Multiple correction passes** - Retry sync correction if drift persists
3. **Pre-playback alignment verification** - Confirm all stems are aligned before resuming
4. **Continuous drift monitoring** - Detect and correct drift during playback

---

## Technical Implementation

### File: `src/hooks/useAudioPlayer.ts`

#### 1. Increase Sync Constants

| Constant | Before | After |
|----------|--------|-------|
| `SEEK_SYNC_DELAY_MS` | 50 | 100 |
| `SYNC_TOLERANCE_SEC` | 0.1 | 0.05 |

Add new constant:
- `MAX_SYNC_RETRIES = 3` - Maximum correction attempts after seeking

#### 2. Enhanced `seekTo` Function

Implement retry logic for sync correction:

```text
seekTo(time):
  1. Set seeking flag
  2. Cancel animation frame
  3. Pause all stems
  4. Seek all stems to target time
  5. Update store immediately (UI responsiveness)
  6. Wait for buffer stabilization (100ms)
  7. Verify sync (check position spread)
  8. If out of sync:
     - Re-seek all stems
     - Wait again
     - Repeat up to MAX_SYNC_RETRIES times
  9. If was playing, resume all stems simultaneously
  10. Clear seeking flag
```

#### 3. Add Continuous Drift Correction

During playback, add drift detection and correction:

```text
In updateTime loop:
  1. Read positions from all stems
  2. Calculate position spread (max - min)
  3. If spread > SYNC_TOLERANCE:
     - Pause all stems briefly
     - Re-seek to median position
     - Resume playback
```

#### 4. Synchronized Playback Start

Replace individual `howl.play()` calls with a synchronized start:

```text
syncPlay():
  1. Get target position from first stem
  2. Seek all stems to that position
  3. Wait for buffer sync
  4. Call play() on all stems in rapid succession
```

---

## Detailed Code Changes

### Constants Section
```typescript
const SEEK_SYNC_DELAY_MS = 100;
const SYNC_TOLERANCE_SEC = 0.05;
const MAX_SYNC_RETRIES = 3;
const DRIFT_CHECK_INTERVAL = 500; // Check every 500ms during playback
```

### New Helper: `verifyStemSync`
```typescript
const verifyStemSync = (targetTime: number): boolean => {
  const positions = stemHowlsRef.current.map(({ howl }) => howl.seek() as number);
  const minPos = Math.min(...positions);
  const maxPos = Math.max(...positions);
  return (maxPos - minPos) <= SYNC_TOLERANCE_SEC && 
         positions.every(p => Math.abs(p - targetTime) < SYNC_TOLERANCE_SEC);
};
```

### Enhanced `seekTo` with Retry Loop
```typescript
const seekTo = useCallback(async (time: number) => {
  if (isSeekingRef.current) return;
  // ... pause, seek, verify sync with retries
  for (let attempt = 0; attempt < MAX_SYNC_RETRIES; attempt++) {
    if (verifyStemSync(time)) break;
    // Re-seek and wait
  }
  // Resume if was playing
}, []);
```

### Periodic Drift Correction
Add interval-based drift checking during playback that detects when stems have drifted apart and performs a quick re-sync.

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Increase sync delay, add retry logic, add continuous drift correction, add synchronized playback start |

---

## Expected Outcome

- Stems remain synchronized when seeking to any position
- Rapid seeking handled gracefully with debouncing
- Any drift that occurs during playback is automatically corrected
- More reliable multi-track audio experience across different browsers

---

## Testing Recommendations

After implementation:
1. Seek to various positions rapidly
2. Test with playback rate changes (0.5x, 1.5x)
3. Test loop region seeking
4. Verify on both desktop and mobile browsers
