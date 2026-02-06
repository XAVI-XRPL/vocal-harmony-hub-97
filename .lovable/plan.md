

# Add Premium Lock Overlay to "12. TESTIFY (VERSION 2)" in Demo Mode

## What Changes

When a user is in **demo mode** (not authenticated), the "12. TESTIFY (VERSION 2)" song card in the Library should display a lock overlay with "Unlock with Premium" text. Tapping the card navigates to the subscription page instead of opening the exercise.

## Approach

Two changes are needed:

### 1. Database: Mark "TESTIFY V2" as premium

Update the `songs` table to set `is_premium = true` for the Testify V2 exercise:

```sql
UPDATE songs SET is_premium = true WHERE id = 'testify-v2';
```

This makes the existing `isLocked` logic in `SongCard` work automatically: `const isLocked = song.isPremium && !canAccessPremium`.

### 2. SongCard: Enhanced lock overlay text

The current lock overlay shows a Lock icon and "Premium" text. Update it to show **"Unlock with Premium"** for a clearer call-to-action, matching the reference screenshot.

In `src/components/song/SongCard.tsx`, update the locked overlay in the **default variant** (lines 239-246) to display:
- Lock icon on top
- "Unlock with Premium" text below

Same update for the **featured variant** overlay (lines 157-164).

## How It Works

- **Demo mode users**: `canAccessPremiumContent()` returns `false` (no user in store), so `isLocked = true` for any song with `isPremium = true`
- **Authenticated free users**: Same behavior -- locked until they subscribe
- **Pro/Premium subscribers**: `canAccessPremiumContent()` returns `true`, so card is unlocked
- **Free exercises** (Testify, Throwback, Don't Leave): `isPremium = false`, always accessible

## Files to Modify

| File | Change |
|------|--------|
| Database migration | `SET is_premium = true` for testify-v2 |
| `src/components/song/SongCard.tsx` | Update lock overlay text from "Premium" to "Unlock with Premium" |

