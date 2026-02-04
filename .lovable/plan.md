

# Add Studio Background to Training Pages

## Overview

Add the uploaded studio image (professional vocal recording studio with blue tones) as the background for all training mode pages, with adjusted opacity so the glass UI cards sit cleanly on top of it.

---

## Current State

The `TrainingMode.tsx` page uses a solid `bg-background` color with no background image. The other pages use the `StadiumBackground` component with animated particles and gradient effects.

---

## Implementation Approach

### 1. Copy Image to Project

Copy the uploaded studio image to the project assets folder:

```
user-uploads://image-10.png → src/assets/studio-background.png
```

### 2. Create a Dedicated Studio Background Component

**New File: `src/components/layout/StudioBackground.tsx`**

Create a dedicated background component for training pages that:
- Displays the studio image as a full-screen background
- Applies a dark overlay with adjustable opacity (around 40-50%) to ensure glass cards are readable
- Includes a subtle gradient overlay to blend the image with the app's color scheme
- Uses `object-cover` to ensure the image scales properly on all screen sizes

| Property | Value |
|----------|-------|
| Position | Fixed, full viewport coverage |
| Image fit | `object-cover` (fills container, crops if needed) |
| Overlay opacity | ~50% dark overlay for card readability |
| Z-index | `-10` (behind all content) |

### 3. Update Training Mode Page

**File: `src/pages/TrainingMode.tsx`**

| Change | Details |
|--------|---------|
| Import | Add import for `StudioBackground` component |
| Add component | Place `<StudioBackground />` at the start of the container |
| Adjust styling | Make container background transparent to show the studio image |

---

## Technical Implementation

### StudioBackground Component Structure

```tsx
// Conceptual structure
<div className="fixed inset-0 -z-10 overflow-hidden">
  {/* Studio image */}
  <img 
    src={studioBackground}
    className="absolute inset-0 w-full h-full object-cover"
  />
  
  {/* Dark overlay for card readability */}
  <div className="absolute inset-0 bg-background/60" />
  
  {/* Optional: gradient overlay for color blending */}
  <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
</div>
```

### Opacity Adjustments

The overlay opacity values are chosen to:
- Keep the studio atmosphere visible (you can see the microphone, acoustic panels, couch)
- Ensure glass cards with `backdrop-blur` remain readable
- Maintain sufficient contrast for text and controls

| Element | Opacity |
|---------|---------|
| Main dark overlay | 50-60% |
| Top gradient fade | 40% |
| Bottom gradient fade | 80% (fades to solid for transport controls) |

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/assets/studio-background.png` | Copy from user upload |
| `src/components/layout/StudioBackground.tsx` | Create new component |
| `src/pages/TrainingMode.tsx` | Add StudioBackground, adjust container styling |

---

## Visual Result

- The studio atmosphere (microphone, acoustic panels, music stand, blue ambient lighting) will be visible behind the training interface
- Glass cards will have a "frosted" effect over the studio image
- The professional recording studio vibe will enhance the training experience
- Works for all songs in training mode (Testify Exercise, Throwback Exercise, etc.)

