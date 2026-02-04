

# Fix Audio Sync Issues and Rename Exercises

## Problem Analysis

The console logs reveal the core issue:
```
Drift detected: 0.126s, correcting...
Drift detected: 0.291s, correcting...
Drift detected: 0.544s, correcting...
Drift detected: 0.367s, correcting...
```

The drift correction is firing constantly (every 500ms) but the stems immediately go out of sync again. This creates the "skipping and looping" effect you're experiencing.

---

## Root Causes Identified

| Issue | Description |
|-------|-------------|
| **Pause-Seek-Resume creates drift** | When correcting drift, the code pauses all stems, seeks them, then resumes - but resuming isn't instant and causes new drift |
| **Overcorrection loop** | Correction triggers pause/seek/resume which causes more drift, triggering more corrections |
| **HTML5 streaming latency** | Each stem loads independently and has variable buffering, causing natural drift |
| **Insufficient stabilization time** | The 30ms delay before resuming after correction is too short |
| **Correction interrupts playback** | Frequent corrections cause audible "skipping" |

---

## Solution Overview

### 1. Smarter Drift Correction Strategy

Instead of pause-seek-resume for every drift, use a more intelligent approach:
- Increase drift tolerance threshold for correction (allow small drift)
- Add a debounce period after correction to let audio stabilize
- Only correct when drift is significant AND persistent

### 2. Use Web Audio API Clock Reference

Add a master clock reference to synchronize stems rather than correcting after drift occurs:
- Track intended playback position based on wall-clock time
- Adjust stems toward the master position gradually

### 3. Improve Seek Synchronization  

Enhance the seek operation with better verification:
- Longer stabilization delay before resuming (150ms)
- Verify sync BEFORE resuming playback
- If sync fails, retry with fresh seeks

---

## Technical Implementation

### File: `src/hooks/useAudioPlayer.ts`

#### Constants Changes

| Constant | Current | New |
|----------|---------|-----|
| `SEEK_SYNC_DELAY_MS` | 100 | 150 |
| `SYNC_TOLERANCE_SEC` | 0.05 | 0.08 |
| `DRIFT_CHECK_INTERVAL_MS` | 500 | 1000 |
| `DRIFT_CORRECTION_THRESHOLD` | (new) | 0.15 |
| `MIN_CORRECTION_INTERVAL_MS` | (new) | 2000 |

#### New: Master Clock Synchronization

Add a master clock that tracks where playback SHOULD be:

```typescript
// Track playback start time for master clock
const playbackStartTimeRef = useRef<number>(0);
const playbackStartPositionRef = useRef<number>(0);

// Calculate expected position based on wall-clock
const getExpectedPosition = (): number => {
  if (!isPlaying) return currentTime;
  const elapsed = (Date.now() - playbackStartTimeRef.current) / 1000;
  return playbackStartPositionRef.current + (elapsed * playbackRate);
};
```

#### Improved Drift Correction

Replace aggressive pause-seek-resume with gentle nudging:

```typescript
const correctDrift = useCallback(() => {
  // ... existing guards ...
  
  // Check if we corrected too recently
  if (now - lastDriftCorrectionRef.current < MIN_CORRECTION_INTERVAL_MS) return;
  
  const spread = maxPos - minPos;
  
  // Only correct significant drift
  if (spread > DRIFT_CORRECTION_THRESHOLD) {
    lastDriftCorrectionRef.current = now;
    
    // Calculate expected position from master clock
    const expectedPos = getExpectedPosition();
    
    // Pause briefly for clean correction
    stemHowlsRef.current.forEach(({ howl }) => howl.pause());
    
    // Seek all to expected position
    reSeekAllStems(expectedPos);
    
    // Longer delay before resuming
    setTimeout(() => {
      if (useAudioStore.getState().isPlaying) {
        // Start all stems together
        stemHowlsRef.current.forEach(({ howl }) => howl.play());
        
        // Reset master clock
        playbackStartTimeRef.current = Date.now();
        playbackStartPositionRef.current = expectedPos;
      }
    }, 100);
  }
}, [/* deps */]);
```

#### Improved Play/Pause with Master Clock

```typescript
// When starting playback, record master clock reference
if (isPlaying) {
  playbackStartTimeRef.current = Date.now();
  playbackStartPositionRef.current = currentTime;
  syncPlay(currentTime);
  // ...
}
```

---

## Song Title Rename

### File: `src/data/mockSongs.ts`

| Current Title | New Title |
|---------------|-----------|
| `TESTIFY EXERCISE` | `1. TESTIFY EXERCISE` |
| `THROWBACK EXERCISE` | `2. THROWBACK EXERCISE` |

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Add master clock, improve drift correction strategy, longer stabilization delays |
| `src/data/mockSongs.ts` | Rename song titles with numerical prefixes |

---

## Expected Outcome

- Drift corrections will be less frequent (only when needed)
- No overcorrection loops causing continuous skipping
- Master clock keeps stems synchronized to intended position
- More stable multi-track playback experience
- Songs properly numbered as "1. TESTIFY EXERCISE" and "2. THROWBACK EXERCISE"

