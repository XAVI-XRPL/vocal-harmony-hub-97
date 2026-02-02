

# Animated Frosted Glass Button for "Start Training"

## Overview

Transform the "Start Training" button into a premium animated frosted glass effect with shimmer, glow pulsing, and depth - matching the premium aesthetic of the rest of the home page.

---

## Visual Concept

```text
+--------------------------------------------------+
|                                                  |
|   ╭────────────────────────────────────────────╮ |
|   │  ✨ ░░░░░░░░░ shimmer effect ░░░░░░░░░ ✨  │ |
|   │                                            │ |
|   │     ▶  Start Training                      │ |
|   │                                            │ |
|   │  frosted glass backdrop blur               │ |
|   ╰────────────────────────────────────────────╯ |
|       ⬇ animated glow pulse underneath ⬇        |
|                                                  |
+--------------------------------------------------+
```

---

## Features

### 1. Frosted Glass Effect
- Strong backdrop blur (40-60px)
- Semi-transparent gradient background
- Subtle inner light reflection (inset shadow)
- Blue-tinted glass matching stadium theme

### 2. Animated Shimmer
- Continuous light sweep animation across button
- Subtle white gradient moving left to right
- 3-4 second animation loop

### 3. Pulsing Glow
- Soft outer glow that pulses subtly
- Stadium blue color (primary)
- Creates depth and "alive" feeling

### 4. Hover Effects
- Intensified glow on hover
- Slightly brighter glass background
- Scale up with spring animation (already exists)

---

## Implementation

### New CSS Classes (add to index.css)

```css
/* Frosted Glass Button */
.glass-button-frosted {
  background: linear-gradient(
    135deg,
    hsl(200 50% 60% / 0.15) 0%,
    hsl(210 50% 50% / 0.08) 100%
  );
  backdrop-filter: blur(40px) saturate(160%);
  -webkit-backdrop-filter: blur(40px) saturate(160%);
  border: 1px solid hsl(200 70% 70% / 0.25);
  box-shadow: 
    0 8px 32px hsl(200 90% 55% / 0.25),
    0 4px 16px hsl(210 80% 50% / 0.15),
    inset 0 1px 0 hsl(0 0% 100% / 0.15),
    inset 0 -1px 0 hsl(200 50% 50% / 0.1);
}

/* Animated shimmer overlay */
@keyframes buttonShimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.glass-button-shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsl(0 0% 100% / 0.1) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: buttonShimmer 3s ease-in-out infinite;
}

/* Pulsing glow animation */
@keyframes glowPulse {
  0%, 100% { 
    box-shadow: 
      0 8px 32px hsl(200 90% 55% / 0.25),
      0 0 40px hsl(200 90% 55% / 0.15);
  }
  50% { 
    box-shadow: 
      0 8px 32px hsl(200 90% 55% / 0.4),
      0 0 60px hsl(200 90% 55% / 0.25);
  }
}

.glass-button-glow {
  animation: glowPulse 2.5s ease-in-out infinite;
}
```

### New GlassButton Variant

Add a new `frosted` variant to the GlassButton component:

```typescript
const variantClasses = {
  // ... existing variants
  frosted: cn(
    "glass-button-frosted glass-button-shimmer glass-button-glow",
    "text-white font-semibold",
    "hover:bg-white/10 hover:border-white/30"
  ),
};
```

### Home.tsx Update

```tsx
<GlassButton
  variant="frosted"
  size="lg"
  icon={<Play className="w-5 h-5 fill-white" />}
  onClick={() => navigate("/training-select")}
  className="w-full text-base py-6"
>
  Start Training
</GlassButton>
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Add frosted glass button animations and styles |
| `src/components/ui/glass-button.tsx` | Add new "frosted" variant |
| `src/pages/Home.tsx` | Update Start Training button to use frosted variant |

---

## Technical Details

### Animation Timing
- **Shimmer**: 3 seconds loop (smooth, not distracting)
- **Glow pulse**: 2.5 seconds (subtle breathing effect)
- Both use `ease-in-out` for natural feel

### Backdrop Blur
- 40px blur creates strong frosted effect
- 160% saturation enhances colors behind button
- Works with stadium background gradient

### Color Palette
- Glass tint: `hsl(200 50% 60% / 0.15)`
- Border: `hsl(200 70% 70% / 0.25)`
- Glow: `hsl(200 90% 55%)` (primary)
- Text: Pure white for contrast

### Light Mode Support
- Adjusted glass opacity for visibility
- Stronger border for definition
- Softer glow to not overpower

---

## Expected Result

A premium, animated frosted glass button that:
- Looks "alive" with subtle continuous animations
- Has depth with multi-layer shadows
- Matches the stadium blue aesthetic
- Draws attention as the primary CTA
- Feels premium and polished

