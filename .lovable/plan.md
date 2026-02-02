

# TESTIFY EXERCISE - Real Song Integration

## Overview

Replace the "Bouncing on a Blessing" song data with the new "TESTIFY EXERCISE" song using the 9 uploaded audio stems. The existing cover image from Bouncing on a Blessing will be retained for Testify Exercise.

---

## Stem Alignment (Ordered as Requested)

Based on your requested order and the uploaded files:

| Order | Display Name | File | Stem Type |
|-------|-------------|------|-----------|
| 1 | RAab Coaching (Master) | RAab-Coaching.mp3 | vocal |
| 2 | Instrumental | Instrumental.mp3 | instrumental |
| 3 | Piano | PIANO.mp3 | keys |
| 4 | Guitar | Guitar.mp3 | instrumental |
| 5 | RAab Exercise (Lead) | RAab-Exercise.mp3 | vocal |
| 6 | JLevy Exercise 1 | JLevy-Exercise-1.mp3 | vocal |
| 7 | RAab Harmony 2 | RAab-Harmony-2.mp3 | harmony |
| 8 | JLevy Harmony 2 | JLevy-Harmony-2.mp3 | harmony |
| 9 | RAab Harmony 3 | RAab-Harmony-3.mp3 | harmony |

---

## File Operations

### Step 1: Create New Audio Folder
```
public/audio/testify-exercise/
```

### Step 2: Copy Audio Files
| Source | Destination |
|--------|-------------|
| user-uploads://1-TESTIFY-EXERCISE-RAab-Coaching.mp3 | public/audio/testify-exercise/raab-coaching.mp3 |
| user-uploads://1-TESTIFY-EXERCISE-Instrumental.mp3 | public/audio/testify-exercise/instrumental.mp3 |
| user-uploads://1-TESTIFY-EXERCISE-PIANO.mp3 | public/audio/testify-exercise/piano.mp3 |
| user-uploads://1-TESTIFY-EXERCISE-Guitar.mp3 | public/audio/testify-exercise/guitar.mp3 |
| user-uploads://1-TESTIFY-EXERCISE-RAab-Exercise.mp3 | public/audio/testify-exercise/raab-exercise.mp3 |
| user-uploads://1-TESTIFY-EXERCISE-JLevy-Exercise-1.mp3 | public/audio/testify-exercise/jlevy-exercise-1.mp3 |
| user-uploads://1-TESTIFY-EXERCISE-RAab-Harmony-2.mp3 | public/audio/testify-exercise/raab-harmony-2.mp3 |
| user-uploads://1-TESTIFY-EXERCISE-JLevy-Harmony-2.mp3 | public/audio/testify-exercise/jlevy-harmony-2.mp3 |
| user-uploads://1-TESTIFY-EXERCISE-RAab-Harmony-3.mp3 | public/audio/testify-exercise/raab-harmony-3.mp3 |

### Step 3: Update mockSongs.ts

Replace the `bouncingOnABlessingStems` array with new `testifyExerciseStems`:

```typescript
// Real song: TESTIFY EXERCISE with actual audio stems
const testifyExerciseStems: Stem[] = [
  {
    id: 'testify-raab-coaching',
    name: 'RAab Coaching (Master)',
    type: 'vocal',
    url: '/audio/testify-exercise/raab-coaching.mp3',
    color: stemColors.vocal,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-instrumental',
    name: 'Instrumental',
    type: 'instrumental',
    url: '/audio/testify-exercise/instrumental.mp3',
    color: stemColors.instrumental,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-piano',
    name: 'Piano',
    type: 'keys',
    url: '/audio/testify-exercise/piano.mp3',
    color: stemColors.keys,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-guitar',
    name: 'Guitar',
    type: 'instrumental',
    url: '/audio/testify-exercise/guitar.mp3',
    color: '#f97316', // orange for second instrumental
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-raab-exercise',
    name: 'RAab Exercise (Lead)',
    type: 'vocal',
    url: '/audio/testify-exercise/raab-exercise.mp3',
    color: '#22d3ee', // cyan for lead vocal
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-jlevy-exercise',
    name: 'JLevy Exercise 1',
    type: 'vocal',
    url: '/audio/testify-exercise/jlevy-exercise-1.mp3',
    color: '#06b6d4', // teal variant
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-raab-harmony-2',
    name: 'RAab Harmony 2',
    type: 'harmony',
    url: '/audio/testify-exercise/raab-harmony-2.mp3',
    color: stemColors.harmony,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-jlevy-harmony-2',
    name: 'JLevy Harmony 2',
    type: 'harmony',
    url: '/audio/testify-exercise/jlevy-harmony-2.mp3',
    color: '#c084fc', // purple variant
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-raab-harmony-3',
    name: 'RAab Harmony 3',
    type: 'harmony',
    url: '/audio/testify-exercise/raab-harmony-3.mp3',
    color: '#e879f9', // pink-purple for harmony 3
    waveformData: generateMockWaveform(200),
  },
];
```

### Step 4: Update Song Entry

Replace the first song in `mockSongs` array:

```typescript
{
  id: 'testify-exercise',
  title: 'TESTIFY EXERCISE',
  artist: 'RVMT',
  coverArt: covers.gospel, // Keep existing gospel cover image
  duration: 180, // Will be updated by Howler
  bpm: 90,
  key: 'G Major',
  fullMixUrl: '',
  stems: testifyExerciseStems,
  difficulty: 'beginner',
  genre: 'Gospel',
  isPremium: false,
},
```

---

## Color Coding Strategy

To visually distinguish similar stem types:

| Stem Category | Color | Hex |
|---------------|-------|-----|
| RAab Coaching (Master) | Teal | #14b8a6 |
| Instrumental | Amber | #f59e0b |
| Piano | Green | #10b981 |
| Guitar | Orange | #f97316 |
| RAab Exercise (Lead) | Cyan | #22d3ee |
| JLevy Exercise 1 | Teal variant | #06b6d4 |
| RAab Harmony 2 | Purple | #a855f7 |
| JLevy Harmony 2 | Light purple | #c084fc |
| RAab Harmony 3 | Pink-purple | #e879f9 |

---

## Files to Modify

| File | Action |
|------|--------|
| `public/audio/testify-exercise/*.mp3` | Copy 9 audio files |
| `src/data/mockSongs.ts` | Replace Bouncing on a Blessing with TESTIFY EXERCISE |

---

## Optional: Delete Old Audio

The old `public/audio/bouncing-on-a-blessing/` folder can be deleted to clean up, or kept for reference.

---

## Expected Result

- First song in the library becomes "TESTIFY EXERCISE"
- 9 properly ordered stems in the training mode
- Same gospel cover image maintained
- All audio files play correctly in order:
  1. RAab Coaching (Master)
  2. Instrumental
  3. Piano
  4. Guitar
  5. RAab Exercise (Lead)
  6. JLevy Exercise 1
  7. RAab Harmony 2
  8. JLevy Harmony 2
  9. RAab Harmony 3

