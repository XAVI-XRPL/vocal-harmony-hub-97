
Goal: Fix Training Mode so exercises actually play audio when the player opens (route like `/training/testify-exercise`), and ensure mixer controls (volume/mute/solo/tempo/loop/master mute) affect the real Web Audio engine rather than only updating UI state.

---

Step-by-step diagnosis (what’s happening now)

1) Audio assets are loading successfully
- Console logs show:
  - “✓ Song loaded: testify-exercise”
  - multiple “✓ Stem loaded: …”
  - “✓ All stems loaded in background”
- Network requests show the song is fetched from the backend and stems are fetched from `/audio/...` successfully.

2) The play button is not starting the Web Audio engine
- In `src/pages/TrainingMode.tsx`, the Play/Pause button does:
  - `await initAudioEngine();`
  - `togglePlayPause();`
- But `togglePlayPause()` here comes from `useAudioStore()` (Zustand). That only flips a boolean; it does not call `webAudioEngine.play()` / `pause()`.

3) Same root problem affects mixer controls
- `StemTrack` currently calls Zustand actions (`setStemVolume`, `toggleStemMute`, `toggleStemSolo`) which only update UI state, not the actual engine.
- So even after we get audio playing, volume/mute/solo would not change the audio unless we route those actions through `useAudioEngine`’s control callbacks.

4) Mobile autoplay/user-gesture risk (likely intermittent)
- `useAudioEngine` currently calls `webAudioEngine.init().then(() => webAudioEngine.loadSong(...))` in an effect when the song changes.
- `webAudioEngine.init()` resumes the AudioContext, which can fail outside a user gesture on mobile browsers.
- Even if you’re testing on desktop now, this is a known source of “opens but never becomes playable” on mobile.

---

Implementation approach (high-level)

A) Make TrainingMode the single “audio controller” for the page:
- TrainingMode already uses `useAudioEngine()` and should be the one place that:
  - starts/stops playback
  - seeks
  - applies tempo / looping
  - applies stem mix changes (volume/mute/solo/master mute)
- Child components (StemTrack, TempoControl, LoopControls) should receive callbacks from TrainingMode, rather than each child subscribing to `useAudioEngine()` (important to avoid multiple hook instances each trying to load songs into the singleton engine).

B) Ensure song loading can happen without requiring AudioContext resume:
- Adjust the engine “ensure context” behavior so `loadSong()` can succeed even if the AudioContext is still suspended.
- The actual `resume()` should be tied to explicit user actions (Play click), which TrainingMode already does via `initAudioEngine()`.

---

Concrete changes (by file)

1) `src/pages/TrainingMode.tsx` — fix Play/Pause and wire real controls
- Change naming to avoid confusion between:
  - `togglePlayPause` from the store (UI-only)
  - `togglePlayPause` from `useAudioEngine` (engine + store)
- Update Play button handler:
  - If the song has real audio:
    1) call `initAudioEngine()` (user gesture)
    2) call `engineTogglePlayPause()` from `useAudioEngine`
  - If no real audio (mock songs):
    - keep using the store-only `togglePlayPause()` to drive the simulated timer

- Update master mute button:
  - For real audio: call `engineSetMasterMuted(!allMuted)`
  - For mock: keep store toggle

- Update TempoControl callback:
  - For real audio: call `engineSetPlaybackRate(rate)`
  - For mock: keep store `setPlaybackRate`

- Update Loop actions:
  - For real audio: use `engineSetLoop`, `engineToggleLoop`, `engineClearLoop`
  - For mock: keep store loop setters

- Update “Reset” behavior:
  - For real audio: include an engine-side stop/seek reset:
    - call `engineStop()` (or `enginePause()` + `engineSeekTo(0)`) in addition to store `resetAll()`
    - clear engine loop + restore playback rate to 1.0 via engine setter
  - For mock: current behavior remains

- Pass engine-backed stem control callbacks down to each `StemTrack`:
  - `onStemVolumeChange(stemId, volume)`
  - `onStemMuteChange(stemId, nextMuted)`
  - `onStemSoloChange(stemId, nextSolo)`
  (TrainingMode can compute `nextMuted/nextSolo` from current store state to avoid “toggle vs set” mismatches.)

2) `src/components/audio/StemTrack.tsx` — allow engine-backed handlers
- Extend `StemTrackProps` to accept optional callbacks:
  - `onStemVolumeChange?: (stemId: string, volume: number) => void`
  - `onStemMuteToggle?: (stemId: string) => void` OR `onStemMutedChange?: (stemId: string, muted: boolean) => void`
  - `onStemSoloToggle?: (stemId: string) => void` OR `onStemSoloChange?: (stemId: string, solo: boolean) => void`
- Inside StemTrack:
  - If handler props exist, use them
  - Otherwise, fall back to the current Zustand actions (keeps component usable elsewhere)
- This makes the mixer actually change audio once TrainingMode supplies engine-backed handlers.

3) `src/hooks/useAudioEngine.ts` — avoid calling `init()` from effects
- In the “Load song when currentSong changes” effect:
  - Replace `webAudioEngine.init().then(() => webAudioEngine.loadSong(songConfig))`
  - With `webAudioEngine.loadSong(songConfig)`
- Rationale:
  - `init()` (resume) should be reserved for user gesture flows.
  - Song loading should be allowed to prepare buffers/progress UI even if the context is still suspended.

4) `src/services/webAudioEngine.ts` — make `loadSong()` not depend on resuming AudioContext
- Update the internal context helper so it does not hard-fail if resume isn’t allowed:
  - Option A (preferred): split into:
    - `ensureContextCreated()` (create AudioContext + master gain, no resume)
    - `ensureContextRunning()` (resume, used by `init()` only)
  - Option B (minimal): keep `ensureContext()` but change it so:
    - it creates context if missing
    - it attempts `resume()` only when explicitly requested, or catches NotAllowedError and continues for load/decoding
- Ensure `loadSong()` uses “created” behavior, not “running” behavior.
- This prevents the common mobile scenario where load never completes because resume was attempted outside a click.

5) (Optional but recommended) `src/pages/TrainingMode.tsx` — stop audio when leaving Training Mode
- Add a cleanup effect on unmount to stop playback:
  - prevents audio continuing after you navigate back home
- This aligns with the current UX expectation (“exiting a training session returns to Home”) and reduces surprising background playback.

---

Why this will fix “opens but won’t play”
- After these changes, the Play button will call the engine’s `play()`/`pause()` (through `useAudioEngine`) instead of only flipping UI state.
- Because the engine already successfully loads stems/mixdown (confirmed by logs), starting playback becomes a straightforward wiring fix.
- The mobile-gesture-safe loading change prevents “never becomes ready” edge cases on phones.

---

Test plan (end-to-end)

1) Desktop (Chrome/Safari)
- Go to `/training/testify-exercise`
- Wait for “mixdown ready” / loading overlay to dismiss
- Press Play:
  - You should hear audio immediately (mixdown)
  - `audioMode` badge shows MIX, then eventually STEMS after crossfade
- Press Pause, Seek, Skip +/-10:
  - audio position matches UI
- Toggle loop A/B + enable loop:
  - audio jumps back at loop end
- Change tempo (e.g., 75%):
  - audio playback rate changes audibly
- Change a stem’s volume/mute/solo after STEMS active:
  - audible change matches UI control

2) Mobile (iOS Safari / Android Chrome)
- Enter Training Mode, wait for ready
- Tap Play:
  - audio should start (AudioContext resume occurs in the tap handler)
- Lock screen controls (if supported):
  - play/pause should work without breaking UI state (basic validation)

3) Regression
- Verify mock songs (if any exist) still “simulate” playback and don’t crash.

---

Files expected to change
- `src/pages/TrainingMode.tsx`
- `src/components/audio/StemTrack.tsx`
- `src/hooks/useAudioEngine.ts`
- `src/services/webAudioEngine.ts`
(Optional) `src/components/audio/TempoControl.tsx` only if we decide to address the ref warning, but not required for playback.

---

Notes / known non-blocker seen in logs
- “Function components cannot be given refs… TempoControl…” appears in console.
  - This is a warning (not the cause of no playback).
  - If it persists after the playback fix, we can separately address it by ensuring no `ref` is being attached to `TempoControl` via an `asChild`/Slot pattern or by adding `forwardRef` if truly needed.

