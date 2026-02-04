
# Performance and Reset Button Fixes for Training Mode

## Overview
Fix the waveform animation freeze when skipping in "3. DONT LEAVE EXERCISE" (12 stems) and ensure the Reset button properly resets the song to the beginning across all songs.

## Root Cause Analysis

### Problem 1: Waveform Animation Freeze
With 12 stems, the player renders:
- 12 StemTrack components, each with a WaveformDisplay
- Each WaveformDisplay has ~80 animated bars (top + bottom for mirrored view)
- Total: **1,920 individually animated elements** with `repeat: Infinity`

Framer Motion's continuous opacity animations on this many elements overwhelms the browser's animation thread, causing stuttering when the audio player is also processing seeks/syncs.

### Problem 2: Reset Button Not Working
The `resetMixer` function in audioStore only resets stem states (volume/mute/solo). It does NOT:
- Reset playback position to 0
- Clear loop settings
- Reset playback rate

### Problem 3: Ref Warning (Minor)
Components `WaveformDisplay` and `StudioBackground` receive refs but aren't wrapped with `forwardRef`.

---

## Technical Implementation

### File 1: `src/components/audio/WaveformDisplay.tsx`

**Changes:**
1. Add `React.forwardRef` wrapper to fix ref warning
2. Remove continuous `repeat: Infinity` opacity animations from individual bars
3. Use CSS animations instead of framer-motion for the pulse effect (much lighter)
4. Add `will-change: transform` CSS hint for GPU acceleration
5. Memoize the bar rendering to prevent re-renders on time updates

**Key optimization:**
```typescript
// Replace framer-motion infinite animations with CSS classes
className={cn(
  "w-full rounded-sm",
  isPlaying && isPlayed && "animate-bar-pulse"
)}
```

### File 2: `src/stores/audioStore.ts`

**Changes:**
Add a comprehensive `resetAll` function that:
- Resets playback position to 0
- Clears loop settings
- Resets playback rate to 1
- Resets all stem states

Rename current `resetMixer` behavior or update it to be more complete.

### File 3: `src/pages/TrainingMode.tsx`

**Changes:**
1. Update Reset button to call the new comprehensive reset function
2. Also trigger `seekTo(0)` through the audio player hook to sync Howler instances

### File 4: `src/components/layout/StudioBackground.tsx`

**Changes:**
Wrap with `React.forwardRef` to fix the ref warning.

### File 5: `src/index.css` (optional)

**Changes:**
Add lightweight CSS animation for bar pulse:
```css
@keyframes bar-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
.animate-bar-pulse {
  animation: bar-pulse 1.5s ease-in-out infinite;
}
```

---

## Performance Impact

| Metric | Before | After |
|--------|--------|-------|
| Animated elements | 1,920 | 0 (CSS handles it) |
| Re-renders per frame | High | Minimal |
| GPU memory | High | Low |

---

## Expected Results
1. Smooth waveform animations even with 12 stems
2. No freeze when skipping or seeking
3. Reset button works consistently: returns to 0:00, clears loops, resets tempo
4. No more console warnings about refs
