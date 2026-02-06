
# Add Library Background Image

## What Changes

Add the uploaded acoustic foam studio wall image as the thematic background for the Library page, following the same pattern used by other page backgrounds (Stadium, Studio, Records Wall, Vocal Notes Desk).

## Steps

### 1. Copy image to assets

Copy `user-uploads://image-23.png` to `src/assets/library-background.png`

Using `src/assets/` (not `public/`) because background components import images as ES6 modules (matching the pattern in `StudioBackground.tsx`, `RecordsWallBackground.tsx`, etc.).

### 2. Create `LibraryBackground` component

**New file: `src/components/layout/LibraryBackground.tsx`**

Follow the exact pattern from `StudioBackground.tsx`:
- Fixed position, full-screen, `-z-10`
- `object-cover` image with `animate-slow-zoom` (30-second subtle zoom)
- Dark overlay (`bg-background/50`) for card readability
- Gradient overlay from top/bottom for color blending

### 3. Add background to Library page

**Modified: `src/pages/Library.tsx`**

Import and render `<LibraryBackground />` at the top of the page, similar to how other pages use their themed backgrounds.

## Files

| Action | File |
|--------|------|
| Copy | `src/assets/library-background.png` |
| Create | `src/components/layout/LibraryBackground.tsx` |
| Modify | `src/pages/Library.tsx` (add background import + render) |
