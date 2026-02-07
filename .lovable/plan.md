

## Debug and Optimize Mobile Audio Playback

### Current Assessment

After a thorough review of the entire audio pipeline (webAudioEngine, useAudioEngine hook, audioStore, audioPreloadStore, TrainingMode page, and all audio UI components), the architecture is solid. The mixdown-first loading, sequential decoding, lazy stem groups, and crossfade logic are well-implemented. However, there are several concrete optimizations to improve mobile playback smoothness and reduce unnecessary work.

---

### Issues Found and Proposed Fixes

#### 1. Duplicate state updates on every time tick (High Impact)

**Problem:** On every animation frame (~60fps), the engine calls `updateState({ currentTime })` which creates a new state object and notifies all listeners. The `useAudioEngine` hook then syncs this to `audioStore` via a `useEffect`. This means every frame triggers: engine state update -> React re-render -> useEffect -> Zustand store update -> another re-render.

**Fix:** Throttle the engine's time tracking to update only every ~3 frames (~50ms) instead of every frame. The current threshold in `useAudioEngine` (0.05s) already helps, but the engine itself should avoid creating new state objects at 60fps.

In `webAudioEngine.ts` `startTimeTracking()` (line ~1482):
- Add a frame counter to only call `updateState` every 3rd frame
- This cuts React re-renders during playback by ~66%

#### 2. `updateState` creates a new object every call (Medium Impact)

**Problem:** Every `updateState()` call does `this.state = { ...this.state, ...partial }`, which creates a new reference even if values haven't changed. Since `useSyncExternalStore` compares by reference, this triggers re-renders for unchanged state.

**Fix:** Add a shallow equality check in `updateState` -- skip notify if no values actually changed. This prevents unnecessary re-renders when, for example, the time-tracking frame fires but the time hasn't meaningfully changed.

#### 3. Play button pulsing ring runs infinitely with Framer Motion (Low-Medium Impact)

**Problem:** The play button has an infinite `animate` ring (lines 794-807 in TrainingMode.tsx) using Framer Motion's `scale` and `opacity` keyframes with `repeat: Infinity`. On mobile this continuously runs JS-driven animations even when the user isn't looking at it.

**Fix:** Replace with a CSS-only `@keyframes` animation (already done for waveform bars). This offloads animation to the GPU compositor thread.

#### 4. Loop indicator ring also runs infinite Framer Motion animation (Low Impact)

**Problem:** Same issue as above at lines 829-841 -- an infinite opacity animation on the loop indicator ring.

**Fix:** Replace with CSS animation class.

#### 5. Preload store uses `window.__preloadSongData` (Code Smell)

**Problem:** The `audioPreloadStore` stores song data on `window.__preloadSongData` to pass between queue/process calls. This is a global mutation pattern that can leak memory if songs pile up.

**Fix:** Store the song data directly in the Zustand store state instead of on `window`. Add a `pendingSongData: Map<string, Song>` field.

#### 6. `StemTrack` subscribes to full `stemStates` array (Medium Impact)

**Problem:** Each `StemTrack` subscribes to the entire `stemStates` array from the store (line 39). Any volume change on any stem causes all stem tracks to re-render.

**Fix:** Use a selector that only returns the specific stem's state:
```tsx
const stemState = useAudioStore(state => state.stemStates.find(s => s.stemId === stem.id));
```
And move the `hasSoloedStems` check to a separate, memoized selector.

#### 7. `generateMockWaveform(200)` called on every render (Low Impact)

**Problem:** In `TrainingMode.tsx` line 399, `generateMockWaveform(200)` is called outside of `useMemo`, meaning it regenerates the waveform array on every render.

**Fix:** Wrap in `useMemo` or move to a `useRef`.

#### 8. Missing `displayName` on `WaveformBar` (Trivial)

Not a performance issue, but good hygiene for React DevTools debugging.

---

### Implementation Plan

**File: `src/services/webAudioEngine.ts`**
- Throttle `startTimeTracking` to emit updates every ~50ms instead of every frame
- Add shallow equality check in `updateState` to skip notifications when values are unchanged

**File: `src/pages/TrainingMode.tsx`**
- Wrap `generateMockWaveform(200)` in `useMemo`
- Replace infinite Framer Motion play-button ring with CSS class
- Replace infinite Framer Motion loop indicator ring with CSS class

**File: `src/index.css`**
- Add CSS keyframes for play-button pulse ring and loop indicator glow

**File: `src/components/audio/StemTrack.tsx`**
- Use a targeted Zustand selector for the individual stem's state instead of the full array
- Add a separate `hasSoloedStems` selector

**File: `src/stores/audioPreloadStore.ts`**
- Replace `window.__preloadSongData` with an in-store `Map<string, Song>` field

---

### What's NOT Changing (Already Optimized)
- Sequential stem decoding with GC delays -- well-implemented
- Mixdown-first loading strategy -- working correctly
- `useSyncExternalStore` bridge -- correct pattern
- Waveform bars using CSS-only animations -- already GPU-optimized
- `StemGroupCard` and `WaveformBar` already memoized
- Lazy stem group loading -- working correctly
- Wake Lock and Media Session APIs -- properly implemented
- Cleanup on unmount -- comprehensive

