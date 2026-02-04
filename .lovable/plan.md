

# Desktop Splash Screen & Track Mute Buttons

## Overview

Two improvements to enhance the user experience:
1. Adjust the splash screen video scaling for desktop so the entire video is visible
2. Ensure mute controls are prominently visible on audio tracks

---

## Issue 1: Splash Screen Desktop Sizing

### Current Behavior

The splash video uses `object-cover` which crops the video to fill the screen. On mobile (portrait), `object-top` keeps the important content visible. However, on desktop (landscape), this crops out portions of the video.

### Solution

Use responsive object-fit classes:
- **Mobile** (`< md`): Keep `object-cover object-top` to fill the screen and show the important top portion
- **Desktop** (`≥ md`): Switch to `object-contain` to show the entire video without cropping, with a black letterbox if needed

### Implementation

**File: `src/pages/Splash.tsx`**

Update the video element's className:

```text
Current:  "object-cover object-top"
New:      "object-cover object-top md:object-contain"
```

This ensures:
- Mobile: Full-bleed cinematic video (current behavior preserved)
- Desktop: Entire video visible, centered with optional letterboxing

---

## Issue 2: Track Mute Buttons

### Current State

Looking at the code, mute buttons already exist on each `StemTrack`:
- Each track has a Mute button (toggles between `Volume2` and `VolumeX` icons)
- Each track has a Solo button ("S" toggle)
- There's a volume slider per track

However, there's **no Master Mute** button for quickly muting all tracks at once.

### Solution

Add a **Master Mute** toggle button to the Master waveform section in TrainingMode. This will allow users to quickly mute/unmute all stems with one tap.

### Implementation

**File: `src/pages/TrainingMode.tsx`**

Add a master mute toggle button in the Master header row (lines 245-276):

| Addition | Description |
|----------|-------------|
| Master Mute Button | IconButton with `VolumeX`/`Volume2` that toggles all stems mute state |
| Visual Feedback | Button highlights when all tracks are muted |

**File: `src/stores/audioStore.ts`**

Add a helper action to mute/unmute all stems:

| Function | Purpose |
|----------|---------|
| `muteAllStems()` | Set isMuted=true on all stems |
| `unmuteAllStems()` | Set isMuted=false on all stems |
| `toggleMasterMute()` | Toggle between mute all / unmute all |

---

## Summary of Changes

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Splash.tsx` | Add responsive `md:object-contain` to video element |
| `src/pages/TrainingMode.tsx` | Add Master Mute button to Master header section |
| `src/stores/audioStore.ts` | Add `toggleMasterMute()` action |

### Expected Result

1. **Splash Screen**: On desktop, the entire video is visible (no cropping). On mobile, it continues to fill the screen with top-aligned content.

2. **Master Mute**: Users can quickly mute all tracks with a single button tap on the Master section, in addition to the existing per-track mute controls.

---

## Technical Details

### Splash Video Responsive Classes

```tsx
// Before
className="absolute inset-0 w-full h-full object-cover object-top"

// After  
className="absolute inset-0 w-full h-full object-cover object-top md:object-contain"
```

### Master Mute Store Action

```typescript
toggleMasterMute: () =>
  set((state) => {
    const allMuted = state.stemStates.every(s => s.isMuted);
    return {
      stemStates: state.stemStates.map(s => ({
        ...s,
        isMuted: !allMuted
      }))
    };
  }),
```

### Master Mute Button (TrainingMode)

Add next to the volume indicator in the Master section:

```tsx
<motion.button
  whileTap={{ scale: 0.9 }}
  onClick={toggleMasterMute}
  className={cn(
    "w-8 h-8 rounded-lg border flex items-center justify-center",
    allMuted
      ? "bg-destructive/30 border-destructive/60"
      : "bg-glass border-glass-border hover:border-glass-border-hover"
  )}
>
  {allMuted ? (
    <VolumeX className="w-4 h-4 text-destructive" />
  ) : (
    <Volume2 className="w-4 h-4 text-muted-foreground" />
  )}
</motion.button>
```

