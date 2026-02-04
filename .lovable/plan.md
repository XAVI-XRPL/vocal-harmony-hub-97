
# Home Screen Simplification Plan

## Overview
Simplify the Home screen by removing the current horizontal preview sections and replacing them with 3 clean navigation cards that link to the Hub modules. The "Start Training" button will be enhanced with more 3D effects, and the stats cards will be removed.

## Current State
- Hero section with "Start Training" button
- 2 stats cards (Songs Practiced, Training Time)
- ContinuePractice section
- FeaturedGearPreview section (horizontal scroll)
- VocalRiderPicks section (grid of products)
- VocalHealthCTA section (custom card)
- Subscription CTA for non-authenticated users

## Target State
- Hero section with enhanced 3D "Start Training" button
- 3 clean Hub module cards (Vocal Rider Store, Vocal Health, Stage Prep)
- ContinuePractice section (keep)
- Subscription CTA for non-authenticated users (keep)

---

## Implementation Steps

### Step 1: Create New HomeHubCards Component
Create a new component `src/components/home/HomeHubCards.tsx` that displays 3 clean navigation cards using the same icons from the Hub page:
- **Vocal Rider Store** - ShoppingBag icon, gold accent
- **Vocal Health** - Stethoscope icon, red accent
- **Stage Prep** - Headphones icon, cyan accent

The cards will:
- Use the existing `hub-accent-*` CSS classes for consistent styling
- Be arranged in a single column with consistent spacing
- Have glass-card styling with subtle hover effects
- Navigate to their respective routes on click

### Step 2: Enhance Start Training Button
Modify the "Start Training" button in `Home.tsx` to have more pronounced 3D effects:
- Add deeper shadow layers for depth
- Add a subtle border highlight on top edge
- Increase the glow pulse intensity
- Add transform perspective for 3D appearance
- Larger padding and more visual weight

### Step 3: Update Home.tsx Layout
Modify `src/pages/Home.tsx`:
- Remove the Quick Stats section (TrendingUp/Clock cards)
- Remove FeaturedGearPreview import and section
- Remove VocalRiderPicks import and section  
- Remove VocalHealthCTA import and section
- Add new HomeHubCards component below the Start Training button
- Keep ContinuePractice section
- Keep subscription CTA for non-authenticated users
- Clean up unused imports (TrendingUp, Clock)

---

## Technical Details

### HomeHubCards Component Structure
```text
+----------------------------------+
|  [ShoppingBag]  Vocal Rider Store|
|  Curated products...          > |
+----------------------------------+
|  [Stethoscope]  Vocal Health     |
|  Find ENT doctors...          > |
+----------------------------------+
|  [Headphones]   Stage Prep       |
|  IEMs, gear, checklists...    > |
+----------------------------------+
```

### Enhanced Button Styling
The 3D button effect will use:
- Multiple layered box-shadows for depth
- Top border highlight (inset)
- Perspective transform on hover
- Enhanced glow pulse animation
- Slightly larger scale on press feedback

### Files to Modify
1. `src/components/home/HomeHubCards.tsx` (new file)
2. `src/pages/Home.tsx` (remove stats, previews; add hub cards; enhance button)

### Files to Keep (no changes needed)
- `src/components/home/ContinuePractice.tsx`
- `src/components/ui/glass-card.tsx`
- `src/components/ui/glass-button.tsx`
- `src/index.css` (hub accent classes already exist)
