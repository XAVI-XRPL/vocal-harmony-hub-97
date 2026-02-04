
# Add Records Wall Background to Playlists Page

## Overview

Add the uploaded gold and platinum records wall image as a cinematic background specifically for the Playlists page, creating a prestigious "trophy room" atmosphere that fits perfectly with the concept of showcasing a user's curated playlist collection.

---

## Implementation

### 1. Copy the Image to Assets

Copy the uploaded image to the project assets folder for proper bundling and optimization.

**Action:** Copy `user-uploads://image-11.png` to `src/assets/records-wall-background.png`

---

### 2. Create RecordsWallBackground Component

**New File: `src/components/layout/RecordsWallBackground.tsx`**

Create a dedicated background component following the same pattern as `StudioBackground`:

| Element | Value | Purpose |
|---------|-------|---------|
| Image | `records-wall-background.png` | The gold/platinum records wall |
| Animation | `animate-slow-zoom` | Subtle 30s zoom for cinematic depth |
| Dark overlay | `bg-background/40` | Ensure glass cards remain readable |
| Gradient | `from-background/30` to `to-background/60` | Smooth color blending at edges |

```tsx
import recordsWallBackground from "@/assets/records-wall-background.png";

export function RecordsWallBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Records wall image with slow zoom animation */}
      <img
        src={recordsWallBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
      />

      {/* Dark overlay for card readability */}
      <div className="absolute inset-0 bg-background/40" />

      {/* Gradient overlay for color blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />
    </div>
  );
}
```

---

### 3. Add Background to Playlists Page

**File: `src/pages/Playlists.tsx`**

Import and render the new background component at the top of the page:

```tsx
import { RecordsWallBackground } from "@/components/layout/RecordsWallBackground";

// Inside the component, render before other content:
return (
  <>
    <RecordsWallBackground />
    <motion.div ...>
      {/* existing content */}
    </motion.div>
  </>
);
```

**Note:** The RecordsWallBackground uses `fixed` positioning with `-z-10`, so it will layer behind the content but above the global StadiumBackground, creating a page-specific atmosphere.

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/assets/records-wall-background.png` | Copy from user upload |
| `src/components/layout/RecordsWallBackground.tsx` | Create new component |
| `src/pages/Playlists.tsx` | Import and add background |

---

## Visual Result

The Playlists page will feature a prestigious, cinematic backdrop of gold and platinum record awards:

- The dark blue wall with spotlights creates an elegant, professional atmosphere
- The gold and silver records reinforce the theme of music achievement
- The slow zoom animation adds subtle depth and movement
- Dark overlays ensure all glass cards and text remain readable
- Creates a distinct visual identity for the Playlists section vs other pages
