
# Toast Notification and Mode Transition Animation

## Overview

Adding a toast notification when all stems are ready and mixer controls become available, plus a subtle animation when the audio mode transitions from mixdown to stems.

---

## Implementation Steps

### Step 1: Add Toast Notification in TrainingMode

**File: `src/pages/TrainingMode.tsx`**

Use a `useEffect` hook to detect when `allStemsReady` changes from `false` to `true`, then trigger a toast notification using the existing `sonner` library.

```typescript
import { toast } from "sonner";

// Track previous state to detect transition
const prevAllStemsReadyRef = useRef(false);

useEffect(() => {
  if (allStemsReady && !prevAllStemsReadyRef.current && mixdownReady) {
    toast.success("Stem Mixer Ready", {
      description: "All stems loaded. Individual track controls are now available.",
      duration: 4000,
    });
  }
  prevAllStemsReadyRef.current = allStemsReady;
}, [allStemsReady, mixdownReady]);
```

---

### Step 2: Enhance Audio Mode Badge Animation

**File: `src/pages/TrainingMode.tsx`**

Update the audio mode badge in the header to include:
- A celebratory pulse animation when transitioning to stems
- A brief "glow" effect during crossfade
- Smooth scale and color transition

```typescript
<motion.div
  key={audioMode} // Force re-mount on mode change
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ 
    scale: 1, 
    opacity: 1,
    boxShadow: audioMode === 'stems' 
      ? ['0 0 0 0 rgba(34,197,94,0)', '0 0 20px 4px rgba(34,197,94,0.4)', '0 0 0 0 rgba(34,197,94,0)']
      : undefined
  }}
  transition={{ 
    duration: 0.3,
    boxShadow: audioMode === 'stems' ? { duration: 1, repeat: 2 } : undefined
  }}
  className={cn(
    "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold",
    // ... color classes
  )}
>
```

---

### Step 3: Add Mode Transition Animation to StemLoadingProgress

**File: `src/components/audio/StemLoadingProgress.tsx`**

Enhance the mode badge transition with:
- Scale and glow animation when switching from mixdown to stems
- Confetti-like particle effect (optional, using motion)
- Smooth color transition with celebration pulse

```typescript
<motion.div
  key={audioMode}
  initial={{ scale: 0.9, opacity: 0, y: -10 }}
  animate={{ 
    scale: 1, 
    opacity: 1, 
    y: 0,
    boxShadow: audioMode === 'stems' 
      ? ['0 0 0 0 rgba(34,197,94,0.4)', '0 0 30px 8px rgba(34,197,94,0.6)', '0 0 0 0 rgba(34,197,94,0)']
      : undefined
  }}
  transition={{ 
    type: "spring", 
    stiffness: 400, 
    damping: 20,
    boxShadow: { duration: 0.8, repeat: 1 }
  }}
  className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold", ...)}
>
```

---

### Step 4: Add Success State Flash to Progress Panel

**File: `src/components/audio/StemLoadingProgress.tsx`**

When all stems are ready, briefly flash the entire panel green before collapsing:

```typescript
<motion.div
  animate={allStemsReady ? { 
    backgroundColor: ['transparent', 'rgba(34,197,94,0.1)', 'transparent']
  } : {}}
  transition={{ duration: 0.6 }}
  className="glass-card rounded-xl overflow-hidden"
>
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/TrainingMode.tsx` | Add toast on allStemsReady, enhance mode badge animation |
| `src/components/audio/StemLoadingProgress.tsx` | Add celebration animations for mode transition |

---

## Visual Behavior

### Toast Notification
- Appears bottom-right when all stems are ready
- Icon: Checkmark or music note
- Title: "Stem Mixer Ready"
- Description: "All stems loaded. Individual track controls are now available."
- Duration: 4 seconds

### Mode Badge Transition
- **Mixdown → Crossfading**: Purple pulsing glow
- **Crossfading → Stems**: Green celebratory flash/glow that pulses 2-3 times
- **Key change trigger**: Re-mount animation using `key={audioMode}`

### Panel Flash
- Brief green overlay fade in/out when all stems complete
- Draws attention to the successful state change

---

## Expected Result

Users will notice:
1. A toast notification announcing "Stem Mixer Ready" when stems finish loading
2. A celebratory green glow on the mode badge when switching to stems mode
3. A brief flash on the progress panel confirming all stems are ready
4. Clear visual feedback that mixer controls are now fully functional
