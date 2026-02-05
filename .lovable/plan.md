

## Analysis Summary

### What I Found

**Testing Results:**
- Preview URL (`lovableproject.com`): Training Mode works correctly - mixdown loads, stems load in background, playback works, no crashes
- Console logs show successful audio loading: "Mixdown ready (353.1s)", "All stems loaded in background"
- Play/pause, stem controls, and UI all function properly

**Console Warnings (Non-Fatal):**
The following warnings appear but do NOT cause crashes:
```
Warning: Function components cannot be given refs.
Check the render method of `AppShell`.
```
This appears for:
- `AnimatePresence` children (page components)
- `MobileNav` component

**Root Cause of Original Crash:**
The "Maximum update depth exceeded" error was caused by the audio engine triggering React state updates during render, creating an infinite loop. This was previously fixed by:
1. Moving `currentTime`/`duration` syncing from render phase to `useEffect` hooks in `useAudioEngine.ts`
2. Using `subscribeOnChange` instead of `subscribe` for `useSyncExternalStore`

---

## Remaining Issues to Fix

### 1. Fix `forwardRef` Warnings in AppShell

**Problem:** `AnimatePresence` tries to pass refs to page components, but the page components don't support `forwardRef`.

**Solution:** Wrap page components in an intermediary `div` so refs attach to the wrapper, not the function component directly.

**File:** `src/components/layout/AppShell.tsx`

**Change:**
Replace the current pattern:
```tsx
<AnimatePresence mode="wait">
  <motion.div key={location.pathname} ...>
    {children}
  </motion.div>
</AnimatePresence>
```

The `motion.div` already handles the ref for AnimatePresence. The warnings likely come from other AnimatePresence usages (line 60-62 for MiniPlayer, line 64 for MobileNav).

For `MobileNav` (line 64):
```tsx
{!hideNav && <MobileNav />}
```
This is outside AnimatePresence, so shouldn't cause the warning. The issue is that AnimatePresence at lines 60-62 wraps `MiniPlayer` which IS a motion component.

Actually, looking more closely, the warnings come from React Router's component rendering through `AnimatePresence`. The solution is to ensure the motion.div properly intercepts the ref.

### 2. Add Cleanup on TrainingMode Unmount

**Problem:** Audio continues playing when navigating away from Training Mode.

**Solution:** Add a cleanup effect that stops playback when the component unmounts.

**File:** `src/pages/TrainingMode.tsx`

**Change:** Add a `useEffect` cleanup:
```tsx
useEffect(() => {
  return () => {
    // Stop audio when leaving Training Mode
    if (songHasRealAudio) {
      webAudioEngine.pause();
    }
  };
}, []);
```

### 3. Prevent Double Song Loading

**Problem:** Console logs show the song loading twice in some cases:
```
"Mixdown-first loading strategy" appears twice
"Song loaded: testify-exercise" appears twice
```

**Root Cause:** The `useAudioEngine` hook may be triggering song load twice due to React Strict Mode or dependency array issues.

**Solution:** Add a guard in the loading effect to prevent duplicate loads.

**File:** `src/hooks/useAudioEngine.ts`

**Change:** Improve the song loading effect to check if already loading.

---

## Implementation Plan

### Step 1: Fix AnimatePresence ref warnings in AppShell (optional, cosmetic)

The warnings don't cause crashes, but they clutter the console. We can wrap components passed to AnimatePresence in a container that properly handles refs.

```tsx
// No change needed - motion.div already handles refs
// The warnings may be from development mode only
```

### Step 2: Add unmount cleanup in TrainingMode

```tsx
// Add near other useEffects in TrainingMode.tsx
useEffect(() => {
  return () => {
    // Clean up audio when leaving Training Mode
    if (hasRealAudio) {
      webAudioEngine.stop();
    }
  };
}, [hasRealAudio]);
```

### Step 3: Prevent duplicate song loads

```tsx
// In useAudioEngine.ts, add loading guard
const isLoadingRef = useRef(false);

useEffect(() => {
  if (!currentSong || currentSong.id === prevSongIdRef.current) return;
  if (isLoadingRef.current) return; // Skip if already loading
  
  isLoadingRef.current = true;
  prevSongIdRef.current = currentSong.id;
  
  // ... existing loading logic ...
  
  webAudioEngine.loadSong(songConfig).finally(() => {
    isLoadingRef.current = false;
  });
}, [currentSong?.id]);
```

---

## Technical Notes

### Why the Original Crash Happened

The `useSyncExternalStore` hook in React requires:
1. `getSnapshot` to return a referentially stable value
2. `subscribe` to NOT call the listener immediately (or React thinks the store changed and re-renders, causing an infinite loop)

The fix was to use `subscribeOnChange` which doesn't call the listener on subscription, only on actual changes.

### Audio Engine Architecture

```text
User Action (Play) -> initAudioEngine() -> AudioContext.resume() -> webAudioEngine.play()
                                                                           |
                                                                           v
                                                            Creates AudioBufferSourceNodes
                                                                           |
                                                                           v
                                                            Starts time tracking (RAF)
                                                                           |
                                                                           v
                                                            Updates state -> notifyListeners
                                                                           |
                                                                           v
                                                            useSyncExternalStore picks up change
                                                                           |
                                                                           v
                                                            useEffect syncs to Zustand store
```

### Files to Modify

| File | Change |
|------|--------|
| `src/pages/TrainingMode.tsx` | Add unmount cleanup effect |
| `src/hooks/useAudioEngine.ts` | Add loading guard to prevent duplicates |

### Testing Checklist

After implementation, verify:
1. Navigate to Training Mode - no blank screen
2. Press Play - audio plays
3. Navigate away - audio stops
4. Re-enter Training Mode - fresh session starts
5. Check console - no "Maximum update depth" errors

