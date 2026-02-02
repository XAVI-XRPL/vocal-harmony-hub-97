

# Video Splash Screen Upgrade

## Overview

Replace the static RMVT image with the uploaded video file to create a dynamic, cinema-quality splash intro. The video will play automatically, muted, filling the screen with the same premium dark aesthetic and smooth fade transitions.

---

## Visual Concept

```text
+----------------------------------+
|                                  |
|  [Full-screen RMVT VIDEO]        |
|  - Stadium lights animation      |
|  - "RMVT" LED text glowing       |
|  - Dynamic crowd movement        |
|  - Vocal coach motion            |
|                                  |
|  Dark overlay gradients          |
|                                  |
|  +----------------------------+  |
|  |  [Subtle loading bar]      |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+

Animation sequence:
1. Black screen -> Video fades in (0.6s)
2. Video plays (auto, muted, loop optional)
3. Screen fades out to black (0.6s)
4. Transition to main app
```

---

## Implementation Approach

### 1. Copy Video to Public Folder
Video files should go in `public/` folder because:
- Videos are large and shouldn't be bundled with JS
- Better streaming/loading performance
- Direct URL reference works better for `<video>` elements

### 2. Replace Image with Video Element

```typescript
<motion.video
  src="/video/RVMTvideo.mp4"
  autoPlay
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover object-top"
  initial={{ opacity: 0, scale: 1.05 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 1.02 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
/>
```

### 3. Key Video Properties

| Property | Value | Purpose |
|----------|-------|---------|
| `autoPlay` | true | Start playing immediately |
| `muted` | true | Required for autoplay on mobile |
| `playsInline` | true | Prevent iOS fullscreen takeover |
| `loop` | false | Play once during splash duration |
| `preload` | "auto" | Start loading video early |

---

## File Changes

| File | Action |
|------|--------|
| `public/video/RVMTvideo.mp4` | Copy uploaded video here |
| `src/pages/Splash.tsx` | Replace `<img>` with `<video>` element |

---

## Technical Details

### Video Element vs Image
- Replace `motion.img` with `motion.video`
- Remove the ES module import (videos load via URL)
- Add video-specific attributes for mobile compatibility

### Timing Adjustments
- May need to sync splash duration with video length
- Keep minimum 2.5s display time
- Video continues playing until fade-out begins

### Mobile Optimizations
- `playsInline` prevents iOS from hijacking to fullscreen
- `muted` is mandatory for autoplay to work on all browsers
- Keep `object-cover` and `object-top` for proper framing

### Fallback Strategy
- Keep the image as a poster/fallback if video fails to load
- Add `onLoadedData` event to ensure smooth transition

---

## Updated Component Structure

```typescript
export default function Splash({ onComplete }: SplashProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // ... existing timing logic

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div className="fixed inset-0 z-50 bg-black" style={{ height: "100dvh" }}>
          
          {/* Full-screen video */}
          <motion.video
            src="/video/RVMTvideo.mp4"
            autoPlay
            muted
            playsInline
            poster={splashImage} // Fallback image
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: videoLoaded ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Dark overlay gradients - keep existing */}
          {/* Vignette effect - keep existing */}
          {/* Loading bar - keep existing */}
          {/* Safe area padding - keep existing */}
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## Expected Result

A premium, dynamic video splash screen that:
- Opens from black with the video fading in smoothly
- Plays the RMVT promo video automatically
- Works seamlessly on mobile (muted autoplay)
- Maintains the dark overlay aesthetic for depth
- Fades out elegantly to the main app
- Falls back to static image if video fails

