

# Fix A-B Loop Functionality and Audio Sync Issues

## Problem Analysis

Based on my investigation, there are several issues with the current A-B loop implementation:

### Issue 1: Loop Boundary Handling Causes Skipping

**Current Code (lines 268-286 in useAudioPlayer.ts):**
```typescript
if (isLooping && loopEnd > loopStart) {
  if (time >= loopEnd) {
    // Pause all stems
    stemHowlsRef.current.forEach(({ howl }) => howl.pause());
    reSeekAllStems(loopStart);
    setTimeout(() => {
      if (useAudioStore.getState().isPlaying) {
        stemHowlsRef.current.forEach(({ howl }) => howl.play());
      }
    }, SEEK_SYNC_DELAY_MS); // 150ms delay
    updateCurrentTime(loopStart);
  }
}
```

**Problems:**
1. The 150ms pause/seek/resume for every loop causes audible glitches
2. Animation frame continues running during this process, causing race conditions
3. Loop detection uses median position which can be inaccurate near boundaries
4. No master clock reset after loop jump

### Issue 2: No Drag-to-Select Loop Region

Currently users must:
1. Play to position A, click "Set A"
2. Play to position B, click "Set B"

This is cumbersome. Users should be able to tap and drag on the waveform to select a loop region directly.

### Issue 3: Loop Region Not Interactive

The `LoopRegion` component has `pointer-events-none`, so users cannot drag the A/B markers to adjust the loop boundaries.

---

## Solution Overview

| Fix | Description |
|-----|-------------|
| **Smoother Loop Jumps** | Use immediate seek without pause/resume cycle for loop boundaries |
| **Master Clock Sync** | Reset master clock after loop jump to prevent drift |
| **Drag-to-Select** | Add mouse/touch drag on waveform to create loop regions |
| **Draggable Markers** | Allow dragging A/B markers to adjust loop boundaries |
| **Loop Auto-Enable** | When user drags a region, automatically enable looping |

---

## Technical Implementation

### 1. Improve Loop Boundary Handling in `useAudioPlayer.ts`

**Strategy:** Instead of pause-seek-resume, use immediate seeks and only pause if drift is too large.

```typescript
// Improved loop handling
if (isLooping && loopEnd > loopStart) {
  if (time >= loopEnd) {
    // Immediate seek without pause cycle for smoother looping
    const targetTime = loopStart;
    
    // Seek all stems immediately (no pause)
    stemHowlsRef.current.forEach(({ howl }) => {
      howl.seek(targetTime);
    });
    
    // Reset master clock for accurate tracking
    playbackStartTimeRef.current = Date.now();
    playbackStartPositionRef.current = targetTime;
    
    updateCurrentTime(targetTime);
  }
}
```

**Key Changes:**
- Remove the pause/resume cycle on loop boundary
- Immediate synchronous seek to loop start
- Reset master clock reference for accurate position tracking
- Only trigger drift correction if stems actually go out of sync

### 2. Add Drag Selection to WaveformDisplay

**File: `src/components/audio/WaveformDisplay.tsx`**

Add new props and handlers for loop region selection:

| New Props | Type | Description |
|-----------|------|-------------|
| `onLoopSelect` | `(start: number, end: number) => void` | Callback when user drags to select a region |
| `loopStart` | `number` | Current loop start time |
| `loopEnd` | `number` | Current loop end time |
| `isLooping` | `boolean` | Whether loop is active |

**Add mouse/touch drag handling:**
```typescript
const [isDragging, setIsDragging] = useState(false);
const [dragStart, setDragStart] = useState<number | null>(null);
const [dragEnd, setDragEnd] = useState<number | null>(null);

const handleMouseDown = (e) => {
  // Calculate time from position
  const time = calculateTimeFromEvent(e);
  setIsDragging(true);
  setDragStart(time);
  setDragEnd(time);
};

const handleMouseMove = (e) => {
  if (!isDragging) return;
  const time = calculateTimeFromEvent(e);
  setDragEnd(time);
};

const handleMouseUp = () => {
  if (isDragging && dragStart !== null && dragEnd !== null) {
    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);
    if (end - start > 0.5) { // Minimum 0.5s region
      onLoopSelect?.(start, end);
    }
  }
  setIsDragging(false);
  setDragStart(null);
  setDragEnd(null);
};
```

### 3. Make LoopRegion Markers Draggable

**File: `src/components/audio/LoopRegion.tsx`**

Add drag handling to the A and B markers:

| New Props | Type | Description |
|-----------|------|-------------|
| `onLoopStartChange` | `(time: number) => void` | Callback when A marker is dragged |
| `onLoopEndChange` | `(time: number) => void` | Callback when B marker is dragged |

**Make markers interactive:**
```typescript
// Remove pointer-events-none from the container
// Add pointer-events to markers only

<motion.div
  className="... cursor-ew-resize"
  style={{ left: 0, pointerEvents: 'auto' }}
  onMouseDown={(e) => startDragging('start', e)}
  onTouchStart={(e) => startDragging('start', e)}
>
  {/* A marker */}
</motion.div>
```

### 4. Update TrainingMode to Connect Everything

**File: `src/pages/TrainingMode.tsx`**

Wire up the new drag selection:

```typescript
const handleLoopSelect = (start: number, end: number) => {
  setLoop(start, end); // This auto-enables looping
};

const handleLoopMarkerChange = (marker: 'start' | 'end', time: number) => {
  if (marker === 'start') {
    setLoop(time, loopEnd);
  } else {
    setLoop(loopStart, time);
  }
};

// Pass to WaveformDisplay
<WaveformDisplay
  ...
  onLoopSelect={handleLoopSelect}
  loopStart={loopStart}
  loopEnd={loopEnd}
  isLooping={isLooping}
/>

// Pass to LoopRegion
<LoopRegion
  ...
  onLoopStartChange={(t) => handleLoopMarkerChange('start', t)}
  onLoopEndChange={(t) => handleLoopMarkerChange('end', t)}
/>
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useAudioPlayer.ts` | Improve loop boundary handling, remove pause/resume cycle, reset master clock |
| `src/components/audio/WaveformDisplay.tsx` | Add drag-to-select functionality for loop regions |
| `src/components/audio/LoopRegion.tsx` | Make A/B markers draggable |
| `src/pages/TrainingMode.tsx` | Wire up new loop selection handlers |

---

## Expected Outcome

1. **Clean Looping**: Audio loops smoothly without skipping or glitching at boundaries
2. **Drag Selection**: Users can tap and drag on the waveform to select a loop region
3. **Adjustable Markers**: A and B markers can be dragged to fine-tune the loop boundaries
4. **All Stems Loop**: The entire multi-track mixer loops together in sync
5. **Visual Feedback**: Loop region shows during drag with real-time preview

---

## User Experience Flow

```text
1. User taps and drags on waveform
   ↓
2. Blue highlight appears showing selection
   ↓
3. User releases finger/mouse
   ↓
4. Loop region is set with A and B markers
   ↓
5. Looping automatically enables
   ↓
6. User can drag A or B markers to adjust
   ↓
7. Audio loops cleanly at boundaries
```

