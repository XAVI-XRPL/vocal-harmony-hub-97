
# Fix Stacking Cards on Mobile

## Root Cause

The sticky-stacking effect is completely broken on mobile because of `overflow: hidden` on the AppShell root container (line 34 of `AppShell.tsx`). CSS `position: sticky` does not work inside any ancestor with `overflow: hidden` or `overflow: auto` -- the browser ignores the sticky positioning entirely.

## Changes

### 1. Fix overflow in AppShell (Critical Fix)

**File: `src/components/layout/AppShell.tsx`**

Change the mobile root container from `overflow-hidden` to `overflow-x-hidden` so vertical scroll is unrestricted (required for sticky) while still clipping horizontal overflow from the stadium background effects.

```
Line 34: "min-h-screen bg-background relative overflow-hidden"
      ->  "min-h-screen bg-background relative overflow-x-hidden"
```

Also apply the same fix to the desktop layout on line 72.

### 2. Tune card dimensions for mobile

**File: `src/components/song/StackedSongCards.tsx`**

- Reduce container height from `h-[85vh]` to `h-[70vh]` on mobile so cards are closer together and the stacking is more visible
- Reduce the top offset calculation so cards peek more tightly
- Adjust aspect ratio for better mobile proportions

### 3. Fix forwardRef warning

**File: `src/components/song/StackedSongCards.tsx`**

The `StackedCard` function component receives a ref from the parent map. Ensure the component structure doesn't trigger the forwardRef warning by keeping the ref internal to the component (it already is -- this warning may be from how Framer Motion interacts with the component tree; we'll verify after the overflow fix).

## Files Modified

| File | Change |
|------|--------|
| `src/components/layout/AppShell.tsx` | `overflow-hidden` to `overflow-x-hidden` on both mobile and desktop root containers |
| `src/components/song/StackedSongCards.tsx` | Adjusted card heights and spacing for mobile |
