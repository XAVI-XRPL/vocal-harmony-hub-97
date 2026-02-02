

# Update RMVT Logo to Standard App Icon Shape (Squircle)

## Overview

Change the logo container from `rounded-2xl` to a proper squircle/superellipse shape that matches standard iOS/Android app icon styling.

---

## Current State

The logo uses `rounded-2xl` which creates a square with rounded corners - this doesn't match the smooth continuous curvature of modern app icons.

## Solution

Apply a squircle shape using CSS with a higher border-radius ratio (approximately 22-24% of the container size) which creates the distinctive iOS app icon look.

---

## Implementation

### File to Modify

`src/components/ui/RMVTLogo.tsx`

### Changes

1. Update the border-radius to use `rounded-[22%]` which creates the authentic squircle shape
2. This ratio (22%) matches the iOS app icon specification for continuous corner curves

### Updated Code

```tsx
<motion.div
  className={cn(
    sizeMap[size],
    "rounded-[22%] overflow-hidden",  // Changed from rounded-2xl
    "shadow-[0_0_30px_hsl(200_90%_55%/0.3)]",
    className
  )}
  // ... rest unchanged
>
```

---

## Visual Comparison

```text
Current (rounded-2xl):     App Icon Shape (rounded-[22%]):
┌──────────────┐           ╭──────────────╮
│              │           │              │
│    RMVT      │     →     │    RMVT      │
│              │           │              │
└──────────────┘           ╰──────────────╯

More angular corners       Smooth continuous curve
```

---

## Result

The RMVT logo will have the signature squircle shape used by iOS and Android app icons, providing a more polished and recognizable app icon appearance.

