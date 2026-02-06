
# Fix Library Card Scrolling on Mobile

## Problem
The stacked cards on the Library page feel "stuck" when scrolling on mobile because the scroll containers (`h-[55vh]`) are too short. This means the browser runs out of scrollable space quickly, and cards pile up before the user can naturally scroll through them. The tight `16px` per-card offset compounds this.

## Changes

**File: `src/components/song/StackedSongCards.tsx`**

1. **Increase scroll container height** from `h-[55vh] md:h-[50vh]` to `h-[75vh] md:h-[65vh]` -- gives each card enough scroll runway so the transition between cards feels smooth and natural rather than jumpy.

2. **Increase per-card top offset** from `16px` to `24px` -- provides a slightly bigger visible "peek" of stacked cards behind the current one, making it clearer there are more cards to scroll to.

3. **Increase bottom spacer** from `h-[10vh]` to `h-[25vh]` -- ensures the last card has enough room to fully display and doesn't get cut off at the bottom of the page.

4. **Reduce scale intensity** from `0.05` to `0.04` per card -- the more aggressive scaling was making deeply stacked cards shrink too much, contributing to the cramped feel.

## Technical Details

| Property | Current | New |
|----------|---------|-----|
| Container height (mobile) | `55vh` | `75vh` |
| Container height (desktop) | `50vh` | `65vh` |
| Per-card top offset | `16px` | `24px` |
| Bottom spacer | `10vh` | `25vh` |
| Scale factor per card | `0.05` | `0.04` |

These values give the sticky-scroll mechanic the breathing room it needs. Each card gets ~75% of the viewport to scroll through before the next one starts stacking, which produces a smooth, natural card-by-card reveal.
