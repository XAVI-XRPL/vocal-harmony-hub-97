

# Premium Dark Splash Screen with Full-Screen Image

## Overview

Redesign the splash screen to feature the uploaded RMVT promotional image as a stunning full-screen intro. The design will be dark-themed, mobile-optimized, with elegant fade-in and fade-out transitions that create a premium, cinematic first impression.

---

## Visual Concept

```text
+----------------------------------+
|                                  |
|  [Full-screen RMVT image]        |
|  - Stadium lights at top         |
|  - "RMVT" LED text               |
|  - "RAab VOCAL MIX TAPE"         |
|  - Vocal coach with crowd        |
|                                  |
|  Overlay gradient for depth      |
|                                  |
|  +----------------------------+  |
|  |  [Subtle loading bar]      |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+

Animation sequence:
1. Black screen -> Image fades in (0.8s)
2. Hold with subtle animations (2s)
3. Image + screen fades out to black (0.6s)
4. Transition to main app
```

---

## Design Approach

### 1. Full-Screen Image Background
- Use the uploaded image as a cover background
- Fill entire viewport with `object-cover`
- Optimized for mobile portrait orientation

### 2. Dark Overlay Gradients
- Top gradient: Enhance stadium lights glow
- Bottom gradient: Darken for loading bar visibility
- Overall: Slight dark vignette for depth

### 3. Animation Sequence

**Phase 1: Fade In (0-1s)**
- Screen starts completely black
- Image fades in smoothly with opacity 0 -> 1
- Slight scale animation (1.05 -> 1) for depth

**Phase 2: Hold (1-2.5s)**
- Subtle floating/breathing animation on image
- Loading progress bar fills
- Optional: Gentle light pulse effect

**Phase 3: Fade Out (2.5-3.2s)**
- Entire screen fades to black (opacity 1 -> 0)
- Scale slightly zooms in (1 -> 1.02)
- Seamless transition to app

### 4. Mobile-First Design
- Full viewport height (100dvh for mobile browsers)
- Safe area padding for notch/status bar
- Touch-friendly, minimal UI

---

## Implementation

### File Changes

| File | Action |
|------|--------|
| `src/pages/Splash.tsx` | Complete redesign with new animation system |
| `src/assets/RVMT.png` | Copy uploaded image to assets |

### New Splash Component Structure

```typescript
// Animation phases with Framer Motion
const splashVariants = {
  hidden: { 
    opacity: 0, 
    scale: 1.05 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 1.02,
    transition: { duration: 0.6, ease: "easeIn" }
  }
};
```

### Image Styling

```typescript
// Full-screen cover image
<motion.img
  src={splashImage}
  alt="RMVT"
  className="absolute inset-0 w-full h-full object-cover object-top"
  variants={imageVariants}
/>

// Dark overlay gradients
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
```

### Loading Indicator

```typescript
// Minimal, premium loading bar at bottom
<motion.div 
  className="absolute bottom-16 left-1/2 -translate-x-1/2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  <div className="w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-white/60"
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  </div>
</motion.div>
```

---

## Technical Details

### Animation Timing
- **Total duration**: ~3 seconds
- **Fade in**: 0.8s with easeOut
- **Hold time**: ~1.7s (while progress fills)
- **Fade out**: 0.6s with easeIn
- Smooth, premium feel without feeling slow

### Mobile Optimizations
- Use `100dvh` for true mobile viewport height
- `object-position: top` to prioritize the RMVT logo and lights
- Safe area insets for modern phones
- Hardware-accelerated transforms only

### Color Palette (Dark Theme Only)
- Background: Pure black (#000) for deep contrast
- Overlay gradients: Black with varying opacity
- Loading bar: White with transparency

### Image Considerations
- Import image as ES module for proper bundling
- Use `object-cover` to fill viewport without distortion
- Position at top to keep LED "RMVT" text visible
- Add subtle Ken Burns-style movement for life

---

## Animation Keyframes

```text
Time:     0s    0.8s         2.5s    3.1s
          |______|____________|_______|
          
Opacity:  0% -> 100%         100% -> 0%
Scale:    105% -> 100%       100% -> 102%
          
Progress: 0%                 100%
```

---

## Expected Result

A premium, cinema-quality splash screen that:
- Opens from pure black for dramatic effect
- Shows the full RMVT promotional image beautifully
- Has smooth, buttery fade animations
- Feels professional and high-end on mobile
- Creates anticipation before the main app loads
- Matches the overall stadium blue aesthetic when transitioning

