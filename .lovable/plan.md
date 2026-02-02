

# Direct Navigation to Training Mode

## Overview

Remove the intermediate SongDetail page from the user flow. When users click on a song card anywhere in the app, they will go directly to the Training Mode page instead of seeing the song details page first.

---

## Current Flow vs New Flow

```text
CURRENT FLOW:
Song Card Click → SongDetail Page → "Enter Training" Button → Training Mode

NEW FLOW:
Song Card Click → Training Mode (Direct!)
```

---

## Changes Required

### File: `src/components/song/SongCard.tsx`

Update the `handleClick` function to navigate directly to training mode instead of the song detail page:

**Before:**
```typescript
const handleClick = () => {
  if (isLocked) {
    navigate("/subscription");
    return;
  }
  navigate(`/song/${song.id}`);  // Goes to detail page
};
```

**After:**
```typescript
const handleClick = () => {
  if (isLocked) {
    navigate("/subscription");
    return;
  }
  setCurrentSong(song);  // Set the song in the audio store
  navigate(`/training/${song.id}`);  // Go directly to training
};
```

This change affects all three SongCard variants:
- **Default** - Used in Library grid
- **Compact** - Used in lists
- **Featured** - Used in carousels/highlights

---

## Components Already Using Direct Navigation

The **ContinuePractice** component on the Home page already navigates directly to training mode. This change makes the behavior consistent across the app.

---

## Optional Cleanup

The SongDetail page (`/song/:id`) will become unused after this change. We can:
- **Keep it** - In case it's needed later for a different purpose
- **Remove it** - Clean up unused code

Recommendation: Keep the route and page for now, as it provides a nice detailed view that could be useful for future features (sharing songs, viewing lyrics, etc.)

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/song/SongCard.tsx` | Update `handleClick` to navigate to `/training/${song.id}` |

---

## Expected Result

- Clicking any song card goes directly to the Training Mode
- Locked (premium) songs still redirect to subscription page
- The audio store is set with the selected song before navigating
- Faster, more streamlined user experience
- One less tap/click to start practicing

