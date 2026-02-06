
# Tighten Stacking Card Spacing

## Problem
The cards have too much vertical space between them (`h-[80vh]` container height and `32px` per-card offset), so they don't feel like they're stacking tightly on scroll.

## Changes

**File: `src/components/song/StackedSongCards.tsx`**

1. **Reduce container height** from `h-[80vh] md:h-[70vh]` to `h-[55vh] md:h-[50vh]` -- this controls how much you scroll before the next card starts covering the current one. Lower = tighter stacking.

2. **Reduce per-card top offset** from `index * 32px` to `index * 16px` -- this controls the visible "peek" of stacked cards behind the front card. Smaller = cards sit nearly on top of each other.

3. **Reduce bottom spacer** from `h-[20vh]` to `h-[10vh]` to match the tighter layout.

## Result
Cards will stack on top of each other much more quickly as you scroll, creating the tight overlapping deck effect.
