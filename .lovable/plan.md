

# RVMT Mobile Performance Optimization

## Summary

Apply the highest-impact optimizations from the performance guide to prevent mobile browser crashes and improve load times. Focused on memory management, code splitting, and error resilience.

---

## Changes

### 1. Enhanced Audio Engine Cleanup (Memory Management)

**File: `src/services/webAudioEngine.ts`**

The current `cleanup()` method disconnects gain nodes and clears the stems Map, but does NOT:
- Null out `stem.buffer` (the decoded AudioBuffer -- ~40MB each)
- Close the AudioContext (keeps ~10MB alive)
- Cancel in-flight fetches

Update `cleanup()` to explicitly release AudioBuffer references, close the AudioContext, and reset all tracking state. Also add abort logic.

```typescript
cleanup(): void {
  this.stopAllSources();
  this.stopTimeTracking();
  this.releaseWakeLock();
  
  // Abort any in-flight fetches
  this.abortController?.abort();
  this.abortController = null;
  
  // Release AudioBuffer references (big memory win)
  this.stems.forEach(stem => {
    stem.buffer = null;
    stem.sourceNode?.disconnect();
    stem.sourceNode = null;
    stem.gainNode?.disconnect();
  });
  this.stems.clear();
  
  // Clear mixdown
  this.mixdownBuffer = null;
  // ... existing mixdown cleanup ...
  
  // Close AudioContext to fully release resources
  if (this.audioContext && this.audioContext.state !== 'closed') {
    this.audioContext.close();
    this.audioContext = null;
    this.masterGainNode = null;
  }
  
  // Reset tracking
  this.currentSongId = null;
  this.currentSongConfig = null;
  this.backgroundLoadPromise = null;
  this.stemGroupMap.clear();
  // ... reset state ...
}
```

**File: `src/pages/TrainingMode.tsx`**

Update the existing unmount cleanup (line 270-276) to call full `cleanup()` instead of just `pause()`:

```typescript
useEffect(() => {
  return () => {
    console.log("[TrainingMode] Cleanup - releasing audio memory");
    webAudioEngine.cleanup();
  };
}, []);
```

This ensures AudioBuffers (~120-400MB) are released when navigating away.

---

### 2. Lazy Route Loading (Bundle Size)

**File: `src/App.tsx`**

Convert heavy page imports to `React.lazy()` with `Suspense`. This splits the bundle so pages like TrainingMode, VocalHealth, StagePrep, and VocalRiderStore only load when navigated to.

```typescript
import { lazy, Suspense } from "react";

// Eagerly loaded (needed immediately)
import Home from "./pages/Home";
import Library from "./pages/Library";

// Lazy loaded (loaded on navigation)
const TrainingMode = lazy(() => import("./pages/TrainingMode"));
const VocalHealth = lazy(() => import("./pages/VocalHealth"));
const StagePrep = lazy(() => import("./pages/StagePrep"));
const VocalRiderStore = lazy(() => import("./pages/VocalRiderStore"));
const Hub = lazy(() => import("./pages/Hub"));
const Profile = lazy(() => import("./pages/Profile"));
const Progress = lazy(() => import("./pages/Progress"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Playlists = lazy(() => import("./pages/Playlists"));
const PlaylistDetail = lazy(() => import("./pages/PlaylistDetail"));
const SongDetail = lazy(() => import("./pages/SongDetail"));
```

Wrap routes in `Suspense` with a lightweight loading fallback (spinner).

---

### 3. Error Boundary (Crash Resilience)

**New file: `src/components/ErrorBoundary.tsx`**

Create a React error boundary component that catches render errors and shows a "Something went wrong / Reload" screen instead of a white screen crash.

Wrap the main app content in `App.tsx` with this boundary.

---

### 4. Lazy Image Loading

**File: `src/components/song/SongCard.tsx`**

Add `loading="lazy"` and `decoding="async"` to cover art images so they don't load until scrolled into view. This reduces initial page load memory.

---

## What This Achieves

| Optimization | Impact |
|-------------|--------|
| AudioBuffer cleanup on unmount | Frees ~120-400MB when leaving TrainingMode |
| AudioContext.close() | Releases system audio resources |
| Lazy route loading | Reduces initial JS bundle by ~40-60% |
| Error boundary | Prevents full white-screen crashes |
| Lazy image loading | Reduces initial memory by deferring off-screen images |

## Files Modified

| File | Change |
|------|--------|
| `src/services/webAudioEngine.ts` | Enhanced cleanup() with buffer nulling and context close |
| `src/pages/TrainingMode.tsx` | Call cleanup() instead of pause() on unmount |
| `src/App.tsx` | Lazy load routes with React.lazy + Suspense |
| `src/components/ErrorBoundary.tsx` | New error boundary component |
| `src/components/song/SongCard.tsx` | Add loading="lazy" to images |

