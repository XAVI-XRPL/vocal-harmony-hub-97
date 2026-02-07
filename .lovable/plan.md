

## Fix: Mobile Home Page Content Shifting Down

### Root Cause
The `PullToRefresh` component (used on the Home page) wraps all content in a `motion.div` with a spring-based `translateY` animation. On mobile devices, even very small touch movements (a few pixels) register as a "pull," causing the spring animation to oscillate and shift the entire page content downward. The spring's natural overshoot makes this worse -- the content bounces before settling.

### What's Changing

**File: `src/components/ui/pull-to-refresh.tsx`**
- Add a minimum pull distance (e.g., 10px) before applying any visual offset -- eliminates jitter from casual scrolling/tapping
- Switch the content offset animation from `spring` to `tween` to prevent overshoot/bouncing when releasing

**File: `src/hooks/usePullToRefresh.ts`**
- Add a dead zone: ignore pull distances under 10px so normal scroll gestures don't trigger the pull indicator
- Reset `startY` when the user scrolls sideways or the pull direction reverses

### Technical Details

In `pull-to-refresh.tsx` (line 57-60), change:
```tsx
// Before
<motion.div
  animate={{ y: pullDistance > 0 ? pullDistance : 0 }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
>

// After
<motion.div
  animate={{ y: pullDistance > 10 ? pullDistance : 0 }}
  transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
>
```

In `usePullToRefresh.ts` (line 27-31), add dead zone:
```tsx
// Before
if (diff > 0) {
  const resistance = 0.4;
  const adjustedDiff = Math.pow(diff, resistance) * 4;
  setPullDistance(Math.min(adjustedDiff, threshold * 1.5));
}

// After
if (diff > 10) {
  const resistance = 0.4;
  const adjustedDiff = Math.pow(diff - 10, resistance) * 4;
  setPullDistance(Math.min(adjustedDiff, threshold * 1.5));
} else {
  setPullDistance(0);
}
```

Also update the pull indicator visibility threshold in `pull-to-refresh.tsx` (line 30) to only show when `pullDistance > 10` instead of `pullDistance > 0`.

No other files need changes.

