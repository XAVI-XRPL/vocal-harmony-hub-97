

# Fix: Audio Buffering State Not Updating for High Stem Count Songs

## Problem Identified During Testing

When testing "12. TESTIFY (VERSION 2)" (14 stems), I discovered that:

1. All 14 stems load successfully (confirmed in console logs)
2. The play button remains disabled
3. The UI shows "Buffering 0/14" indefinitely
4. The `isReadyToPlay` state never becomes `true`

## Root Cause

There is a **stale closure bug** in the buffer readiness timeout callback in `useAudioPlayer.ts`:

```text
// Line 398-403 - the timeout callback captures loadedCount at value 0
const readyTimeout = setTimeout(() => {
  if (!isReadyToPlay && loadedCount >= minRequiredBuffered) {
    // loadedCount is always 0 here (stale closure)!
    setIsReadyToPlay(true);
  }
}, 1500);
```

The `loadedCount` variable is captured in the closure when the timeout is created (value = 0). Even though it increments to 14 in the `onload` callbacks, the timeout callback still sees 0.

---

## Solution

Use a ref to track `loadedCount` instead of a local variable, so the timeout callback reads the current value.

### File: `src/hooks/useAudioPlayer.ts`

**Change 1**: Add a ref to track loaded count

```text
// Add near other refs (around line 96):
const loadedCountRef = useRef<number>(0);
```

**Change 2**: Update loadSong function to use the ref

```text
// In loadSong function, change:
let loadedCount = 0;

// To:
loadedCountRef.current = 0;

// And update all references from loadedCount to loadedCountRef.current:
// - In onload callback
// - In onloaderror callback  
// - In the timeout check
```

**Change 3**: Fix the timeout callback to read from ref

```text
// Change line 399 from:
if (!isReadyToPlay && loadedCount >= minRequiredBuffered) {

// To:
if (!isReadyToPlay && loadedCountRef.current >= minRequiredBuffered) {
```

---

## Additional Improvement: Ensure Buffering State Shows Real Progress

Currently `bufferedCount` stays at 0 because it only updates on `onplay` events. We should also update it when stems finish loading.

**Change 4**: Update buffered count on load (not just on play)

```text
// In onload callback, after incrementing loadedCount:
setBufferedCount(loadedCountRef.current);

// And check readiness immediately on load:
if (loadedCountRef.current >= minRequiredBuffered && !isReadyToPlay) {
  setIsReadyToPlay(true);
  setIsBuffering(false);
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Fix stale closure bug, update buffering state on load |

---

## Expected Result After Fix

| Before | After |
|--------|-------|
| "Buffering 0/14" shown indefinitely | "Buffering 4/14", "8/14", "14/14" progress shown |
| Play button never enables | Play button enables when buffer threshold met |
| Cannot play "12. TESTIFY (VERSION 2)" | Playback starts smoothly after buffering |

---

## Testing Steps After Implementation

1. Navigate to Library and select "12. TESTIFY (VERSION 2)"
2. Observe the buffering progress updating (should show 2/14, 4/14, etc.)
3. Once buffering reaches threshold (~4 stems), play button should enable
4. Press play and verify smooth playback without choppy audio

