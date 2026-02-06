

# Fix Guitar Stem Type and Verify 3-Tier Grouping

## Problem

Guitar stems in **TESTIFY EXERCISE** and **THROWBACK EXERCISE** have `type = 'instrumental'` in the database. The frontend grouping logic treats `instrumental` as a Core Vocal (immediate load), so Guitar loads upfront instead of being deferred to the lazy Instruments card.

## Solution

A single database migration to change Guitar stem types from `'instrumental'` to `'keys'` (which maps to the Instruments lazy group). No frontend code changes needed -- the 3-tier logic in `useSongs.ts` already handles this correctly.

## Current State (from database)

| Exercise | Stem | Current Type | Should Be |
|----------|------|-------------|-----------|
| 1. TESTIFY EXERCISE | Guitar | instrumental | keys |
| 2. THROWBACK EXERCISE | Guitar | keys (already correct: Piano is keys, Guitar is instrumental) | keys |
| 3. DONT LEAVE EXERCISE | Organ | keys | keys (correct) |
| 3. DONT LEAVE EXERCISE | Stomps | drums | drums (correct) |
| 12. TESTIFY V2 | (no instruments) | -- | -- (correct) |

## Database Migration

```sql
UPDATE stems 
SET type = 'keys' 
WHERE name = 'Guitar' AND type = 'instrumental';
```

This changes exactly 2 rows (Guitar in TESTIFY EXERCISE and THROWBACK EXERCISE).

## Result After Fix

**1. TESTIFY EXERCISE** (9 stems):
- Core Vocals (immediate, 4): RAab Coaching, Instrumental, RAab Exercise, JLevy Exercise
- Instruments (lazy, 2): Piano, **Guitar**
- Harmonies (lazy, 3): RAab Harmony 2, JLevy Harmony 2, RAab Harmony 3

**2. THROWBACK EXERCISE** (6 stems):
- Core Vocals (immediate, 4): RAab Coaching, Instrumental, RAab Exercise, JLevy Exercise
- Instruments (lazy, 2): Piano, **Guitar**
- Harmonies: none

**3. DONT LEAVE EXERCISE** (12 stems):
- Core Vocals (immediate, 5): RAab Coaching, Instrumental, Blakely Lead, RAab Exercise, JLevy Exercise
- Instruments (lazy, 2): Organ, Stomps
- Harmonies (lazy, 5): RAab Harmony 2, JLevy Harmony 2, JLevy Harmony 3, RAab Harmony 3, RAab Harmony 4

**12. TESTIFY V2** (14 stems):
- Core Vocals (immediate, 5): Acapella, Blakeley First, Justin First, RAab First, Instrumental
- Instruments: none
- Harmonies (lazy, 9): all Second/Third/Fourth parts

## No Code Changes Needed

The frontend grouping in `useSongs.ts` already correctly partitions stems:
- `type === 'vocal' || type === 'instrumental'` goes to Core Vocals (immediate)
- `type === 'keys' || type === 'drums' || type === 'bass'` goes to Instruments (lazy)
- `type === 'harmony'` goes to Harmonies (lazy)

The lazy groups only load when the user taps the card, saving bandwidth and memory.

