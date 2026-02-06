

# Swap Exercise Cover Art Images

## What Changes

Replace the current stock/placeholder cover images for 3 exercises with the uploaded custom artwork. The 4th exercise (12. TESTIFY V2) will be updated once you upload its cover image.

## Image Mapping

| Exercise | Uploaded Image | Description |
|----------|---------------|-------------|
| 1. TESTIFY EXERCISE | image-20.png | Studio microphone, blue tones |
| 2. THROWBACK EXERCISE | image-21.png | Cassette tape, headphones, whiskey |
| 3. DONT LEAVE EXERCISE | image-22.png | Desert, Leaning Tower of Pisa |
| 12. TESTIFY (VERSION 2) | Waiting for upload | Will show with lock overlay in demo mode |

## Steps

### 1. Copy images to public folder

Copy the 3 uploaded images to `public/images/exercises/`:
- `user-uploads://image-20.png` -> `public/images/exercises/testify-cover.png`
- `user-uploads://image-21.png` -> `public/images/exercises/throwback-cover.png`
- `user-uploads://image-22.png` -> `public/images/exercises/dont-leave-cover.png`

Using `public/` instead of `src/assets/` because `cover_art` is stored as a URL in the database and rendered dynamically -- it needs a stable, predictable URL path.

### 2. Update database cover_art URLs

Update the `songs` table to point to the new local images:

```sql
UPDATE songs SET cover_art = '/images/exercises/testify-cover.png' WHERE id = 'testify-exercise';
UPDATE songs SET cover_art = '/images/exercises/throwback-cover.png' WHERE id = 'throwback-exercise';
UPDATE songs SET cover_art = '/images/exercises/dont-leave-cover.png' WHERE id = 'dont-leave-exercise';
```

### 3. No code changes needed

The `SongCard` component already renders `song.coverArt` as an `<img src>`. The lock overlay for Testify V2 is already implemented from the previous change. Once you upload the V2 cover image, we'll add it the same way.

## Files

| Action | Path |
|--------|------|
| Copy | `public/images/exercises/testify-cover.png` |
| Copy | `public/images/exercises/throwback-cover.png` |
| Copy | `public/images/exercises/dont-leave-cover.png` |
| Database update | 3 UPDATE statements on `songs.cover_art` |

