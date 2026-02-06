

# Stacking Glass Cards for Library Page + Testify V2 Cover

## Overview

Adapt the GSAP stacking glass card scroll effect for the Library page exercise cards, and add the Testify V2 cover image once uploaded.

**Important:** The Testify V2 cover image was not attached to this message. Please upload it in your next message so we can add it.

## Analysis of the GSAP Component

The reference component creates a vertical scroll experience where cards:
- Are `position: sticky` so they stack as you scroll
- Scale down slightly as new cards scroll over them (creating depth)
- Have glass-morphism effects (blur, reflections, shine)
- Each card occupies `100vh` of scroll height

### Adaptation Decisions

| Aspect | Reference | Our Adaptation |
|--------|-----------|----------------|
| Library | GSAP + ScrollTrigger (~45KB) | Framer Motion (already installed) |
| Card height | 100vh per card | ~85vh on mobile, smaller on desktop |
| Content | Empty glass panels | Exercise SongCards with cover art, title, metadata |
| Glass effects | Inline styles | Reuse existing `glass-card` CSS classes |
| Scale animation | GSAP ScrollTrigger | Framer Motion `useScroll` + `useTransform` |

**Why Framer Motion instead of GSAP:** We just completed a mobile performance optimization pass. Adding GSAP + ScrollTrigger (~45KB gzipped) would undo some of those bundle size gains. Framer Motion is already installed and has `useScroll`/`useTransform` hooks that can achieve the same sticky-stacking effect with zero additional bundle cost.

## Changes

### 1. New Component: `StackedSongCards`

**File: `src/components/song/StackedSongCards.tsx`**

A new component that renders exercise cards in a vertical stacking scroll layout:

- Each card is wrapped in a sticky container
- Uses `useScroll` + `useTransform` from Framer Motion to scale cards down as the next card scrolls over
- Each card shows the exercise cover art as a full-bleed background image
- Glass overlay with song title, artist, difficulty, duration, stem count
- Lock overlay for premium songs (reuses existing `isLocked` logic)
- Tap navigates to training or subscription page
- Cards offset vertically by `index * 20px` to create the stacking peek effect

```text
Scroll layout (conceptual):

+---------------------------+
|  [Card 1: TESTIFY]        |  <-- sticky, scales to 0.95 as card 2 arrives
|  Full cover art bg         |
|  Title + metadata overlay  |
+---------------------------+
         |
+---------------------------+
|  [Card 2: THROWBACK]      |  <-- sticky, scales to 0.95 as card 3 arrives
|  Full cover art bg         |
|  Title + metadata overlay  |
+---------------------------+
         |
+---------------------------+
|  [Card 3: DONT LEAVE]     |
+---------------------------+
         |
+---------------------------+
|  [Card 4: TESTIFY V2]     |  <-- Lock overlay visible
|  "Unlock with Premium"     |
+---------------------------+
```

### 2. Update Library Page

**File: `src/pages/Library.tsx`**

Replace the current grid layout (`grid grid-cols-1 sm:grid-cols-2`) with the new `StackedSongCards` component for the main song list. The search bar and filters remain unchanged at the top.

- When filters are active or search returns results, fall back to the existing grid layout (stacking makes less sense for filtered subsets)
- When showing the full unfiltered library, use the stacking scroll layout

### 3. Glass Card Styling

Each stacked card will feature:
- Full-bleed cover art as background
- Gradient overlay from bottom (for text readability)
- Glass reflection shine at top (thin white gradient line)
- Existing `backdrop-blur` and glass border effects
- Scale transition: `1.0` to `0.93` as next card scrolls over
- Border radius `24px` matching the reference

### 4. Testify V2 Cover Image

**Pending upload** -- once you provide the image, it will be:
- Copied to `public/images/exercises/testify-v2-cover.png`
- Database updated: `UPDATE songs SET cover_art = '/images/exercises/testify-v2-cover.png' WHERE id = 'testify-v2'`

## Files

| File | Action |
|------|--------|
| `src/components/song/StackedSongCards.tsx` | New -- stacking scroll card component |
| `src/pages/Library.tsx` | Modified -- use StackedSongCards for unfiltered view |
| `public/images/exercises/testify-v2-cover.png` | Pending upload |
| Database | Pending -- update testify-v2 cover_art |

## No New Dependencies

All animations use Framer Motion's `useScroll`, `useTransform`, and `motion.div` -- already installed. No GSAP needed.

