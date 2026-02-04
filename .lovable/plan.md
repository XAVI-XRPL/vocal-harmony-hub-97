
# Add Final 2 Stems to DONT LEAVE EXERCISE

## Overview
Complete the 12-stem setup for "3. DONT LEAVE EXERCISE" by adding the last 2 RAab harmony tracks.

## Current State
- Song has 10 stems (positions 0-9)
- Last harmony is "JLevy Harmony 3" at position 9

## Files to Add
1. `3._DONT-LEAVE-EXERCISE-RAab-Harmony-3.mp3` → `public/audio/dont-leave-exercise/raab-harmony-3.mp3`
2. `3._DONT-LEAVE-EXERCISE-RAab-Harmony-4.mp3` → `public/audio/dont-leave-exercise/raab-harmony-4.mp3`

## Database Records to Insert

| ID | Name | Type | Position | Color |
|----|------|------|----------|-------|
| dontleave-raab-harmony-3 | RAab Harmony 3 | harmony | 10 | #d946ef (fuchsia) |
| dontleave-raab-harmony-4 | RAab Harmony 4 | harmony | 11 | #f472b6 (pink) |

## Implementation Steps

### Step 1: Copy Audio Files
Copy both uploaded MP3 files to the `public/audio/dont-leave-exercise/` directory with clean lowercase filenames.

### Step 2: Insert Stem Records
Execute SQL to insert the 2 new stems into the `stems` table with:
- Matching song_id: `dont-leave-exercise`
- Type: `harmony` (consistent with other harmony tracks)
- Sequential positions: 10 and 11
- Distinct colors for visual differentiation in the mixer

### Result
Song will have complete 12-stem setup matching the expected structure.
