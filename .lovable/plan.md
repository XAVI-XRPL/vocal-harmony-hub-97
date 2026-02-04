

# RVMT v2.0 Implementation Plan
## Complete Vocalist Lifestyle Ecosystem

This plan outlines the phased implementation of the comprehensive v2.0 features from your master prompt document. The implementation is organized into 6 phases to ensure each feature module is built incrementally with proper testing between phases.

---

## Current State vs. Target State

| Component | Current | Target v2.0 |
|-----------|---------|-------------|
| Pages | 13 pages | 19 pages (+6 new) |
| Navigation tabs | 5 (Library, Playlists, Home, Train, Progress) | 5 (Library, Playlists, Home, **Hub**, Progress) |
| Mock data files | 1 (mockSongs) | 7 (+6 new) |
| Zustand stores | 3 (audio, user, ui) | 4 (+storeCartStore) |
| Database tables | 7 tables | 13 tables (+6 new) |
| Component directories | Standard | +5 new (store/, medical/, stage-prep/, hub/, home/) |

---

## Phase 1: Foundation & Navigation Updates
**Estimated effort: 1 session**

### 1.1 Copy Reference Document
- Save `RVMT_Lovable_Prompt_v2.md` to project docs folder for persistent reference

### 1.2 Update Navigation
- **MobileNav.tsx**: Replace "Train" tab (Mic2 icon) with "Hub" tab (LayoutGrid or diamond icon)
- **DesktopSidebar.tsx**: Add "TOOLKIT" section below existing nav with 3 new items:
  - Vocal Rider Store
  - Vocal Health
  - Stage Prep

### 1.3 Create Hub Gateway Page
- **New file: `src/pages/Hub.tsx`**
- 3 large tappable glass cards with module-specific accent colors:
  - Vocal Rider Store (Warm Gold #D4A574)
  - Vocal Health (Medical Red #EF4444)
  - Stage Prep (Electric Cyan #22D3EE)
- Framer Motion `whileTap={{ scale: 0.97 }}` animations

### 1.4 Add Hub Component
- **New file: `src/components/hub/HubCard.tsx`**
- Reusable gateway card with icon, title, description, and colored glow

### 1.5 Update App Routes
- Add `/hub` route to App.tsx
- Update Training nav to point to Library (training route already exists)

### Files to create:
- `src/pages/Hub.tsx`
- `src/components/hub/HubCard.tsx`

### Files to modify:
- `src/App.tsx` (add Hub route)
- `src/components/layout/MobileNav.tsx` (replace Train with Hub)
- `src/components/layout/DesktopSidebar.tsx` (add TOOLKIT section)

---

## Phase 2: Mock Data & Type Definitions
**Estimated effort: 1 session**

### 2.1 Extend Type Definitions
Add to `src/types/index.ts`:
- `Product` interface (store products)
- `Doctor` interface (medical providers)
- `City` interface (map cities)
- `Venue` interface (stadiums/arenas)
- `PartnerBrand` interface
- `GearProduct` interface
- `ChecklistItem` interface

### 2.2 Create Mock Data Files
- `src/data/mockCities.ts` - 13 major US cities with SVG coordinates
- `src/data/mockDoctors.ts` - 15 medical providers across cities
- `src/data/mockVenues.ts` - 30+ stadiums/arenas
- `src/data/mockProducts.ts` - 14 vocal care products
- `src/data/mockBrands.ts` - 7 partner brands + gear products
- `src/data/mockChecklist.ts` - 8 pre-show checklist items

### Files to create:
- `src/data/mockCities.ts`
- `src/data/mockDoctors.ts`
- `src/data/mockVenues.ts`
- `src/data/mockProducts.ts`
- `src/data/mockBrands.ts`
- `src/data/mockChecklist.ts`

### Files to modify:
- `src/types/index.ts`

---

## Phase 3: Vocal Rider Store
**Estimated effort: 2 sessions**

### 3.1 Create Store Components
- `src/components/store/ProductCard.tsx` - Warm gold glass card with category badge, price
- `src/components/store/ProductGrid.tsx` - Responsive 2-column grid
- `src/components/store/DressingRoomHero.tsx` - CSS/SVG illustrated vanity mirror scene
- `src/components/store/CategoryFilter.tsx` - Horizontal pill filter (All, Throat Care, Hydration, etc.)

### 3.2 Add Dressing Room Theme Styles
Update `src/index.css`:
```css
.dressing-room-bg { /* warm dark wood gradient */ }
.dressing-room-card { /* warm tinted glass */ }
```

### 3.3 Create Store Pages
- `src/pages/VocalRiderStore.tsx` - Full store with hero, filters, product grid
- `src/pages/ProductDetail.tsx` - Individual product view (optional, can use affiliate links)

### 3.4 Add Store Routes
Update App.tsx with:
- `/store`
- `/store/:productId`

### Files to create:
- `src/pages/VocalRiderStore.tsx`
- `src/pages/ProductDetail.tsx`
- `src/components/store/ProductCard.tsx`
- `src/components/store/ProductGrid.tsx`
- `src/components/store/DressingRoomHero.tsx`
- `src/components/store/CategoryFilter.tsx`

### Files to modify:
- `src/App.tsx`
- `src/index.css`

---

## Phase 4: Vocal Health Directory
**Estimated effort: 2 sessions**

### 4.1 Create Medical Components
- `src/components/medical/USAMap.tsx` - Inline SVG map with tappable city dots
- `src/components/medical/CityMarker.tsx` - Animated glowing dot component
- `src/components/medical/DoctorCard.tsx` - Provider card with red accent border
- `src/components/medical/DoctorList.tsx` - Scrollable list of filtered doctors
- `src/components/medical/VenueCard.tsx` - Stadium/venue card
- `src/components/medical/VenueList.tsx` - Horizontal venue scroll
- `src/components/medical/EMTBadge.tsx` - Red cross medical icon (sm/md/lg sizes)
- `src/components/medical/CityDrawer.tsx` - Content section for selected city

### 4.2 Create Medical Pages
- `src/pages/VocalHealth.tsx` - Interactive map + doctor/venue lists
- `src/pages/DoctorProfile.tsx` - Individual doctor profile

### 4.3 Add Routes
- `/vocal-health`
- `/vocal-health/doctor/:doctorId`

### Technical: USA Map SVG
Use a simplified continental US outline as a single `<path>` element with city markers positioned at approximate coordinates. No external library needed.

### Files to create:
- `src/pages/VocalHealth.tsx`
- `src/pages/DoctorProfile.tsx`
- `src/components/medical/USAMap.tsx`
- `src/components/medical/CityMarker.tsx`
- `src/components/medical/DoctorCard.tsx`
- `src/components/medical/DoctorList.tsx`
- `src/components/medical/VenueCard.tsx`
- `src/components/medical/VenueList.tsx`
- `src/components/medical/EMTBadge.tsx`
- `src/components/medical/CityDrawer.tsx`

---

## Phase 5: Stage Prep Module
**Estimated effort: 2 sessions**

### 5.1 Create Stage Prep Components
- `src/components/stage-prep/IEMShowcase.tsx` - Large swipeable IEM product cards
- `src/components/stage-prep/GearCard.tsx` - Equipment card with partner badge
- `src/components/stage-prep/GearGrid.tsx` - Grid of gear products
- `src/components/stage-prep/PartnerBadge.tsx` - "X% OFF" ribbon badge
- `src/components/stage-prep/DiscountReveal.tsx` - Tap-to-reveal discount code
- `src/components/stage-prep/PrepChecklist.tsx` - Interactive checklist with animations
- `src/components/stage-prep/PrepChecklistItem.tsx` - Single item with checkbox animation

### 5.2 Create Checklist Persistence Hook
- `src/hooks/usePrepChecklist.ts` - LocalStorage for demo mode, Supabase for auth users

### 5.3 Create Stage Prep Page
- `src/pages/StagePrep.tsx` - IEM showcase, gear grid, pre-show checklist

### 5.4 Add Route
- `/stage-prep`

### Files to create:
- `src/pages/StagePrep.tsx`
- `src/components/stage-prep/IEMShowcase.tsx`
- `src/components/stage-prep/GearCard.tsx`
- `src/components/stage-prep/GearGrid.tsx`
- `src/components/stage-prep/PartnerBadge.tsx`
- `src/components/stage-prep/DiscountReveal.tsx`
- `src/components/stage-prep/PrepChecklist.tsx`
- `src/components/stage-prep/PrepChecklistItem.tsx`
- `src/hooks/usePrepChecklist.ts`

---

## Phase 6: Home Page Updates & Integration
**Estimated effort: 1 session**

### 6.1 Create Home Preview Components
- `src/components/home/FeaturedGearPreview.tsx` - Horizontal scroll of 2-3 IEM products
- `src/components/home/VocalRiderPicks.tsx` - 3-4 store product thumbnails
- `src/components/home/VocalHealthCTA.tsx` - Single glass CTA card with EMT cross

### 6.2 Update Home Page Layout
Modify `src/pages/Home.tsx` to add below "Continue Practice":
1. "Prep for the Stage" - FeaturedGearPreview
2. "Dressing Room Essentials" - VocalRiderPicks
3. "Vocal Health" - VocalHealthCTA

### 6.3 Horizontal Scroll Styling
Add to index.css:
```css
.horizontal-scroll {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.horizontal-scroll > * {
  scroll-snap-align: start;
}
```

### Files to create:
- `src/components/home/FeaturedGearPreview.tsx`
- `src/components/home/VocalRiderPicks.tsx`
- `src/components/home/VocalHealthCTA.tsx`

### Files to modify:
- `src/pages/Home.tsx`
- `src/index.css`

---

## Phase 7 (Future): Database Tables & React Query Hooks
**Estimated effort: 2 sessions**

When ready to move from mock data to real database:

### 7.1 Create Database Tables
- `products` - Store products with RLS (public read)
- `medical_providers` - Doctors with RLS (public read)
- `cities` - City coordinates (public read)
- `venues` - Stadiums/arenas (public read)
- `partner_brands` - Gear brands (public read)
- `gear_products` - IEMs/mics (public read)
- `prep_checklists` - User checklists with RLS (user-owned)

### 7.2 Create React Query Hooks
- `src/hooks/useProducts.ts`
- `src/hooks/useDoctors.ts`
- `src/hooks/useVenues.ts`
- `src/hooks/useCities.ts`
- `src/hooks/useGear.ts`
- `src/hooks/usePartnerBrands.ts`

### 7.3 Seed Database
Migrate mock data to Supabase tables

---

## Design System Extensions

### New Module Accent Colors
| Module | Accent | Hex | CSS Variable |
|--------|--------|-----|--------------|
| Vocal Rider Store | Warm Gold | #D4A574 | `--accent-store` |
| Vocal Health | Medical Red | #EF4444 | `--accent-medical` |
| Stage Prep | Electric Cyan | #22D3EE | `--accent-gear` |

### New CSS Classes to Add
```css
/* Store dressing room theme */
.dressing-room-bg { ... }
.dressing-room-card { ... }

/* Medical directory */
.medical-card { border-left: 3px solid var(--accent-medical); }
.emt-badge { ... }

/* Stage prep */
.partner-badge { ... }
.discount-reveal { ... }
```

---

## Implementation Order Summary

```text
Phase 1: Navigation + Hub Page
    |
    v
Phase 2: Types + Mock Data
    |
    v
Phase 3: Vocal Rider Store
    |
    v
Phase 4: Vocal Health Directory
    |
    v
Phase 5: Stage Prep Module
    |
    v
Phase 6: Home Page Integration
    |
    v
Phase 7: Database Migration (Future)
```

---

## Total New Files Summary

| Category | Count | Key Files |
|----------|-------|-----------|
| Pages | 6 | Hub, VocalRiderStore, ProductDetail, VocalHealth, DoctorProfile, StagePrep |
| Store Components | 4 | ProductCard, ProductGrid, DressingRoomHero, CategoryFilter |
| Medical Components | 8 | USAMap, CityMarker, DoctorCard, DoctorList, VenueCard, VenueList, EMTBadge, CityDrawer |
| Stage Prep Components | 7 | IEMShowcase, GearCard, GearGrid, PartnerBadge, DiscountReveal, PrepChecklist, PrepChecklistItem |
| Home Components | 3 | FeaturedGearPreview, VocalRiderPicks, VocalHealthCTA |
| Hub Components | 1 | HubCard |
| Mock Data | 6 | mockCities, mockDoctors, mockVenues, mockProducts, mockBrands, mockChecklist |
| Hooks | 2 | usePrepChecklist, (future: 6 React Query hooks) |
| **Total** | **37** | |

---

## Notes

- All new features use mock data initially - fully functional in demo mode
- Existing audio engine, training mode, and auth remain unchanged
- Mobile-first responsive design for all new pages
- Framer Motion animations throughout
- All affiliate links point to `#` in Phase 1 (can be updated later)

