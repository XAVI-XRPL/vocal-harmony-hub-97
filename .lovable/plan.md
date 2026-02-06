
# Fix: Training Player Stuck Loading

## Problem Analysis

When opening an exercise, the player appears stuck. The user sees the Training Mode UI with stems but audio doesn't play when tapping the Play button.

### Root Cause

After the previous fix to defer `AudioContext` creation to a user gesture (fixing mobile crashes), there are two issues:

1. **Missing Error Handling**: The `handlePlayPause` function doesn't catch errors from `initAudioEngine()`. If the AudioContext creation or resume fails, the function throws but the UI is left in a broken state with `hasStartedPlayback=true` but `mixdownReady=false`.

2. **Play Button Logic After Init**: After `await initAudioEngine()` completes, `engineTogglePlayPause()` is called. However, the `togglePlayPause` callback uses `isPlaying` from a stale closure (the value at render time, not after loading). This causes a potential state mismatch.

3. **No User Feedback**: When the user opens an exercise, there's no indication they need to tap Play to start loading. The old behavior auto-loaded on mount.

### Console Evidence

The logs show:
```
📋 Song prepared: testify-exercise (waiting for user gesture)
```

But NOT:
```
🎵 AudioContext created
📻 Mixdown-first loading strategy
```

This confirms `init()` is either not being called or failing silently.

---

## Solution

### Step 1: Add Error Handling to handlePlayPause

Wrap the async operations in try/catch and provide user feedback on failure.

```typescript
// src/pages/TrainingMode.tsx

const handlePlayPause = async () => {
  if (songHasRealAudio) {
    setHasStartedPlayback(true);
    try {
      await initAudioEngine();
      // After init, directly call play since we know we want to start
      webAudioEngine.play();
      useAudioStore.getState().play();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setHasStartedPlayback(false); // Reset to allow retry
      toast.error("Failed to load audio", {
        description: "Please try again",
      });
    }
  } else {
    storeTogglePlayPause();
  }
};
```

### Step 2: Simplify Play Logic After Init

The current flow calls `engineTogglePlayPause()` which uses a stale `isPlaying` value. Since we just initialized, we know:
- The engine is ready (`playbackState === 'ready'`)  
- We want to play (not pause)

So call `play()` directly instead of toggle.

### Step 3: Add Console Logs for Debugging

Add more logging in the `init()` function to help debug issues:

```typescript
// src/services/webAudioEngine.ts

async init(): Promise<void> {
  console.log('🎵 init() called');
  await this.ensureContextRunning();
  console.log('🎵 AudioContext running');
  
  if (this.isPrepared()) {
    console.log('🎵 Song is prepared, loading...');
    await this.loadSong();
  } else {
    console.log('🎵 Song not prepared, skipping load');
  }
}
```

### Step 4: Fix ensureContextRunning Error Handling

The `resume()` call might fail on some browsers. Add proper error handling:

```typescript
private async ensureContextRunning(): Promise<void> {
  this.ensureContextCreated();
  
  if (this.audioContext!.state === 'suspended') {
    try {
      await this.audioContext!.resume();
      console.log('🎵 AudioContext resumed');
    } catch (error) {
      console.error('Failed to resume AudioContext:', error);
      throw new Error('Cannot start audio. Please try again.');
    }
  }
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/TrainingMode.tsx` | Add try/catch to `handlePlayPause`, call `play()` directly after init |
| `src/services/webAudioEngine.ts` | Add debug logging to `init()`, add error handling to `ensureContextRunning()` |

---

## Implementation Details

### TrainingMode.tsx Changes

```typescript
// Replace the handlePlayPause function (around line 139)

const handlePlayPause = async () => {
  if (songHasRealAudio) {
    if (!mixdownReady) {
      // First play - need to initialize
      setHasStartedPlayback(true);
      try {
        await initAudioEngine();
        // Successfully initialized - start playback
        webAudioEngine.play();
        useAudioStore.getState().play();
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        setHasStartedPlayback(false);
        toast.error("Couldn't load audio", {
          description: "Please try again or check your connection",
        });
      }
    } else {
      // Already initialized - just toggle
      engineTogglePlayPause();
    }
  } else {
    storeTogglePlayPause();
  }
};
```

### webAudioEngine.ts Changes

```typescript
// Update init() method (around line 180)

async init(): Promise<void> {
  console.log('🎵 Initializing audio engine...');
  
  try {
    await this.ensureContextRunning();
  } catch (error) {
    console.error('🎵 Failed to start AudioContext:', error);
    throw error;
  }
  
  if (this.isPrepared()) {
    console.log('🎵 Loading prepared song...');
    await this.loadSong();
  } else {
    console.log('🎵 No song prepared, skipping load');
  }
  
  console.log('🎵 Audio engine initialized');
}

// Update ensureContextRunning() method (around line 168)

private async ensureContextRunning(): Promise<void> {
  this.ensureContextCreated();
  
  if (this.audioContext!.state === 'suspended') {
    try {
      await this.audioContext!.resume();
      console.log('🎵 AudioContext resumed (state:', this.audioContext!.state, ')');
    } catch (error) {
      console.error('🎵 AudioContext.resume() failed:', error);
      throw new Error('Audio playback blocked. Please tap the play button.');
    }
  } else {
    console.log('🎵 AudioContext already running (state:', this.audioContext!.state, ')');
  }
}
```

---

## Testing Checklist

After implementation:

1. **Desktop**: Open exercise → Tap Play → Audio should load and play
2. **Mobile Safari**: Open exercise → Tap Play → Audio should load and play (no crash)
3. **Mobile Chrome**: Same as Safari
4. **Error case**: Disable network → Tap Play → Should show error toast
5. **Retry**: After error, tap Play again → Should attempt to load again
6. **Console**: Verify new debug logs appear when tapping Play

---

## Why This Fixes the Issue

| Before | After |
|--------|-------|
| `initAudioEngine()` errors are uncaught | Errors caught and shown to user |
| UI stuck with `hasStartedPlayback=true` on error | State reset on error, allows retry |
| `engineTogglePlayPause()` uses stale `isPlaying` | Directly call `play()` after successful init |
| No logging to debug init issues | Comprehensive logging in init flow |
