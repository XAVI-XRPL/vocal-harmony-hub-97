

# Clean Up Training Controls Button - Glass Effect

## Overview

Transform the "Training Controls" toggle button from its current gradient style to a premium frosted glass effect that matches the app's liquid glass morphism design language.

---

## Current vs New Design

```text
CURRENT BUTTON:
┌──────────────────────────────────────────┐
│  Training Controls              ▼        │  ← Gradient bg with primary/accent
│  bg-gradient-to-r from-primary/20...     │
└──────────────────────────────────────────┘

NEW BUTTON:
┌──────────────────────────────────────────┐
│  Training Controls              ▼        │  ← Frosted glass effect
│  glass-button-frosted + shimmer + glow   │  ← Matches CTA buttons
└──────────────────────────────────────────┘
```

---

## Implementation Details

### File: `src/pages/TrainingMode.tsx`

Replace the current button styling on lines 314-341 with the existing glass utility classes from the design system:

**Current inline styles:**
```typescript
className="w-full flex items-center justify-between py-2 px-3 -mx-3 rounded-xl 
  bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 
  border border-primary/30 hover:border-primary/50 
  transition-all duration-300 relative overflow-hidden group"
```

**New glass styles:**
```typescript
className="w-full flex items-center justify-between py-3 px-4 
  rounded-xl relative overflow-hidden
  glass-button-frosted glass-button-shimmer
  hover:border-primary/40 transition-all duration-300 group"
```

### Key Changes:

1. **Remove gradient background** - Replace `bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20` with `glass-button-frosted`

2. **Add shimmer animation** - Apply `glass-button-shimmer` for the light-sweep effect

3. **Remove manual shine effect** - The shimmer class already handles this, so remove the nested shine div

4. **Adjust padding** - Change from `py-2 px-3 -mx-3` to `py-3 px-4` for better touch targets

5. **Remove border override** - Let the glass-button-frosted handle the border styling

---

## Files Modified

| File | Change |
|------|--------|
| `src/pages/TrainingMode.tsx` | Update Training Controls button classes (lines 314-341) |

---

## Expected Result

- Button has a frosted glass appearance matching the app's premium aesthetic
- Subtle light-sweep shimmer animation adds visual polish
- Consistent styling with other glass buttons in the app
- Proper border and shadow effects from the design system
- Removed redundant inline shine effect

