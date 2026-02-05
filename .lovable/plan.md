
# Mixdown-First Loading Strategy

## Overview

Implementing the mixdown-first loading strategy where a pre-mixed master audio file plays immediately while individual stems decode in the background. This provides near-instant playback (1-2 seconds) instead of waiting for all stems to load.

---

## Uploaded Master Files

| Uploaded File | Song ID | Destination Path |
|---------------|---------|------------------|
| 1.TESTIFY-_MASTER.mp3 | testify-exercise | /audio/testify-exercise/master.mp3 |
| 2.THROWBACK-_MASTER.mp3 | throwback-exercise | /audio/throwback-exercise/master.mp3 |
| 3.DONT-LEAVE-_MASTER.mp3 | dont-leave-exercise | /audio/dont-leave-exercise/master.mp3 |
| 12.TESTIFY_VERSION-2-_MASTER.mp3 | testify-v2 | /audio/testify-v2/master.mp3 |

---

## Implementation Steps

### Step 1: Copy Master Files to Public Directory

Copy all 4 uploaded master tracks to their respective song folders with standardized naming.

### Step 2: Update Database

Update the `full_mix_url` column for each song:

```text
UPDATE songs SET full_mix_url = '/audio/testify-exercise/master.mp3' WHERE id = 'testify-exercise';
UPDATE songs SET full_mix_url = '/audio/throwback-exercise/master.mp3' WHERE id = 'throwback-exercise';
UPDATE songs SET full_mix_url = '/audio/dont-leave-exercise/master.mp3' WHERE id = 'dont-leave-exercise';
UPDATE songs SET full_mix_url = '/audio/testify-v2/master.mp3' WHERE id = 'testify-v2';
```

### Step 3: Update WebAudioEngine for Mixdown-First Strategy

Modify `src/services/webAudioEngine.ts` to implement the 4-phase playback:

**Phase 1: Load Mixdown First**
- Fetch and decode the master file immediately
- Start playback as soon as mixdown is ready (~1-2 seconds)

**Phase 2: Background Stem Loading**
- While mixdown plays, fetch and decode all individual stems
- Track progress for UI feedback

**Phase 3: Crossfade**
- When all stems are decoded, perform a 200ms sample-accurate crossfade
- Use AudioParam scheduling for smooth transition

**Phase 4: Stem Mixer Active**
- Solo/mute/volume controls now affect actual stems
- User can mix individual tracks

### Step 4: Update useAudioEngine Hook

Modify `src/hooks/useAudioEngine.ts` to:
- Pass `mixdownUrl` to the engine when loading songs
- Expose `audioMode` state for UI feedback

### Step 5: Update Loading Overlay

Modify `src/components/audio/AudioLoadingOverlay.tsx` to:
- Show "Loading full mix..." during Phase 1
- Show "Playing full mix, loading stems..." during Phase 2
- Display stem loading progress in background

---

## Technical Details

### Crossfade Implementation

```text
                   ┌─────────────────────────────────┐
   Mixdown Volume  │████████████████████████████████▁│  ← Fades out over 200ms
                   └─────────────────────────────────┘
                   ┌─────────────────────────────────┐
   Stems Volume    │▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████│  ← Fades in over 200ms
                   └─────────────────────────────────┘
                                                   ↑
                                        Stems sync-start at same position
```

### Key Engine Changes

1. **New method: `loadMixdownFirst()`** - Fetches and decodes mixdown, starts playback immediately
2. **New method: `startBackgroundStemLoading()`** - Loads stems in parallel while mixdown plays
3. **New method: `crossfadeToStems()`** - Smooth 200ms transition using AudioParam scheduling
4. **State tracking for `audioMode`** - 'mixdown' | 'crossfading' | 'stems'

### Playback Flow

```text
User clicks PLAY
      │
      ▼
┌─────────────────┐
│ Load Mixdown    │  (3-5MB, ~1-2 sec)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Play Mixdown    │  ◄── User hears audio immediately!
│ Load Stems BG   │  (continues in background)
└────────┬────────┘
         │ All stems loaded?
         ▼
┌─────────────────┐
│ Crossfade 200ms │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Stem Mixer On   │  ◄── Solo/mute/volume now work!
└─────────────────┘
```

---

## Files to Change

| File | Changes |
|------|---------|
| `public/audio/*/master.mp3` | Add 4 new master files |
| `src/services/webAudioEngine.ts` | Implement mixdown-first loading |
| `src/hooks/useAudioEngine.ts` | Pass mixdownUrl, expose audioMode |
| `src/components/audio/AudioLoadingOverlay.tsx` | Update loading states |
| `src/pages/TrainingMode.tsx` | Optional: show "Playing full mix" indicator |

---

## Expected User Experience

| Before | After |
|--------|-------|
| Wait 10-30 seconds for all stems | Playback starts in 1-2 seconds |
| See loading progress for all stems | Hear music while stems load |
| Can't interact until fully loaded | Can pause/seek immediately |
| Stems ready when playback starts | Stems ready after ~10-20 seconds |
