
# Add Cinematic Backgrounds to Vocal Health and Stage Prep Pages

## Overview
Add the uploaded images as themed backgrounds for two pages:
- **Image 1** (honey tea / vocal booth) --> Vocal Health page
- **Image 2** (mic on stage) --> Stage Prep page

Both will follow the same pattern used by existing background components (slow-zoom animation, dark overlays for readability).

## Steps

### 1. Copy uploaded images into the project
- Copy `user-uploads://image-26.png` to `src/assets/vocal-health-bg.png`
- Copy `user-uploads://image-27.png` to `src/assets/stage-prep-bg.png`

### 2. Create `src/components/layout/VocalHealthBackground.tsx`
A new background component following the same pattern as `VocalNotesDeskBackground`:
- Full-screen fixed image with `object-cover` and `animate-slow-zoom`
- Dark overlay at ~35% opacity to keep it subtle and not too bright
- Gradient overlay from top to bottom for readability

### 3. Create `src/components/layout/StagePrepBackground.tsx`
Same pattern as above, using the stage mic image.

### 4. Update `src/pages/VocalHealth.tsx`
- Import and use the new `VocalHealthBackground` component
- Replace the existing `<div className="fixed inset-0 medical-bg" />` and its overlay div with the new background component

### 5. Update `src/pages/StagePrep.tsx`
- Import and use the new `StagePrepBackground` component
- Replace the existing `<div className="fixed inset-0 backstage-bg" />` and its overlay div with the new background component

## Technical Details

Each background component will render:
```
<div className="fixed inset-0 -z-10 overflow-hidden">
  <img src={bg} className="absolute inset-0 w-full h-full object-cover animate-slow-zoom" />
  <div className="absolute inset-0 bg-background/35" />
  <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
</div>
```

The pages will swap their inline background divs for these components, keeping the content `z-10` layer unchanged.
