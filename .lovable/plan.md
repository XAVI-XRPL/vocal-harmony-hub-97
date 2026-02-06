

# Fix: Seeking Always Returns to 0:00

## Problem Summary
When clicking on the waveform to seek during playback, the audio jumps to 0:00 instead of the clicked position. The console shows two seek calls both with `0.00s`.

## Root Cause Analysis

After tracing the code, I found **two bugs** working together:

### Bug 1: Ref Not Being Used for Position Calculation

In `WaveformDisplay.tsx`, the `getTimeFromEvent` function uses `containerRef.current`:

```typescript
const getTimeFromEvent = useCallback(
  (e) => {
    if (!containerRef.current || duration === 0) return 0;  // <-- Uses containerRef
    const rect = containerRef.current.getBoundingClientRect();
    // ...
  },
  [duration]
);
```

But the JSX uses a different ref:

```tsx
<div ref={ref || containerRef} ... >
```

The problem: When using `forwardRef`, the `ref` parameter might be `null` (passed by React when parent doesn't provide a ref), which correctly falls back to `containerRef`. However, there's a subtle issue with how React handles ref assignment timing - the containerRef might not be populated when the event handlers capture their closures during the initial render.

### Bug 2: Double Event Firing

When `onLoopSelect` is provided:
1. `handlePointerUp` fires first and may call `onSeek(start)` where `start = 0`
2. `handleClick` fires immediately after and also calls `onSeek(0)`

This explains the two "Seeking to 0.00s" log entries.

### Why Time Calculation Returns 0

The `getTimeFromEvent` function returns `0` when:
- `containerRef.current` is `null`, OR
- `duration === 0`

Since the song has duration 180 in the database and `setCurrentSong(song)` sets `duration: song.duration` in the store, the duration should be correct. The issue is likely `containerRef.current` being null when the event handlers are called.

## Solution

### Fix 1: Use Event Target for Position Calculation

Instead of relying on `containerRef.current`, use `e.currentTarget` which is the element the event handler is attached to. This is always available during event handling.

```typescript
const getTimeFromEvent = useCallback(
  (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): number => {
    // Use e.currentTarget which is always the element with the event handler
    const target = 'currentTarget' in e ? e.currentTarget : containerRef.current;
    if (!target || duration === 0) return 0;
    
    const rect = (target as HTMLElement).getBoundingClientRect();
    // ... rest of calculation
  },
  [duration]
);
```

### Fix 2: Prevent Double Event Firing

Add a flag to prevent both `handlePointerUp` and `handleClick` from firing seek:

```typescript
const [justHandledPointerUp, setJustHandledPointerUp] = useState(false);

const handlePointerUp = (e) => {
  // ... existing logic
  if (end - start < 0.5 && onSeek) {
    onSeek(start);
    setJustHandledPointerUp(true);
    // Reset after a short delay to allow normal clicks
    setTimeout(() => setJustHandledPointerUp(false), 50);
  }
};

const handleClick = (e) => {
  if (!onSeek || duration === 0 || isDragging || justHandledPointerUp) return;
  // ...
};
```

### Fix 3: Combine containerRef with forwarded ref

Use a callback ref pattern to properly sync the forwarded ref with the internal containerRef:

```typescript
const internalRef = useRef<HTMLDivElement>(null);

// Combine refs using useImperativeHandle or a callback
const setRefs = useCallback((node: HTMLDivElement | null) => {
  internalRef.current = node;
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}, [ref]);

// Use internalRef in getTimeFromEvent
// Use setRefs on the div
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/audio/WaveformDisplay.tsx` | Fix ref handling and double event firing |

---

## Implementation Details

### WaveformDisplay.tsx

```typescript
export const WaveformDisplay = React.forwardRef<HTMLDivElement, WaveformDisplayProps>(
  function WaveformDisplay(
    { /* props */ },
    ref
  ) {
    const internalRef = useRef<HTMLDivElement>(null);
    const pointerUpHandledRef = useRef(false);

    // Combine forwarded ref with internal ref
    const setRefs = useCallback((node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    }, [ref]);

    // Calculate time from mouse/touch position
    const getTimeFromEvent = useCallback(
      (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): number => {
        // Use internalRef which is always synced
        if (!internalRef.current || duration === 0) return 0;

        const rect = internalRef.current.getBoundingClientRect();
        let clientX: number;

        if ("touches" in e) {
          clientX = e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX ?? 0;
        } else {
          clientX = (e as MouseEvent).clientX;
        }

        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        return percentage * duration;
      },
      [duration]
    );

    // Handle click for seeking (only if not dragging or just handled by pointerUp)
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onSeek || duration === 0 || isDragging || pointerUpHandledRef.current) {
        pointerUpHandledRef.current = false;  // Reset for next interaction
        return;
      }

      const time = getTimeFromEvent(e);
      console.log(`🎯 WaveformDisplay click seeking to ${time.toFixed(2)}s (duration: ${duration})`);
      onSeek(time);
    };

    // Handle drag end - also handles short taps as seeks
    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || dragStartTime === null || dragEndTime === null) {
        setIsDragging(false);
        return;
      }

      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      const start = Math.min(dragStartTime, dragEndTime);
      const end = Math.max(dragStartTime, dragEndTime);

      if (end - start >= 0.5 && onLoopSelect) {
        onLoopSelect(start, end);
      } else if (onSeek) {
        console.log(`🎯 WaveformDisplay pointerUp seeking to ${start.toFixed(2)}s`);
        onSeek(start);
        pointerUpHandledRef.current = true;  // Prevent duplicate from handleClick
      }

      setIsDragging(false);
      setDragStartTime(null);
      setDragEndTime(null);
    };

    return (
      <div
        ref={setRefs}  // <-- Use combined ref setter
        className={...}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* ... */}
      </div>
    );
  }
);
```

---

## Testing Checklist

After implementation:

1. **Basic seek**: Play audio, click middle of waveform - should seek to middle
2. **Seek to end**: Click near end of waveform - should seek to near end
3. **Multiple seeks**: Click different positions rapidly - should work each time
4. **Loop selection**: Drag on waveform (> 0.5s) - should create loop region, NOT seek
5. **Short tap**: Quick tap on waveform (< 0.5s drag) - should seek, not create loop
6. **Console check**: Each seek should show correct time, no duplicate entries

---

## Summary

| Issue | Fix |
|-------|-----|
| `containerRef.current` null | Use combined ref pattern with internal ref |
| Double seek (click + pointerUp) | Add `pointerUpHandledRef` flag |
| Time calculation returning 0 | Ensure ref is properly assigned before events fire |

