
# Interactive USA State Map for Vocal Health Directory

## Overview
This plan replaces the current simplified city-marker-based USA map with a full interactive inline SVG map featuring all 48 contiguous US states + Hawaii + DC (50 entries total). The new map follows the Stadium Blue glassmorphism design system and enables state-based doctor/provider filtering.

## Current State Analysis

### What Exists Now
- **`USAMap.tsx`**: A simplified outline with city dot markers (using a basic viewBox of `0 0 100 62`)
- **`CityMarker.tsx`**: Individual city dots that can be selected
- **`mockCities.ts`**: 13 major cities with coordinates for the current simplified map
- **`VocalHealth.tsx`**: Page using city-based filtering with `mockDoctors` and `mockVenues`
- **`useMedicalProviders.ts`**: Hook querying by `cityId` from database

### What the Prompt Specifies
- Full inline SVG with all 50 state paths (Albers USA projection, `viewBox="0 0 960 620"`)
- State-based selection instead of city-based
- Stadium Blue color scheme: `#5BA3D9` default, `#4FC3F7` hover, `#14b8a6` selected, `#f59e0b` search match
- Search functionality to highlight matching states by name/abbreviation/region
- Floating tooltip on hover showing state name and region
- State abbreviation labels centered on each state

## Implementation Strategy

### Phase 1: Create State Data File

Create `src/data/usStateData.ts` with all 50 state entries:

```text
Structure per state:
+---------------+------------------------------------------+
| Field         | Description                              |
+---------------+------------------------------------------+
| id            | FIPS code (2-digit, e.g., "01" = AL)     |
| name          | Full state name                          |
| abbr          | 2-letter abbreviation                    |
| region        | Geographic region (Southeast, etc.)      |
| cx, cy        | Label position (SVG coordinates)         |
| d             | SVG path data (Albers USA projection)    |
+---------------+------------------------------------------+
```

All 50 entries are provided in the uploaded prompt document. This includes:
- 48 contiguous states
- Hawaii (inset positioned)
- District of Columbia
- NO Alaska (excluded per spec)

### Phase 2: Create New Map Component

Replace `src/components/medical/USAMap.tsx` with a state-based interactive map:

**Features:**
1. **State paths**: Render all 50 state `<path>` elements
2. **Hover effects**: Lighter blue fill (`#4FC3F7`) on mouse enter
3. **Selection**: Teal fill (`#14b8a6`) with subtle glow on click
4. **Search highlighting**: Amber fill (`#f59e0b`) for states matching search query
5. **State labels**: 2-letter abbreviations centered on each state
6. **Floating tooltip**: Shows full state name + region on hover
7. **Small state handling**: Smaller font for tiny states (CT, DE, DC, MA, MD, NH, NJ, RI, VT)

**Props interface:**
```typescript
interface USAMapProps {
  selectedState: StateData | null;
  onStateSelect: (state: StateData) => void;
  searchQuery?: string;
}
```

### Phase 3: Update VocalHealth.tsx

Modify the page to use state-based selection:

| Change | Before | After |
|--------|--------|-------|
| Selection type | City object | State object (FIPS code) |
| Filter key | `cityId` | `state_fips` |
| Search bar | Not functional | Filters states by name/abbr/region |
| Empty state | "Select a city..." | "Select a state..." |

**Updated flow:**
1. User searches or taps a state on the map
2. Selected state turns teal with glow
3. Page shows state header card with name, region, clear button
4. Doctor cards filter by `state_fips` matching the FIPS code
5. Loading shimmer while fetching providers

### Phase 4: Database Schema Consideration

The current `medical_providers` table uses `city_id`. The prompt suggests `state_fips` for state-based filtering.

**Options:**
- **Option A**: Add `state_fips` column to existing table (allows both city and state filtering)
- **Option B**: Keep existing structure, derive state from city relationship

I recommend **Option A** for future flexibility. Migration will add:
```sql
ALTER TABLE medical_providers ADD COLUMN state_fips TEXT;
CREATE INDEX idx_medical_providers_state ON medical_providers(state_fips);
```

### Phase 5: Add CSS Variables for Map Colors

Add to `src/index.css`:
```css
/* Map-specific colors */
--map-fill: 201 68% 59%;           /* #5BA3D9 */
--map-fill-hover: 197 93% 63%;     /* #4FC3F7 */
--map-fill-selected: 168 76% 39%;  /* #14b8a6 */
--map-fill-search: 38 92% 50%;     /* #f59e0b */
--map-stroke: 0 0% 100% / 0.65;
--map-stroke-hover: 0 0% 100% / 0.9;
```

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/data/usStateData.ts` | Create | 50 state entries with SVG path data |
| `src/components/medical/USAMap.tsx` | Replace | Full interactive state map component |
| `src/pages/VocalHealth.tsx` | Modify | State-based selection, search bar |
| `src/index.css` | Modify | Add map color variables |
| `src/types/index.ts` | Modify | Add StateData interface or import |
| Database migration | Create | Add state_fips column (optional) |

## Visual Design Spec

```text
+--------------------------------------------------+
|  Vocal Health                                    |
|  Find ENT & Vocal Specialists Near You           |
+--------------------------------------------------+
|  [Search by state, abbreviation, or region...]   |
+--------------------------------------------------+
|                                                  |
|       +----------------------------------+       |
|       |                                  |       |
|       |     [Interactive USA Map]        |       |
|       |     - States filled blue         |       |
|       |     - White borders              |       |
|       |     - State abbreviations        |       |
|       |     - Hover: lighter blue        |       |
|       |     - Selected: teal glow        |       |
|       |                                  |       |
|       +----------------------------------+       |
|                                                  |
|  [Selected State Card - California, West]        |
+--------------------------------------------------+
|  Vocal Specialists (3)                           |
|  +----------------------------------------------+|
|  | Dr. Sarah Chen, MD                    ★ 4.9  ||
|  | Laryngologist / ENT                          ||
|  | Downtown Medical Center · Los Angeles        ||
|  | [Call] [Book]                                ||
|  +----------------------------------------------+|
+--------------------------------------------------+
```

## Preserved Functionality

- **EMT Badge** in header stays
- **Medical gradient background** (`medical-bg` class) stays
- **Doctor cards** keep existing styling with medical red left border
- **Glassmorphism cards** maintain current aesthetic
- **Mobile responsive** with touch-friendly tap targets

## Testing Checklist

1. Verify all 50 states render correctly with proper paths
2. Test hover state changes color to lighter blue
3. Test click selects state and turns teal with glow
4. Test search filters states by name, abbreviation, or region (amber highlight)
5. Verify state labels are readable on all states
6. Test clear selection button resets map
7. Verify doctor list filters by selected state
8. Test on mobile viewport for touch interactions
9. Verify dark/light mode compatibility
