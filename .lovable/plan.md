
# Splash Screen Video & Performance Optimization Plan

## Problem Analysis

### Splash Screen Video Not Auto-Playing on Mobile
The current splash screen has a fundamental issue with mobile video autoplay. Mobile browsers (especially iOS Safari) have strict policies:
- Videos must have `muted` and `playsinline` attributes (already present)
- Videos require a user gesture to play in many contexts
- Large video files may not buffer fast enough before the timeout triggers the transition

**Current Issues Found:**
1. The splash uses fixed timers (2.5s exit, 3.1s complete) regardless of whether the video actually loaded/played
2. No fallback handling if video fails to play
3. No detection of actual video playback status
4. Video may still be buffering when the transition starts

### Performance Bottlenecks Identified

1. **Heavy Background Animations** - `StadiumBackground.tsx` renders 25+ animated particles with continuous Framer Motion animations on every page
2. **Unoptimized Images** - Large PNG backgrounds loaded without lazy loading or srcset
3. **No Video Preloading** - Splash video loads only when component mounts
4. **Waveform Generation** - Mock waveform data (200 points) generated for every stem on every render
5. **React Query Stale Time** - Currently 5 minutes, could be increased for static content
6. **Redundant Preload Hooks** - Both Home and ContinuePractice call `useAutoPreload` for the same songs

---

## Implementation Plan

### Phase 1: Fix Splash Screen Video Playback

**1.1 Add Robust Video Playback Detection**
- Listen for `canplay`, `playing`, and `error` events
- Detect when video actually starts playing vs when it fails
- Track video current time to ensure playback is progressing

**1.2 Implement Smart Timing**
- Wait for video to actually play before starting the exit timer
- If video fails to play within 1 second, use the static poster image
- Sync the progress bar with actual video duration or fallback timer

**1.3 Add User Interaction Fallback**
- If video cannot autoplay, show a tap-to-play overlay on mobile
- Alternatively, gracefully fall back to image-based splash with smooth animation

**1.4 Smooth Transition to Onboarding**
- Ensure fade-out completes before onboarding mounts
- Add `will-change: opacity` for GPU-accelerated transitions

### Phase 2: Performance Optimizations

**2.1 Optimize StadiumBackground**
- Reduce particle count from 25 to 12 on mobile
- Use CSS animations instead of Framer Motion for particles (reduces JS overhead)
- Add `will-change: transform` to animated elements
- Implement `useDeferredValue` or conditional rendering for particles

**2.2 Image Optimization**
- Add `loading="lazy"` to non-critical images
- Use `fetchpriority="high"` for critical images (stadium background on Home)
- Add image preloading in index.html for critical assets

**2.3 Reduce Waveform Generation Overhead**
- Memoize waveform generation with `useMemo` at the song level
- Generate waveforms once and cache in memory
- Consider moving to a separate worker for large stem counts

**2.4 Optimize React Query Caching**
- Increase staleTime to 30 minutes for songs (they rarely change)
- Add `gcTime` (garbage collection) configuration
- Prefetch songs data during splash screen

**2.5 Fix Duplicate Preloading**
- Remove redundant `useAutoPreload` call from ContinuePractice
- Centralize preloading logic in the Library/Home parent components

**2.6 Add Critical Asset Preloading**
- Preload splash video in index.html
- Add DNS prefetch for Supabase
- Preload key fonts if any are custom loaded

---

## Technical Implementation Details

### Splash Screen Changes (src/pages/Splash.tsx)

```text
Key modifications:
- Add videoRef with play state tracking
- Add `onCanPlay`, `onPlaying`, `onError`, `onEnded` handlers
- Replace fixed timers with video-event-driven timing
- Add fallback for autoplay failure with graceful image-only mode
- Track `hasVideoStarted` and `videoError` states
- Only start exit timer after video confirms playback or after 1.5s timeout
```

### StadiumBackground Optimizations (src/components/layout/StadiumBackground.tsx)

```text
Key modifications:
- Detect mobile with `useIsMobile()` hook
- Reduce particles to 10-12 on mobile, keep 20-25 on desktop
- Convert particle animations from Framer Motion to CSS keyframes
- Add `will-change: transform, opacity` to animated layers
- Consider using `requestAnimationFrame` for smoother performance
```

### Index.html Preloading

```text
Add to <head>:
- <link rel="preload" href="/video/RVMTvideo.mp4" as="video" type="video/mp4">
- <link rel="preconnect" href="https://rgmirxeyzrtowutkhizu.supabase.co">
- <link rel="dns-prefetch" href="https://rgmirxeyzrtowutkhizu.supabase.co">
```

### React Query Optimization (src/hooks/useSongs.ts)

```text
Increase caching:
- staleTime: 30 * 60 * 1000 (30 minutes)
- gcTime: 60 * 60 * 1000 (1 hour)
```

---

## Expected Improvements

| Area | Before | After |
|------|--------|-------|
| Splash video on mobile | Often fails silently | Reliable playback with fallback |
| Transition smoothness | Abrupt, timer-based | Video-synced with graceful fade |
| Background CPU usage | High (25 animated particles) | Reduced 40-50% on mobile |
| Initial data load | Blocks on API | Prefetched during splash |
| Image loading | All at once | Lazy loaded, prioritized |
| Song cache lifetime | 5 minutes | 30 minutes |

---

## Files to Modify

1. `src/pages/Splash.tsx` - Complete rewrite of video handling logic
2. `src/components/layout/StadiumBackground.tsx` - Optimize animations
3. `index.html` - Add preload/prefetch hints
4. `src/hooks/useSongs.ts` - Increase cache times
5. `src/components/home/ContinuePractice.tsx` - Remove duplicate preload call
6. `src/index.css` - Add CSS keyframe animations for particles

