

# Mobile-Optimized Stem Grouping: 3-Tier Loading

## What Changes

The current code groups stems into 2 groups: **Core Tracks** (everything non-harmony, immediate) and **Harmonies** (lazy). This loads too many stems upfront (~280MB for exercises with 6+ core stems).

The uploaded spec calls for a **3-tier** grouping to reduce initial load to ~120MB:

| Group | Contents | Load | Memory |
|-------|----------|------|--------|
| Core Vocals | Instrumental + RAab Exercise + JLevy Exercise + other vocal leads | Immediate | ~120MB |
| Instruments | Piano, Guitar, Organ, Stomps (individual parts) | Lazy | ~80MB |
| Harmonies | Harmony 1-4 | Lazy | ~160MB |

## What Stays the Same

- The `StemGroupCard` component already handles collapsible lazy groups with "Tap to load" -- no changes needed
- The `webAudioEngine.ts` group loading, `loadGroup()`, `startSingleStemSource()` all work as-is
- The `useAudioEngine.ts` hook already exposes `loadGroup` and `groupStates`
- The `TrainingMode.tsx` rendering pattern (immediate stems as `StemTrack`, lazy groups as `StemGroupCard`) is correct
- The `StemGroup` type in `src/types/index.ts` is already defined

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useSongs.ts` | Update `transformSong` grouping logic to create 3 groups instead of 2 |

## Technical Details

### Updated Grouping Logic in `useSongs.ts`

Replace the current 2-group partition with a 3-group partition:

```typescript
// Current (2 groups):
const coreStems = stems.filter(s => s.type !== 'harmony');
const harmonyStems = stems.filter(s => s.type === 'harmony');

// New (3 groups):
const vocalStems = stems.filter(s => s.type === 'vocal' || s.type === 'instrumental');
const instrumentStems = stems.filter(s => s.type === 'keys' || s.type === 'drums' || s.type === 'bass');
const harmonyStems = stems.filter(s => s.type === 'harmony');
```

Group assignment:
- **Core Vocals** (immediate): `type === 'vocal'` OR `type === 'instrumental'` -- these are the main training tracks (Instrumental mix, RAab Coaching, RAab Exercise, JLevy Exercise, Blakely Lead, etc.)
- **Instruments** (lazy): `type === 'keys'` OR `type === 'drums'` OR `type === 'bass'` -- individual instrument parts like Piano, Guitar, Organ, Stomps
- **Harmonies** (lazy): `type === 'harmony'` -- harmony vocal parts

Edge cases:
- If "Instruments" group is empty (no keys/drums/bass stems), skip creating it
- If "Harmonies" group is empty, skip creating it (e.g., THROWBACK EXERCISE has no harmonies)
- Songs with only vocal stems get a single "Core Vocals" group (immediate)

### Per-Exercise Breakdown

**1. TESTIFY EXERCISE** (9 stems):
- Core (immediate, 4): RAab Coaching, Instrumental, RAab Exercise, JLevy Exercise
- Instruments (lazy, 2): Piano, Guitar
- Harmonies (lazy, 3): RAab Harmony 2, JLevy Harmony 2, RAab Harmony 3

**2. THROWBACK EXERCISE** (6 stems):
- Core (immediate, 4): RAab Coaching, Instrumental, RAab Exercise, JLevy Exercise
- Instruments (lazy, 2): Piano, Guitar
- Harmonies: none

**3. DONT LEAVE EXERCISE** (11 stems):
- Core (immediate, 5): RAab Coaching, Instrumental, Blakely Lead, RAab Exercise, JLevy Exercise
- Instruments (lazy, 2): Organ, Stomps
- Harmonies (lazy, 4): RAab Harmony 2, JLevy Harmony 2, JLevy Harmony 3, RAab Harmony 4

**12. TESTIFY V2** (14 stems):
- Core (immediate, 4): Acapella, Blakeley First, Justin First, RAab First + Instrumental
- Instruments (lazy, 0): none
- Harmonies (lazy, 9): all Second/Third/Fourth parts

### Memory Impact

Before: ~280MB initial (all non-harmony stems decoded at once)
After: ~120-200MB initial (only vocal + instrumental stems), instruments and harmonies on-demand

