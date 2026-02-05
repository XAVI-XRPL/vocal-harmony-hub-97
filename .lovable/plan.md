
# Fix Choppy Audio for "12. Testify Version 2" & Full Song Loading

## Problem Analysis

### Root Cause: "12. TESTIFY (VERSION 2)" Has 14 Stems
This song has significantly more audio tracks than others (14 stems vs 6-12 for other songs). Loading and synchronizing 14 simultaneous audio streams causes:

1. **Network congestion** - 14 concurrent HTTP requests competing for bandwidth
2. **Audio buffer starvation** - Howler.js HTML5 mode streams audio, and with 14 streams, some may not buffer fast enough
3. **Synchronization stress** - The drift correction algorithm runs on 14 tracks simultaneously
4. **Memory pressure** - More audio data being processed in parallel

### Current Loading Behavior Issues

1. **No "ready to play" gate** - The play button enables as soon as `isLoaded` becomes true, but `isLoaded` is set when all stems have *started* loading, not when they're *ready to play*
2. **Immediate playback** - Users can press play before audio has buffered enough data
3. **Preloading doesn't wait for buffering** - The blob URL preload downloads the entire file, but Howler.js still needs to buffer it
4. **Concurrent stem loading** - All 14 stems attempt to load simultaneously, causing bandwidth competition

---

## Implementation Plan

### Phase 1: Add Audio Buffer Readiness Detection

**File: `src/hooks/useAudioPlayer.ts`**

Add a `bufferedStemsCount` state and listen for Howler's `onplay` or check `duration()` availability to confirm each stem is truly ready:

1. Track how many stems have reported they can play smoothly
2. Add a new `isBuffering` state that's true until a minimum threshold of stems are ready
3. Only allow play when enough stems are buffered (at least the first 3-4 priority stems)

**Changes:**
- Add `bufferedCount` state tracking
- Add `onplay` callback to Howl instances to detect when audio is actually playable
- Create `isReadyToPlay` boolean that requires minimum buffer threshold
- Expose `isBuffering` and `bufferedProgress` for UI feedback

### Phase 2: Implement Staggered Stem Loading for High Stem Count Songs

**File: `src/hooks/useAudioPlayer.ts`**

For songs with 10+ stems, implement priority-based sequential loading:

1. Load stems in batches based on priority (Master/Coaching first, then Instrumental, then others)
2. Start playback after priority stems (first 3-4) are fully buffered
3. Continue loading remaining stems in background during playback

**Priority loading order:**
1. Master/Coaching stems (position 0-1)
2. Instrumental stem
3. Lead vocal stems  
4. Remaining harmony and other stems

### Phase 3: Add Playback Buffer Threshold

**File: `src/hooks/useAudioPlayer.ts`**

Before allowing playback, check Howler's internal state:

1. Verify duration is known (meaning metadata loaded)
2. Add a small delay (200-300ms) after all stems report "loaded" to allow initial buffering
3. For songs with 10+ stems, require higher buffer threshold before enabling play

### Phase 4: Update TrainingMode UI for Better Loading Feedback

**File: `src/pages/TrainingMode.tsx`**

1. Show more detailed loading progress (e.g., "Loading 5/14 tracks...")
2. Disable play button until `isReadyToPlay` is true (not just `isLoaded`)
3. Add visual indication when audio is buffering mid-playback
4. Show which stems are still loading during playback

### Phase 5: Increase Sync Tolerance for High Stem Count

**File: `src/hooks/useAudioPlayer.ts`**

The current tolerance logic already scales with stem count, but we should:

1. Increase tolerance for 14+ stems from 0.12s to 0.15s
2. Reduce drift correction frequency for high stem counts (from 1000ms to 1500ms)
3. Increase `SEEK_SYNC_DELAY_MS` dynamically based on stem count

---

## Technical Implementation Details

### useAudioPlayer.ts Changes

```text
1. Add new state:
   - bufferedStems: Set<string> - tracks which stems have buffered
   - isBuffering: boolean - true while waiting for buffer threshold
   - minimumBufferCount: number - calculated based on stem count

2. Modify Howl creation:
   - Add `onplay` callback to track buffer-ready state
   - Stagger loading for 10+ stem songs

3. Add new export:
   - isReadyToPlay: boolean
   - bufferingProgress: number (0-100)
   - bufferedStemCount: number

4. Increase sync tolerance:
   - 14+ stems: 0.15s tolerance, 1500ms correction interval
   - Increase SEEK_SYNC_DELAY_MS for high stem counts
```

### TrainingMode.tsx Changes

```text
1. Use `isReadyToPlay` instead of `isLoaded` for play button
2. Show "Buffering X/14 tracks..." during loading
3. Add subtle buffering indicator if audio stutters
4. Conditionally disable transport controls while buffering
```

### audioPreloadStore.ts Optimization

```text
1. For songs with 10+ stems, preload in priority order
2. Ensure priority stems (Master, Instrumental) finish first
3. Update batch size from 3 to 2 for high-stem songs to reduce bandwidth competition
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Add buffer tracking, staggered loading, readiness detection, increased tolerance |
| `src/pages/TrainingMode.tsx` | Update UI for detailed loading state, use `isReadyToPlay` |
| `src/stores/audioPreloadStore.ts` | Reduce concurrent requests for high-stem songs |

---

## Expected Improvements

| Issue | Before | After |
|-------|--------|-------|
| Choppy playback on Testify V2 | Frequent stuttering | Smooth playback after buffer wait |
| Play button timing | Available immediately | Available when audio ready |
| Loading feedback | "Loading 45%" | "Buffering 5/14 tracks..." |
| Sync tolerance (14 stems) | 0.12s | 0.15s |
| Drift correction frequency | Every 1000ms | Every 1500ms for 14+ stems |
| Concurrent network requests | 14 at once | 2-3 at once, staggered |

---

## Technical Considerations

1. **Howler.js HTML5 mode** - Uses streaming which requires adequate buffer before playback
2. **Mobile bandwidth** - More critical on mobile where bandwidth may be limited
3. **Priority loading** - Master and Instrumental must be ready first since they define the timing
4. **User feedback** - Clear indication that audio is preparing, not frozen
