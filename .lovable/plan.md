

# Enhanced Vocal Progress Chart

## Overview

Redesign the VocalProgressDiagram to be more visually dynamic with distinct colors for each skill and a separated Level badge that doesn't overlap the chart.

---

## Visual Changes

```text
CURRENT LAYOUT:
┌─────────────────────────┐
│       Pitch             │
│    ┌─────────┐          │
│ Rhythm │ LV.2 │ Breath  │  ← Badge overlaps chart
│    └─────────┘          │
│       Range             │
│                         │
│     67% Complete        │
│   Sessions    Streak    │
└─────────────────────────┘

NEW LAYOUT:
┌─────────────────────────┐
│       Pitch (cyan)      │
│         •               │
│    /───────\            │
│ Rhythm     Breath       │  ← Chart fills the space
│ (orange)  (green)       │
│    \───────/            │
│         •               │
│      Range (purple)     │
│                         │
│    ┌───────────────┐    │
│    │ 🏆 LV.2       │    │  ← Badge below chart
│    │ Intermediate  │    │
│    └───────────────┘    │
│                         │
│     67% Complete        │
│   Sessions    Streak    │
└─────────────────────────┘
```

---

## Color Scheme for Skills

| Skill | Color | HSL Value |
|-------|-------|-----------|
| **Pitch** | Cyan-Blue | `hsl(190, 90%, 55%)` |
| **Breath** | Emerald Green | `hsl(160, 84%, 45%)` |
| **Range** | Purple | `hsl(270, 85%, 65%)` |
| **Rhythm** | Orange-Amber | `hsl(32, 95%, 55%)` |

---

## Implementation Details

### 1. Add Skill Color Configuration

Create a color mapping for each skill with both fill and glow colors.

### 2. Custom Tick Labels with Colors

Update `PolarAngleAxis` tick renderer to color-code each skill label with its corresponding color and add a glowing dot indicator.

### 3. Enhanced Radar with Multi-color Dots

Each data point on the radar will have its own skill-specific color with animated glow effects.

### 4. Separate Level Badge Section

Move the Level badge below the chart in its own styled section with:
- Horizontal layout with trophy icon
- Gradient background matching the skill colors
- Animated entrance

### 5. Add Dynamic Animations

- Staggered entrance for skill labels
- Pulsing glow on the radar shape
- Subtle rotating gradient effect on the level badge

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/home/VocalProgressDiagram.tsx` | Complete redesign with new color system, separated level badge, and enhanced animations |

---

## Expected Result

- Each skill (Pitch, Breath, Range, Rhythm) has a unique, vibrant color
- Skill labels show their color with a glowing dot indicator
- Level badge is clearly visible below the chart, not overlapping
- More dynamic feel with gradient effects and subtle animations
- Premium, polished appearance matching the stadium theme

