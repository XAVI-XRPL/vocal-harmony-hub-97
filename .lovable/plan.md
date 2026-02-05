
# Replace Throwback Exercise Audio Files

## Overview

You've uploaded 6 audio files (3 AAC, 3 MP3) to replace the stems for "2. THROWBACK EXERCISE". I'll replace all existing MP3s with your new files.

---

## File Mapping

| Uploaded File | Destination | Format |
|---------------|-------------|--------|
| 2.-THROWBACK-EXERCISE-RAab-Coaching-2.mp3 | public/audio/throwback-exercise/raab-coaching.mp3 | MP3 |
| 2-THROWBACK-EXERCISE-INSTRUMENTAL-1.aac | public/audio/throwback-exercise/instrumental.aac | AAC |
| 2-THROWBACK-EXERCISE-Piano-2.mp3 | public/audio/throwback-exercise/piano.mp3 | MP3 |
| 2.-THROWBACK-EXERCISE-Guitar-2.mp3 | public/audio/throwback-exercise/guitar.mp3 | MP3 |
| 2-THROWBACK-EXERCISE-RAab--1.aac | public/audio/throwback-exercise/raab-exercise.aac | AAC |
| 2-THROWBACK-EXERCISE-JLEVY-1.aac | public/audio/throwback-exercise/jlevy-exercise-1.aac | AAC |

---

## What Will Be Done

### Step 1: Copy New Audio Files

Copy all 6 uploaded files to `public/audio/throwback-exercise/` with clean filenames.

### Step 2: Update Database Paths

Update the 3 stems that are changing from MP3 to AAC format:

```text
UPDATE stems SET audio_path = '/audio/throwback-exercise/instrumental.aac' 
  WHERE id = 'throwback-instrumental';

UPDATE stems SET audio_path = '/audio/throwback-exercise/raab-exercise.aac' 
  WHERE id = 'throwback-raab-exercise';

UPDATE stems SET audio_path = '/audio/throwback-exercise/jlevy-exercise-1.aac' 
  WHERE id = 'throwback-jlevy-exercise';
```

The MP3 files (raab-coaching, piano, guitar) keep the same paths since format is unchanged.

### Step 3: Remove Old Files

Delete the old versions of files being replaced:
- instrumental.mp3 (replaced by .aac)
- raab-exercise.mp3 (replaced by .aac)
- jlevy-exercise-1.mp3 (replaced by .aac)

---

## Current vs New Stems

| Stem | Before | After |
|------|--------|-------|
| RAab Coaching | raab-coaching.mp3 | raab-coaching.mp3 (updated) |
| Instrumental | instrumental.mp3 | instrumental.aac |
| Piano | piano.mp3 | piano.mp3 (updated) |
| Guitar | guitar.mp3 | guitar.mp3 (updated) |
| RAab Exercise | raab-exercise.mp3 | raab-exercise.aac |
| JLevy Exercise | jlevy-exercise-1.mp3 | jlevy-exercise-1.aac |

---

## Files Changed

| Action | Count | Details |
|--------|-------|---------|
| Add | 6 | New audio files to public/audio/throwback-exercise/ |
| Delete | 3 | Old MP3s replaced by AAC versions |
| Database | 3 | Update audio_path for AAC conversions |

---

## Note on Mixed Formats

You've provided 3 AAC and 3 MP3 files. If you have AAC versions of the remaining 3 tracks (RAab Coaching, Piano, Guitar), I can update those as well for consistent optimization. Otherwise, I'll use the files as provided.
