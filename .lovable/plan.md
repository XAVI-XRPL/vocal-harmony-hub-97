
# Replace Testify Exercise MP3s with Optimized AAC Files

## Overview

You've uploaded 9 AAC files to replace the MP3 stems for "1. TESTIFY EXERCISE". AAC files offer better compression at the same quality, which should result in smoother playback and faster loading.

---

## What Will Be Done

### Step 1: Copy AAC Files to Project

Copy all 9 uploaded AAC files to the `public/audio/testify-exercise/` folder with clean filenames:

| Uploaded File | Destination |
|---------------|-------------|
| 1-TESTIFY-_RAab-Coaching.aac | public/audio/testify-exercise/raab-coaching.aac |
| 1-TESTIFY-Instrumental.aac | public/audio/testify-exercise/instrumental.aac |
| 1-TESTIFY-EXERCISE-PIANO.aac | public/audio/testify-exercise/piano.aac |
| 1-TESTIFY-EXERCISE-Guitar.aac | public/audio/testify-exercise/guitar.aac |
| 1-TESTIFY-RAab-EXERCISE.aac | public/audio/testify-exercise/raab-exercise.aac |
| 1-TESTIFY-JLEVY-EXERCISE-1.aac | public/audio/testify-exercise/jlevy-exercise-1.aac |
| 1-TESTIFY-RAab-HARMONY-2.aac | public/audio/testify-exercise/raab-harmony-2.aac |
| 1-TESTIFY-JLEVY-HARMONY-2.aac | public/audio/testify-exercise/jlevy-harmony-2.aac |
| 1-TESTIFY-RAab-HARMONY-3.aac | public/audio/testify-exercise/raab-harmony-3.aac |

### Step 2: Update Database Paths

Update all 9 stem records to point to the new `.aac` files:

```text
UPDATE stems SET audio_path = '/audio/testify-exercise/raab-coaching.aac' WHERE id = 'testify-raab-coaching';
UPDATE stems SET audio_path = '/audio/testify-exercise/instrumental.aac' WHERE id = 'testify-instrumental';
UPDATE stems SET audio_path = '/audio/testify-exercise/piano.aac' WHERE id = 'testify-piano';
UPDATE stems SET audio_path = '/audio/testify-exercise/guitar.aac' WHERE id = 'testify-guitar';
UPDATE stems SET audio_path = '/audio/testify-exercise/raab-exercise.aac' WHERE id = 'testify-raab-exercise';
UPDATE stems SET audio_path = '/audio/testify-exercise/jlevy-exercise-1.aac' WHERE id = 'testify-jlevy-exercise';
UPDATE stems SET audio_path = '/audio/testify-exercise/raab-harmony-2.aac' WHERE id = 'testify-raab-harmony-2';
UPDATE stems SET audio_path = '/audio/testify-exercise/jlevy-harmony-2.aac' WHERE id = 'testify-jlevy-harmony-2';
UPDATE stems SET audio_path = '/audio/testify-exercise/raab-harmony-3.aac' WHERE id = 'testify-raab-harmony-3';
```

### Step 3: Remove Old MP3 Files

Delete the original 9 MP3 files from `public/audio/testify-exercise/`:
- guitar.mp3
- instrumental.mp3
- jlevy-exercise-1.mp3
- jlevy-harmony-2.mp3
- piano.mp3
- raab-coaching.mp3
- raab-exercise.mp3
- raab-harmony-2.mp3
- raab-harmony-3.mp3

---

## Expected Benefits

| Metric | Before (MP3) | After (AAC) |
|--------|--------------|-------------|
| File Format | MP3 | AAC |
| Compression | Less efficient | 20-30% smaller at same quality |
| Load Time | Slower | Faster |
| Playback | May buffer | Smoother |

---

## Files Changed

| Action | Files |
|--------|-------|
| Add | 9 AAC files to `public/audio/testify-exercise/` |
| Delete | 9 MP3 files from `public/audio/testify-exercise/` |
| Database | Update 9 stem `audio_path` values |

---

## No Code Changes Required

The audio player already supports AAC format through Howler.js, so no code modifications are needed - just file replacement and database updates.
