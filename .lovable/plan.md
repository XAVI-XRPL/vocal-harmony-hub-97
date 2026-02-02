
# Fix Navigation Flow - Direct to Training & Back to Home

## Overview

Two changes needed to streamline the navigation:
1. The TrainingMode back button currently goes to the SongDetail page - change it to go to Home
2. Keep the `/song/:id` route but it's no longer in the main user flow

---

## Current vs New Navigation

```text
CURRENT BACK BUTTON FLOW:
Training Mode → Back → SongDetail Page (/song/:id)

NEW BACK BUTTON FLOW:
Training Mode → Back → Home Page (/)
```

---

## Changes Required

### File: `src/pages/TrainingMode.tsx`

Update the back button onClick handler on line 198:

**Before:**
```typescript
onClick={() => navigate(`/song/${song.id}`)}
```

**After:**
```typescript
onClick={() => navigate("/")}
```

---

## Summary

| File | Line | Change |
|------|------|--------|
| `src/pages/TrainingMode.tsx` | 198 | Change `navigate(`/song/${song.id}`)` to `navigate("/")` |

---

## Notes

- The `/song/:id` route remains in App.tsx as a fallback (users can still access it via direct URL)
- SongCard already navigates directly to `/training/:id` (updated in previous change)
- This makes the back button consistent with the streamlined flow

---

## Expected Result

- Clicking back from Training Mode returns to the Home page
- No more intermediate SongDetail page in the normal user flow
- Faster, cleaner navigation experience
