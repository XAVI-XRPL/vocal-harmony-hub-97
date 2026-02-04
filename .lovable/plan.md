

# Fix Multi-Stem Audio Synchronization During Seeking

## Problem Analysis

When users seek to a different position in the audio, the stem tracks fall out of sync. This happens because:

1. **Asynchronous HTML5 Seeking** - Each Howl instance with `html5: true` processes seek commands independently with varying delays
2. **No Synchronization Barrier** - Stems resume playback individually after seeking rather than waiting for all to be ready
3. **Continuous Playback During Seek** - Seeking while playing doesn't pause first, causing stems to drift

---

## Solution Overview

Implement a synchronized seek mechanism that:
1. Pauses all stems before seeking
2. Seeks all stems to the target position
3. Waits for all stems to complete the seek operation
4. Resumes playback only after all stems are synchronized

---

## Technical Implementation

### Modified: `src/hooks/useAudioPlayer.ts`

Update the `seekTo` function to implement synchronized seeking:

```text
Current Flow:
  Click Seek → forEach(seek) → Update Time → Continue Playing

Fixed Flow:
  Click Seek → Pause All → forEach(seek) → Wait for Ready → Resume All
```

**Key Changes:**

1. **Track Seeking State** - Add an `isSeeking` ref to prevent race conditions during seek operations

2. **Synchronized Seek Function** - New implementation:
   - Pause all stems immediately
   - Store the "was playing" state
   - Seek all stems to the target time
   - Use `setTimeout` with a small delay to allow HTML5 audio to complete seek
   - Resume playback only if was playing before

3. **Seek Verification** - After seeking, verify all stems are at approximately the same position before resuming

4. **Optional: Web Audio API Mode** - For tighter sync, consider using Web Audio API (html5: false) for smaller audio files, which offers sample-accurate synchronization

---

## Implementation Details

### Changes to `useAudioPlayer.ts`

| Section | Change |
|---------|--------|
| Add ref | `isSeekingRef = useRef(false)` to track seek state |
| Update seekTo | Implement pause-seek-resume pattern |
| Add sync verification | Check all stems are within tolerance before resume |
| Handle edge cases | Prevent double-seeks and race conditions |

### Synchronization Strategy

```text
seekTo(time):
  1. Set isSeeking = true
  2. wasPlaying = check if currently playing
  3. Pause all Howl instances immediately
  4. Cancel animation frame
  5. Update store currentTime
  6. For each stem: howl.seek(time)
  7. Wait ~50ms for HTML5 audio buffers
  8. If wasPlaying: resume all stems together
  9. Set isSeeking = false
```

### Tolerance-Based Verification

After seeking, verify sync by checking that all stems report positions within ~100ms of each other. If not in sync, re-seek the outliers.

---

## Additional Improvements

### Improve Time Tracking

Currently the animation frame reads time from only the first stem. Update to:
- Read position from multiple stems
- Use median or consensus position
- Detect and correct drift during playback

### Loop Boundary Handling

Ensure loop point seeking also uses the synchronized method to prevent drift when looping.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Implement synchronized seeking with pause-seek-resume pattern |
| `src/stores/audioStore.ts` | Add optional `isSeeking` state if UI feedback needed |

---

## Expected Outcome

- All stems remain perfectly synchronized when seeking to any position
- Seeking is smooth with no audible glitches or drift
- Loop points work correctly with synchronized seeking
- Skip forward/back buttons maintain sync
- Waveform clicking maintains sync

