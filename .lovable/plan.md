

## Add Cover Art for Testify Version 2 Exercise

### What's Changing
Replace the placeholder Unsplash stock photo for the "12. TESTIFY (VERSION 2)" exercise with the uploaded custom cover art (studio microphone image).

### Steps

1. **Copy the image** to `public/images/exercises/testify-v2-cover.png` (matching the pattern used by other exercises like `testify-cover.png`, `throwback-cover.png`, `dont-leave-cover.png`)

2. **Update the database** to point to the local image instead of the Unsplash URL:

```sql
UPDATE songs 
SET cover_art = '/images/exercises/testify-v2-cover.png' 
WHERE id = 'testify-v2';
```

No code changes needed -- the app already reads `cover_art` from the database and renders it dynamically.

