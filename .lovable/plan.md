

# Add Stadium Image Background to Home Page

## Overview

Add the uploaded stadium image as a background specifically for the Home page, while keeping the existing animated `StadiumBackground` effects layered on top to maintain the cinematic atmosphere.

---

## Implementation Approach

The stadium image shows a dramatic concert venue with rows of seats, stage lights at the top, and atmospheric fog - perfectly matching the app's vocal training theme. I'll add this as a background image layer on the Home page.

---

## Technical Implementation

### Step 1: Copy Image to Project

Copy the uploaded image to the assets folder:
- **Source**: `user-uploads://image-9.png`
- **Destination**: `src/assets/stadium-background.png`

### Step 2: Update Home Page

**File: `src/pages/Home.tsx`**

| Change | Details |
|--------|---------|
| Import image | Add `import stadiumBg from "@/assets/stadium-background.png"` |
| Add background layer | Add an absolute-positioned image behind the content |
| Add overlay gradient | Add a dark overlay for text readability |

### Structure

```text
<div className="min-h-screen relative">
  {/* Stadium Background Image */}
  <div className="absolute inset-0 z-0">
    <img src={stadiumBg} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
  </div>
  
  {/* Existing Content (with z-10 for layering) */}
  <Header />
  <motion.div className="relative z-10 ...">
    ...existing content...
  </motion.div>
</div>
```

---

## Design Considerations

### Overlay Gradient

A gradient overlay ensures:
- Text remains readable against the detailed image
- The glass-morphism cards maintain their visual impact
- Smooth transition with the existing UI elements

### Layering Order

```text
z-0   : Stadium image + overlay
z-10  : Main content (Header, cards, buttons)
```

### Responsive Behavior

- **Mobile**: Image fills screen with `object-cover` for full-bleed effect
- **Desktop**: Same behavior, ensuring the atmospheric lights and stadium depth are visible

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/assets/stadium-background.png` | Copy uploaded image here |
| `src/pages/Home.tsx` | Import image and add background layer with overlay |

---

## Expected Result

The Home page will feature the dramatic stadium image as its background, with:
- Atmospheric concert lighting visible at the top
- Stadium seating adding depth and context
- Fog effects matching the existing animated particles
- Dark gradient overlay maintaining text readability
- All existing UI elements (cards, buttons, progress diagram) remaining fully visible and functional

