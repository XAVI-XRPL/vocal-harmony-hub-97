
# Fix: Play Button Disabled Before First Tap

## Problem Analysis

The Play button is **disabled** because of the check on line 754:
```tsx
disabled={songHasRealAudio && !isReadyToPlay}
```

When the song is only "prepared" (configuration stored, no audio loaded yet):
- `playbackState` = `'idle'`
- `mixdownReady` = `false`
- Therefore `isReadyToPlay` = `false`
- Button is disabled = **true**

This creates a deadlock: the user cannot tap Play to trigger `init()` because the button is disabled waiting for audio that will never load until Play is tapped.

## Root Cause

The deferred loading strategy introduced a new state: "prepared but not loaded". The button's disabled logic doesn't account for this state.

## Solution

Update the disabled logic to allow tapping Play when the song is prepared (idle) but has stems configured. The button should only be disabled when:
1. Audio is actively loading (after user initiated playback), OR
2. Something is genuinely wrong (no stems at all)

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/TrainingMode.tsx` | Update Play button disabled logic to allow click when song is prepared |
| `src/hooks/useAudioEngine.ts` | Add `isPrepared` flag to return value for clearer state tracking |

---

## Implementation Details

### 1. `src/hooks/useAudioEngine.ts`

Add a new `isPrepared` flag that indicates the song is configured and ready for initialization:

```typescript
// Add to interface (around line 27)
isPrepared: boolean;

// Add to hook (around line 133)
const isPrepared = engineState.playbackState === 'idle' && engineState.stemLoadProgress.length > 0;
```

### 2. `src/pages/TrainingMode.tsx`

Update the destructured return from `useAudioEngine` to include `isPrepared`, then fix the disabled logic:

```typescript
// Line 78-104: Add isPrepared to destructured values
const { 
  isLoaded, 
  loadingProgress, 
  seekTo, 
  hasRealAudio,
  isReadyToPlay,
  isBuffering,
  bufferedCount,
  totalStemCount,
  stemLoadProgress,
  init: initAudioEngine,
  audioMode,
  mixdownReady,
  mixdownProgress,
  allStemsReady,
  isPrepared,  // ADD THIS
  // ... rest
} = useAudioEngine();
```

Update the Play button disabled logic (around line 754):

```typescript
// OLD (broken):
disabled={songHasRealAudio && !isReadyToPlay}

// NEW (fixed):
// Allow click when prepared (idle with stems) or ready to play
// Only disable when actively loading and mixdown not ready yet
disabled={songHasRealAudio && hasStartedPlayback && !mixdownReady}
```

This means:
- **Before first tap**: `hasStartedPlayback=false` - Button enabled
- **After tap, while loading**: `hasStartedPlayback=true && !mixdownReady` - Button disabled
- **After mixdown ready**: `mixdownReady=true` - Button enabled

---

## Flow After Fix

```text
User navigates to /training/throwback-exercise
         ↓
useEffect fires → prepareSong() called
         ↓
playbackState = 'idle', stemLoadProgress.length > 0
isPrepared = true, isReadyToPlay = false
         ↓
Button disabled = songHasRealAudio && hasStartedPlayback && !mixdownReady
                = true && false && true
                = false  ← BUTTON ENABLED ✓
         ↓
User taps Play button
         ↓
handlePlayPause() called → setHasStartedPlayback(true)
         ↓
Button disabled = true && true && true = true ← LOADING STATE
         ↓
initAudioEngine() → loadSong() → mixdownReady = true
         ↓
Button disabled = true && true && false = false ← ENABLED AGAIN
```

---

## Alternative Simpler Fix

If we want a minimal change, we can just update the disabled condition directly without adding `isPrepared`:

```typescript
// Line 754: Change to only disable during active loading
disabled={songHasRealAudio && hasStartedPlayback && !mixdownReady}
```

This single line change fixes the issue without adding new state tracking.

---

## Testing Checklist

After implementation:

1. Navigate to exercise page - Play button should be **enabled** (gradient visible)
2. Tap Play - button should briefly disable, show loading overlay
3. After mixdown loads - button should enable, audio should play
4. Tap Pause - audio pauses, button shows Play icon
5. Tap Play again - audio resumes immediately (no loading)

---

## Summary

| Before | After |
|--------|-------|
| Button disabled when `!isReadyToPlay` | Button enabled when prepared |
| User cannot tap Play | User can tap Play to start loading |
| Deadlock - audio never loads | Audio loads on first tap |
