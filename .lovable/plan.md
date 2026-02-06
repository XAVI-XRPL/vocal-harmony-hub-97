

# Grouped Stem Loading with Lazy Harmonies Card

## Overview

Restructure how stems load to reduce initial memory usage from ~360MB to ~200MB. Stems will be split into two groups: we need to apply this to all songs.  (I may have to provide a consolidated acapella with all harmonies one 1 track. we need to plan this out 

- **Core Stems** (type != 'harmony') -- Load automatically with mixdown-first strategy  
- **Harmonies** (type == 'harmony') -- Only load when user taps a "Harmonies" card

This prevents mobile crashes and lets users start practicing faster. Most users only need core tracks; harmonies are optional for advanced practice.

---

## How It Works

1. User opens an exercise -- mixdown loads first, then **only core stems** load sequentially in background
2. Crossfade to core stems when ready -- mixer controls activate for core tracks
3. A collapsed "Harmonies" card appears below core tracks showing "Tap to load" badge
4. When tapped, harmonies load sequentially one at a time
5. Each harmony joins the active mix as it finishes loading (no restart needed)
6. Memory stays stable throughout

---

## Technical Details

### No Database Changes Required

The existing `stems.type` column already distinguishes harmonies (`type = 'harmony'`) from core stems. The grouping logic is purely frontend.

### Files to Modify

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add `StemGroup` interface |
| `src/services/webAudioEngine.ts` | Add `loadGroup()` method, `startSingleStemSource()`, and group state tracking |
| `src/components/audio/StemGroupCard.tsx` | **New file** -- Collapsible card for a group of stems with lazy-load trigger |
| `src/hooks/useAudioEngine.ts` | Expose `loadGroup()` and group state |
| `src/hooks/useSongs.ts` | Add stem grouping helper in `transformSong` |
| `src/pages/TrainingMode.tsx` | Render core stems directly + StemGroupCard for harmonies |

### 1. Types (`src/types/index.ts`)

Add a `StemGroup` type:

```typescript
export interface StemGroup {
  id: string;
  name: string;
  loadBehavior: 'immediate' | 'lazy';
  stems: Stem[];
}
```

### 2. Audio Engine (`src/services/webAudioEngine.ts`)

Key additions:

- **`SongConfig` update**: Add optional `stemGroups` field alongside existing `stems`
- **`loadStemsInBackground`**: Only loads stems from "immediate" groups
- **`loadGroup(groupId)`**: New public method to trigger loading of a lazy group
  - Fetches and decodes each stem sequentially (same memory-safe pattern)
  - If playback is active in stems mode, each newly decoded stem joins the mix immediately via `startSingleStemSource()`
- **`startSingleStemSource(stemId, offset)`**: New private method to create a `BufferSourceNode` for a single stem and start it at the current playback position, synced to the existing context clock
- **Group state tracking**: `Map` of group states (idle/loading/loaded) exposed via `getGroupStates()` and `isGroupLoaded()`
- **`prepareSong` update**: Accept grouped stem configs and only register "immediate" stems in the initial `stemLoadProgress`

### 3. Stem Grouping in Song Transform (`src/hooks/useSongs.ts`)

In `transformSong`, partition stems by type:

```typescript
const coreStems = stems.filter(s => s.type !== 'harmony');
const harmonyStems = stems.filter(s => s.type === 'harmony');

// Attach groups to the Song object
```

This keeps the grouping logic simple and data-driven from the existing `type` column.

### 4. New StemGroupCard Component (`src/components/audio/StemGroupCard.tsx`)

A glass-style collapsible card that:

- **Collapsed state (lazy, not loaded)**: Shows group name, stem count, "Tap to load" badge with download icon
- **Loading state**: Expanded, shows per-stem progress bars as they load sequentially
- **Loaded state**: Expanded, shows standard StemTrack controls (volume, solo, mute) for each harmony stem
- Uses framer-motion for expand/collapse animation
- Calls `webAudioEngine.loadGroup('harmonies')` on tap

### 5. Updated useAudioEngine Hook (`src/hooks/useAudioEngine.ts`)

- Expose `loadGroup` callback
- Expose `groupStates` from engine (loading/loaded status per group)
- These flow through to TrainingMode for the StemGroupCard

### 6. Updated TrainingMode Page (`src/pages/TrainingMode.tsx`)

- Render core stems directly as before (using existing StemTrack components)
- After core stems, render a `StemGroupCard` for harmonies (if any exist for this exercise)
- Pass group loading state and callbacks to StemGroupCard
- The `prepareSong` call now includes group metadata so the engine knows which stems are immediate vs lazy

### Memory Profile

```
Before: All stems load at once
  Mixdown (5MB) + 9 stems decoded (~360MB) = crashes on mobile

After: Grouped loading
  Mixdown (5MB) + 5 core stems (~200MB) = stable on mobile
  + 4 harmonies (~160MB) = only if user requests
  Total never spikes -- sequential loading keeps peak at ~80MB
```

### Edge Cases

- **Songs with no harmonies**: No StemGroupCard rendered, behaves exactly as before
- **Songs with only harmonies**: All stems load as "immediate" (no lazy group)
- **User navigates away during harmony loading**: Existing abort controller cancels pending loads
- **Harmony stems join mid-playback**: `startSingleStemSource` syncs to AudioContext clock at current playback position

### Testing Checklist

1. Open an exercise with harmonies (e.g., TESTIFY EXERCISE has 3 harmony stems)
2. Verify core stems load and crossfade works without harmonies
3. Tap the Harmonies card -- verify sequential loading with progress
4. Verify each harmony joins playback in sync (no drift)
5. Test solo/mute on harmony stems after loading
6. Navigate away during harmony loading -- verify no errors
7. Monitor memory in DevTools -- no spike above ~80MB at any point
