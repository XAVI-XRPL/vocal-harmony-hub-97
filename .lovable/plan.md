
# Visual Mixdown/Stems Mode Indicator with Collapsible Stem Loading Progress

## Overview

Adding a visual indicator to show when playing mixdown vs stems, and a collapsible section that displays individual stem loading progress in the background while the full mix plays. This gives users clear feedback about:

1. What audio mode they're hearing (mixdown or individual stems)
2. Background stem loading progress per-track
3. When stem mixing controls will become fully available

---

## New Component: StemLoadingProgress

**File: `src/components/audio/StemLoadingProgress.tsx`**

A collapsible panel that shows:
- Audio mode badge (Full Mix / Stems Active)
- Per-stem loading progress bars with stem names
- Visual checkmarks when stems are decoded
- Auto-collapse when all stems are ready

---

## UI Design

### Audio Mode Indicator

```text
┌─────────────────────────────────────────────────────┐
│ ▶ PLAYING FULL MIX           [Stems: 5/12 loading] │
│   └── Tap to expand stem progress                  │
└─────────────────────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────────────────────┐
│ ▶ PLAYING FULL MIX                          ▲      │
├─────────────────────────────────────────────────────┤
│  ✓ Master            ████████████████████   100%   │
│  ✓ Lead Vocals       ████████████████████   100%   │
│  ◌ Backing Vocals    ██████████░░░░░░░░░░    50%   │
│  ◌ Instrumental      ████░░░░░░░░░░░░░░░░    20%   │
│  ◌ Coaching          ░░░░░░░░░░░░░░░░░░░░     0%   │
│  ...                                               │
├─────────────────────────────────────────────────────┤
│  Stem controls will activate once all tracks load  │
└─────────────────────────────────────────────────────┘

When stems ready:
┌─────────────────────────────────────────────────────┐
│ ♪ STEMS ACTIVE                    [14/14 ready] ✓  │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Create StemLoadingProgress Component

New file with:
- Collapsible panel using Radix Collapsible
- Audio mode badge (different colors for mixdown vs stems)
- Per-stem progress bars using stem colors
- Checkmark icons for loaded stems
- Subtle animation for loading progress

### Step 2: Update TrainingMode Page

Add the new component:
- Position below the Master waveform card
- Only visible when song has real audio AND not all stems are ready
- Auto-collapse when stems become ready
- Allow manual expand/collapse

### Step 3: Update Header Indicator

Enhance the existing header loading indicator:
- Show "Full Mix" badge when in mixdown mode
- Show "Stems" badge when crossfaded to stems
- Add pulsing animation during crossfade

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/audio/StemLoadingProgress.tsx` | Collapsible stem progress panel |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/TrainingMode.tsx` | Add StemLoadingProgress, update header indicator |

---

## Component Props

```text
interface StemLoadingProgressProps {
  stemLoadProgress: StemLoadProgress[];
  audioMode: 'mixdown' | 'crossfading' | 'stems';
  allStemsReady: boolean;
  isPlaying: boolean;
}
```

---

## Visual States

| State | Mode Badge | Progress Panel |
|-------|------------|----------------|
| Loading mixdown | "LOADING..." (yellow) | Hidden |
| Playing mixdown, stems loading | "FULL MIX" (blue) | Shows progress |
| Crossfading | "SWITCHING..." (purple pulse) | Shows 100% |
| Stems active | "STEMS ACTIVE" (green) | Collapsed, shows checkmark |

---

## Expected Result

Users will see:
1. A clear badge showing they're hearing the "Full Mix" while stems load
2. An expandable section showing each stem's loading progress
3. Smooth transition badge change when stems become active
4. Stem controls visually activate after crossfade completes
