

# Enhance Studio Background with Reduced Opacity and Subtle Animation

## Overview

Reduce the dark overlay opacity to let more of the studio image show through, and add a subtle slow zoom animation to create depth and visual interest.

---

## Current State

The `StudioBackground` component has:
- Dark overlay at `bg-background/60` (60% opacity)
- Gradient overlay from `from-background/40` to `to-background/80`
- Static image with no animation

---

## Changes

### 1. Reduce Overlay Opacity

**File: `src/components/layout/StudioBackground.tsx`**

| Element | Current | New |
|---------|---------|-----|
| Dark overlay | `bg-background/60` | `bg-background/40` |
| Top gradient | `from-background/40` | `from-background/30` |
| Bottom gradient | `to-background/80` | `to-background/60` |

This will make the studio image more visible while still maintaining readability for glass cards.

### 2. Add Slow Zoom Animation

**File: `tailwind.config.ts`**

Add a new keyframe animation for subtle zoom effect:

```typescript
keyframes: {
  "slow-zoom": {
    "0%": { transform: "scale(1)" },
    "100%": { transform: "scale(1.1)" },
  },
}

animation: {
  "slow-zoom": "slow-zoom 30s ease-in-out infinite alternate",
}
```

This creates a very slow, subtle zoom in and out (scale 1.0 to 1.1 over 30 seconds) that loops infinitely, giving the background a sense of depth without being distracting.

### 3. Apply Animation to Background Image

**File: `src/components/layout/StudioBackground.tsx`**

Add the `animate-slow-zoom` class to the image element:

```tsx
<img
  src={studioBackground}
  alt=""
  className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
/>
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `tailwind.config.ts` | Add `slow-zoom` keyframe and animation |
| `src/components/layout/StudioBackground.tsx` | Reduce overlay opacity values, add zoom animation to image |

---

## Visual Result

- More of the studio atmosphere will be visible (microphone, acoustic panels, blue lighting)
- The image will slowly, subtly zoom in and out creating a cinematic depth effect
- Glass cards will still be readable but with a richer background presence
- Animation is slow enough (30s cycle) to not be distracting during training sessions

