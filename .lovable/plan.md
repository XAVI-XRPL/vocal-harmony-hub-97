

# Unify Loop Controls to Show on All Tracks

## Problem

The A-B loop currently only shows on the Master waveform, making it unclear that the loop controls the entire song. Users see separate stem waveforms without loop markers, which creates confusion about what's being looped.

## Solution

Display the loop region overlay on ALL tracks (Master and each individual stem) to make it visually clear that the loop controls the entire song as one unified track.

---

## Current State

| Component | Loop Region Shown |
|-----------|------------------|
| Master waveform | Yes - with A/B markers |
| Stem tracks | No - no visual indication |

This creates visual "overlap" confusion - the Master shows a loop but stems don't.

---

## Changes

### 1. Add Loop Region Props to StemTrack

**File: `src/components/audio/StemTrack.tsx`**

Pass loop state to each stem track so it can display the loop region overlay:

| New Prop | Type | Purpose |
|----------|------|---------|
| `loopStart` | `number` | Loop start time |
| `loopEnd` | `number` | Loop end time |
| `isLooping` | `boolean` | Whether loop is active |

### 2. Show Loop Region Overlay on Stem Waveforms

**File: `src/components/audio/WaveformDisplay.tsx`**

Add a subtle loop region highlight (not the full A/B markers - just the shaded region) when loop props are provided:

```
Visual: Light purple/primary overlay showing the loop region
No A/B markers needed - those stay on Master only
Just a visual indicator that this section is looped
```

### 3. Update TrainingMode to Pass Loop State to Stems

**File: `src/pages/TrainingMode.tsx`**

Pass loop state down to each StemTrack:

```tsx
<StemTrack
  stem={stem}
  currentTime={currentTime}
  duration={duration}
  onSeek={handleSeek}
  loopStart={loopStart}
  loopEnd={loopEnd}
  isLooping={isLooping}
/>
```

---

## Implementation Details

### WaveformDisplay Loop Region Overlay

Add a non-interactive (display-only) loop region when loop is active:

```tsx
{/* Loop region indicator (display only, non-interactive) */}
{loopEnd > loopStart && isLooping && (
  <div
    className="absolute inset-y-0 bg-primary/20 pointer-events-none z-5"
    style={{
      left: `${(loopStart / duration) * 100}%`,
      width: `${((loopEnd - loopStart) / duration) * 100}%`,
    }}
  />
)}
```

### Visual Hierarchy

| Track | Loop Display |
|-------|--------------|
| Master | Full A/B markers with labels + highlighted region |
| Stems | Subtle shaded region only (no markers) |

This creates a clear visual that:
- The Master track is the "control" for the loop
- All stems are affected by the same loop region
- The loop spans the entire song as one unit

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/audio/WaveformDisplay.tsx` | Add loop region overlay display when props provided |
| `src/components/audio/StemTrack.tsx` | Accept and pass loop props to WaveformDisplay |
| `src/pages/TrainingMode.tsx` | Pass loop state to each StemTrack |

---

## Visual Result

```
┌─────────────────────────────────────────────┐
│ MASTER [A]========LOOP REGION==========[B]  │  ← Interactive markers
├─────────────────────────────────────────────┤
│ Lead Vocals    ════════SHADED════════       │  ← Display only
├─────────────────────────────────────────────┤
│ Piano          ════════SHADED════════       │  ← Display only
├─────────────────────────────────────────────┤
│ Guitar         ════════SHADED════════       │  ← Display only
└─────────────────────────────────────────────┘
```

All tracks show the same loop region, making it clear they loop together as one song.

