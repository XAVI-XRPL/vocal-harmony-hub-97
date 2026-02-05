

# Web Audio API Engine Rewrite

## Overview

The uploaded document describes a complete rewrite of the audio playback system from Howler.js/HTML5 Audio to Web Audio API. This is necessary because:

- **Mobile browsers throttle concurrent `<audio>` elements** - they're designed for one-at-a-time playback
- **Each `<audio>` element has its own buffer, decode pipeline, and clock** - 14 of them competing causes choppiness
- **HTML5 Audio has no sample-accurate sync** - stems drift apart over time
- **Mobile Safari and Chrome aggressively suspend background audio elements**

The solution uses Web Audio API which decodes all audio into raw PCM buffers in memory, then plays them through a single `AudioContext` with one clock. This provides zero drift, zero chop, and smooth playback on mobile.

---

## Architecture Changes

### Current System (Howler.js)

```text
+-------------------+     +-------------------+
|   Howl Instance   | ... |   Howl Instance   |  (14 instances)
+-------------------+     +-------------------+
         |                         |
+-------------------+     +-------------------+
|  <audio> element  | ... |  <audio> element  |  (14 elements)
+-------------------+     +-------------------+
         |                         |
      Separate decode pipelines, clocks, buffers
              = CHOPPY ON MOBILE
```

### New System (Web Audio API)

```text
+---------------------+
|     AudioContext    |  (ONE context = ONE clock)
+---------------------+
          |
+---------------------+
|     Master GainNode |
+---------------------+
    /         |         \
+-------+  +-------+  +-------+
| Stem  |  | Stem  |  | Stem  |   (14 AudioBufferSourceNodes)
| Gain  |  | Gain  |  | Gain  |   (each has its own GainNode for volume/mute)
+-------+  +-------+  +-------+
```

### Playback Strategy

1. **Phase 1: Mixdown First** - Fetch and decode a pre-mixed full mix (3-5MB, plays in 1-2 seconds)
2. **Phase 2: Background Stem Loading** - Download and decode individual stems while mixdown plays
3. **Phase 3: Crossfade** - When all stems are decoded, crossfade from mixdown to stems (200ms)
4. **Phase 4: Stem Mixer Active** - User can now solo/mute/adjust individual stems

---

## Implementation Plan

### Step 1: Create Core Audio Engine Service

**New file: `src/services/webAudioEngine.ts`**

A singleton class that manages:
- Single `AudioContext` instance (created on user gesture)
- Mixdown `AudioBuffer` and playback
- Per-stem `AudioBuffer`, `GainNode`, and `AudioBufferSourceNode`
- Playback state machine: idle → loading → playing → paused
- Audio mode: mixdown → crossfading → stems
- Fetch with progress tracking and abort support
- Blob cache for re-use

Key methods:
- `init()` - Create/resume AudioContext (must be called from click handler)
- `loadSong(config)` - Load mixdown + stems
- `play()` / `pause()` / `seek()` / `stop()`
- `setStemVolume()` / `setStemMuted()`
- `subscribe(listener)` - State change notifications

### Step 2: Create React Hook Bridge

**New file: `src/hooks/useAudioEngine.ts`**

Bridges the WebAudioEngine to React component state:
- Subscribes to engine state changes
- Exposes all playback controls as callbacks
- Returns reactive state (playbackState, currentTime, duration, stemLoadProgress, etc.)

### Step 3: Update TrainingMode Page

**Modified file: `src/pages/TrainingMode.tsx`**

- Replace `useAudioPlayer()` with `useAudioEngine()`
- Ensure play button calls `audioEngine.init()` directly in onClick handler (mobile requirement)
- Update loading overlay to show mixdown vs stems loading phases
- Show "Playing full mix" indicator while stems load in background

### Step 4: Create New Stem Mixer Component

**New file: `src/components/player/StemMixer.tsx`**

- Per-stem loading progress indicators
- Volume faders disabled until stems are decoded
- Visual feedback for mixdown/crossfading/stems modes
- Status indicator showing current audio mode

### Step 5: Add Mobile Enhancements

**Wake Lock API** - Prevent screen sleep during playback
**Media Session API** - Lock screen controls on mobile

### Step 6: Cleanup

- Remove Howler.js dependency
- Remove old `useAudioPlayer.ts` hook
- Update `audioPreloadStore.ts` to work with new system

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/services/webAudioEngine.ts` | Core Web Audio API engine |
| `src/hooks/useAudioEngine.ts` | React hook bridge |
| `src/components/player/StemMixer.tsx` | New stem mixer UI |
| `src/components/player/PlayerControls.tsx` | Transport controls |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/TrainingMode.tsx` | Replace useAudioPlayer with useAudioEngine |
| `src/stores/audioStore.ts` | May need updates for new playback model |
| `src/components/audio/AudioLoadingOverlay.tsx` | Add mixdown vs stems phase display |

---

## Files to Remove/Deprecate

| File | Reason |
|------|--------|
| `src/hooks/useAudioPlayer.ts` | Replaced by useAudioEngine |

---

## Technical Requirements

### Critical Rules (from document)

1. **NO HTML `<audio>` elements** for stem playback - all through `AudioContext`
2. **AudioContext must be created on user gesture** - call `audioContext.resume()` inside onClick
3. **Decode audio FULLY before playing** - use `decodeAudioData()` not `MediaElementSourceNode`
4. **One GainNode per stem** - for volume/mute control
5. **AudioBufferSourceNode is single-use** - create new one after stop/seek
6. **Time tracking uses `AudioContext.currentTime`** - not `setInterval`
7. **Crossfade must be sample-accurate** - use AudioParam scheduling

### Browser Compatibility

- Works on all modern browsers
- Mobile Safari requires user gesture for AudioContext
- Wake Lock API has good mobile support

---

## Expected Benefits

| Metric | Before (Howler.js) | After (Web Audio API) |
|--------|-------------------|----------------------|
| Mobile playback | Choppy, stuttering | Smooth |
| Stem sync | Drifts over time | Sample-accurate |
| Initial play time | Wait for all stems | Plays in 1-2 seconds |
| Background audio | May suspend | Stays active |
| Memory usage | Higher (14 decode pipelines) | Lower (shared context) |

---

## Estimated Complexity

This is a **significant rewrite** involving:
- ~700 lines of new engine code
- ~100 lines of new React hook
- ~200 lines of new UI components
- Updates to TrainingMode page
- Testing on mobile devices required

