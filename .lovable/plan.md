

# MP3 Optimization & Song Reordering Plan

## Overview

This plan addresses three goals:
1. Add a song ordering system so "12. Testify Version 2" appears after song 3
2. Optimize MP3 loading for faster playback on large stem songs
3. Implement best practices for audio file delivery

---

## Part 1: Add Song Ordering System

### Current State
- Songs are fetched using `.order('title')` which sorts alphabetically
- Song titles use number prefixes ("1.", "2.", "3.", "12.") but alphabetical sorting puts "12." after "1." and before "2."
- There's no dedicated `order` column in the database

### Solution: Add Display Order Column

**Step 1: Database Migration**
Add a new `display_order` column to the `songs` table:

```text
ALTER TABLE songs ADD COLUMN display_order INTEGER;

-- Set initial order values:
-- 1. TESTIFY EXERCISE -> order 1
-- 2. THROWBACK EXERCISE -> order 2  
-- 3. DONT LEAVE EXERCISE -> order 3
-- 4. TESTIFY (VERSION 2) -> order 4 (after song 3!)
-- 5. BOUNCING ON A BLESSING -> REMOVE COMPLETELY WITH STEMS 

UPDATE songs SET display_order = 1 WHERE id = 'testify-exercise';
UPDATE songs SET display_order = 2 WHERE id = 'throwback-exercise';
UPDATE songs SET display_order = 3 WHERE id = 'dont-leave-exercise';
UPDATE songs SET display_order = 4 WHERE id = 'testify-v2';
UPDATE songs SET display_order = 5 WHERE id = 'bouncing-on-a-blessing';
```

**Step 2: Update useSongs Hook**
Change the query from `.order('title')` to `.order('display_order')`:

```text
File: src/hooks/useSongs.ts

Change line 104:
  .order('title')
To:
  .order('display_order')
```

**Step 3: Update Song Titles (Optional)**
Consider renaming titles to match new order:
- "12. TESTIFY (VERSION 2)" becomes "4. TESTIFY (VERSION 2)"

---

## Part 2: MP3 Loading Optimization

### Current Challenges
- Large MP3 files (14 stems for Testify V2) compete for bandwidth
- HTML5 streaming mode requires buffering before playback
- No server-side compression or CDN optimization

### Optimization Strategies

**Strategy 1: Audio Format Recommendations (Manual Action Required)**

MP3 files can be optimized before upload using these settings:
- **Bitrate**: 128kbps for practice/exercise tracks (smaller files, acceptable quality)
- **Bitrate**: 192kbps for final/showcase tracks (good quality)
- **Sample Rate**: 44.1kHz (standard)
- **Channels**: Mono for individual stems (halves file size!)
- **Format**: Consider AAC/M4A for even better compression at same quality

You would need to re-export your audio files with these settings using software like:
- Audacity (free)
- Adobe Audition
- Logic Pro / GarageBand

**Strategy 2: Progressive Loading Enhancement (Code Changes)**

Improve the current loading system:

1. **Pre-buffer check before play button enables**
   - Already implemented in previous changes
   
2. **Increase preload priority for critical stems**
   - Master/Coaching and Instrumental load first
   - Already implemented

3. **Add audio loading states to UI**
   - Show individual stem loading progress
   - Indicate when stems are buffered

4. **Consider lazy-loading non-priority stems**
   - Load harmonies/other stems after playback starts
   - This reduces initial load time

**Strategy 3: Blob URL Caching (Already Implemented)**

The current `audioPreloadStore.ts` already:
- Caches downloaded audio as blob URLs
- Uses LRU eviction (max 4 songs)
- Preloads priority stems first

**Strategy 4: Add Loading Skeleton for Stems**

Show visual feedback while each stem loads:
- Gray shimmer effect on unloaded stems
- Green checkmark when stem is ready
- Amber warning if stem failed to load

---

## Part 3: Implementation Summary

### Database Changes
| Change | Description |
|--------|-------------|
| Add `display_order` column | Integer column for explicit ordering |
| Set order values | Position Testify V2 as song 4 |

### Code Changes

| File | Change |
|------|--------|
| `src/hooks/useSongs.ts` | Change order clause from `title` to `display_order` |
| `src/pages/TrainingMode.tsx` | Add per-stem loading indicators (optional) |

### Manual Recommendations (For You to Do Outside Lovable)

| Task | Tool | Impact |
|------|------|--------|
| Convert stems to mono | Audacity | 50% file size reduction |
| Reduce bitrate to 128kbps | Any audio editor | 30-50% size reduction |
| Convert to AAC/M4A | FFmpeg | 20-30% better compression |

Example FFmpeg command for optimal compression:
```text
ffmpeg -i input.mp3 -ac 1 -b:a 128k -ar 44100 output.mp3
```

This converts to mono, 128kbps, 44.1kHz sample rate.

---

## New Song Order After Changes

| Order | Title | Stem Count |
|-------|-------|------------|
| 1 | TESTIFY EXERCISE | 9 stems |
| 2 | THROWBACK EXERCISE | 6 stems |
| 3 | DONT LEAVE EXERCISE | 12 stems |
| 4 | TESTIFY (VERSION 2) | 14 stems |
| 5 | BOUNCING ON A BLESSING | 8 stems |

---

## Technical Details

### Files to Modify
1. **Database**: Add `display_order` column and set values
2. `src/hooks/useSongs.ts`: Update order clause

### Expected Improvements
- Songs appear in intended order regardless of title
- Loading experience feels smoother with better feedback
- Future flexibility to reorder songs without renaming

