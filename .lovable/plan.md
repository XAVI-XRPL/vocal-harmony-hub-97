
# Smooth Background Image Loading

## Overview
All 6 image-based background components currently render their `<img>` at full opacity immediately, causing a visible "pop-in" when the image finishes loading. The fix adds a fade-in transition triggered by the image's `onLoad` event.

## Approach
Add a `useState` + `onLoad` pattern to each background component's `<img>` tag:
- Start with `opacity: 0`
- On `onLoad`, set state to `true`
- CSS `transition: opacity 0.6s ease-in-out` handles the smooth fade

This is minimal, requires no new components or hooks, and keeps the existing architecture intact.

## Files to Modify (6 total)

### 1. `src/components/layout/LibraryBackground.tsx`
- Add `useState` for `isLoaded`
- Add `onLoad` handler to `<img>`
- Apply conditional opacity + CSS transition classes

### 2. `src/components/layout/RecordsWallBackground.tsx`
- Same pattern

### 3. `src/components/layout/StudioBackground.tsx`
- Same pattern (preserves `React.forwardRef`)

### 4. `src/components/layout/VocalNotesDeskBackground.tsx`
- Same pattern (preserves `React.forwardRef`)

### 5. `src/components/layout/VocalHealthBackground.tsx`
- Same pattern

### 6. `src/components/layout/StagePrepBackground.tsx`
- Same pattern

## Technical Detail

Each component's `<img>` tag changes from:

```tsx
<img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover animate-slow-zoom" />
```

To:

```tsx
const [isLoaded, setIsLoaded] = useState(false);

<img
  src={bg}
  alt=""
  onLoad={() => setIsLoaded(true)}
  className={`absolute inset-0 w-full h-full object-cover animate-slow-zoom transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
/>
```

No new files, no new dependencies. The `StadiumBackground` component is unaffected as it uses CSS gradients, not an image.
