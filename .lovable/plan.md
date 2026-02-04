
# Hub Icon & Audio Player Debug Plan

## Part 1: Change Hub Icon to Toolkit

### Current State
- The Hub navigation icon uses `LayoutGrid` from lucide-react (in MobileNav.tsx line 16)
- The Hub page itself uses a different set of module icons

### Change Required
Replace `LayoutGrid` with `Wrench` icon from lucide-react to represent a "toolkit" concept.

### File to Modify
- `src/components/layout/MobileNav.tsx` - Change import and icon reference from `LayoutGrid` to `Wrench`

---

## Part 2: Debug Player Across All Songs

### Issues Identified

#### 1. React Ref Warning on StemTrack (Console Error)
**Problem**: "Function components cannot be given refs" warning in TrainingMode
- `StemTrack` is a function component but Framer Motion's `motion.div` wrapper in TrainingMode is attempting to pass a ref to it
- This doesn't break functionality but generates console warnings

**Solution**: Wrap `StemTrack` with `React.forwardRef` to properly handle refs from parent motion components.

#### 2. WaveformDisplay Already Has forwardRef (Verified OK)
The `WaveformDisplay` component already uses `React.forwardRef` correctly (line 117), so this is not the source of the issue.

#### 3. Audio Loading Works Correctly (Verified)
- Database has 5 songs with proper stem audio paths
- Audio files exist in the correct directories
- Network requests return 200 status for song data
- The `useSongs` hook has proper caching (30 min staleTime, 1 hour gcTime)

#### 4. Potential Issue: No Error Boundary for Audio Load Failures
If an individual audio file fails to load, the player continues but the user gets no feedback about which stem failed.

**Solution**: Add visual indication when a stem fails to load (already partially handled in `useAudioPlayer.ts` onloaderror callback, but no UI feedback).

#### 5. hasRealAudio Logic Issue
**Problem**: In `useAudioPlayer.ts` line 524, `hasRealAudio` returns `stemHowlsRef.current.length > 0`, but this only becomes true after stems are loaded. During initial render, it returns false even for songs with real audio, causing the simulated timer to briefly run.

**Solution**: Derive `hasRealAudio` from the song data itself (checking if stems have URLs) rather than from the loaded Howl instances. This is actually already done correctly in TrainingMode via `songHasRealAudio` (line 236), but the hook also exposes `hasRealAudio` which can be misleading during loading.

---

## Implementation Plan

### Step 1: Update Hub Icon
**File**: `src/components/layout/MobileNav.tsx`
- Replace `LayoutGrid` import with `Wrench`
- Update the navItems array to use `Wrench` for Hub

### Step 2: Fix StemTrack forwardRef Warning
**File**: `src/components/audio/StemTrack.tsx`
- Wrap the component with `React.forwardRef`
- Accept and forward the ref to the root GlassCard component

### Step 3: Improve hasRealAudio Reliability
**File**: `src/hooks/useAudioPlayer.ts`
- Add a state variable `songHasRealAudio` derived from `currentSong.stems` check
- Return this boolean instead of checking stemHowlsRef length
- This ensures correct behavior during the loading phase

### Step 4: Add Failed Stem Indicator (Optional Enhancement)
**File**: `src/hooks/useAudioPlayer.ts` and `src/components/audio/StemTrack.tsx`
- Track which stems failed to load in the audio store
- Display a subtle visual indicator on stems that failed

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/layout/MobileNav.tsx` | Replace LayoutGrid with Wrench icon |
| `src/components/audio/StemTrack.tsx` | Add React.forwardRef wrapper |
| `src/hooks/useAudioPlayer.ts` | Improve hasRealAudio derivation logic |

---

## Expected Outcomes
1. Hub navigation shows a wrench/toolkit icon instead of grid icon
2. No more React ref warnings in console for StemTrack
3. More reliable audio state detection during loading phase
4. Player works consistently across all 5 songs in the database
