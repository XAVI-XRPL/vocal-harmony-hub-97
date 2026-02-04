
# Phase 7: Database Migration & Pull-to-Refresh Implementation

## Overview
This plan migrates the remaining mock data to the database and adds pull-to-refresh functionality to the Home page. The database already has several tables seeded (partner_brands, cities, venues), but products, gear_products, medical_providers, and checklist_items still need to be populated.

---

## Part 1: Database Schema Updates

### 1.1 Update Product Category Enum
The current `product_category` enum supports: `throat-care`, `hydration`, `vitamins`, `accessories`, `apparel`

The Kimad products require: `throat-care`, `hydration`, `essential-oils`, `tea-honey`, `nasal-sinus`, `allergy-wellness`, `accessories`

**Action:** Add missing enum values via migration:
```sql
ALTER TYPE product_category ADD VALUE 'essential-oils';
ALTER TYPE product_category ADD VALUE 'tea-honey';
ALTER TYPE product_category ADD VALUE 'nasal-sinus';
ALTER TYPE product_category ADD VALUE 'allergy-wellness';
```

### 1.2 Add Missing Columns to Products Table
The mock data includes fields not present in the database:
- `discount_code` (text, nullable)
- `is_coming_soon` (boolean, default false)
- `is_partner_brand` (boolean, default false)

**Action:** Add columns via migration:
```sql
ALTER TABLE products ADD COLUMN discount_code text;
ALTER TABLE products ADD COLUMN is_coming_soon boolean DEFAULT false;
ALTER TABLE products ADD COLUMN is_partner_brand boolean DEFAULT false;
```

---

## Part 2: Seed Database Tables

### 2.1 Seed Products Table (27 Kimad Products)
Insert all products from `mockProducts.ts` into the `products` table with proper category mapping.

### 2.2 Seed Gear Products Table (12 Products)
Insert all gear products from `mockBrands.ts` into `gear_products` table.

### 2.3 Seed Medical Providers Table (15 Doctors)
Insert all doctors from `mockDoctors.ts` into `medical_providers` table.

### 2.4 Seed Checklist Items Table (8 Items)
Insert all checklist items from `mockChecklist.ts` into `checklist_items` table.

---

## Part 3: Create Data Fetching Hooks

### 3.1 Create `useProducts` Hook
New file: `src/hooks/useProducts.ts`

```text
Hook structure:
- Fetch products from Supabase with filtering support
- Transform database snake_case to camelCase
- Support category filtering
- Include featured products helper
```

### 3.2 Create `useGearProducts` Hook
New file: `src/hooks/useGearProducts.ts`

```text
Hook structure:
- Fetch gear products from Supabase
- Join with partner_brands for brand info
- Support category filtering
```

### 3.3 Create `useMedicalProviders` Hook
New file: `src/hooks/useMedicalProviders.ts`

```text
Hook structure:
- Fetch medical providers by city
- Join with cities table for location info
```

### 3.4 Create `useChecklistItems` Hook
New file: `src/hooks/useChecklistItems.ts`

```text
Hook structure:
- Fetch checklist items from Supabase
- Include user progress tracking (if authenticated)
```

### 3.5 Create `useCities` Hook
New file: `src/hooks/useCities.ts`

```text
Hook structure:
- Fetch cities with venue/doctor counts
- Used for map markers and filtering
```

---

## Part 4: Update Components to Use Database

### 4.1 Update VocalRiderStore Page
**File:** `src/pages/VocalRiderStore.tsx`

Changes:
- Import and use `useProducts` hook instead of `mockProducts`
- Add loading state with shimmer
- Handle empty state

### 4.2 Update VocalRiderPicks Component
**File:** `src/components/home/VocalRiderPicks.tsx`

Changes:
- Use `useProducts` hook instead of importing `mockProducts`
- Add loading shimmer state

### 4.3 Update StagePrep Page
**File:** `src/pages/StagePrep.tsx`

Changes:
- Use `useGearProducts` hook instead of `mockGearProducts`
- Use `usePartnerBrands` hook instead of `mockBrands`
- Use `useChecklistItems` hook instead of `mockChecklist`

### 4.4 Update FeaturedGearPreview Component
**File:** `src/components/home/FeaturedGearPreview.tsx`

Changes:
- Use hooks for real-time data fetching

### 4.5 Update VocalHealth Page
**File:** `src/pages/VocalHealth.tsx`

Changes:
- Use `useMedicalProviders` and `useCities` hooks
- Replace mock data imports

---

## Part 5: Pull-to-Refresh Implementation

### 5.1 Create usePullToRefresh Hook
New file: `src/hooks/usePullToRefresh.ts`

```text
Features:
- Track touch/drag position
- Trigger refresh callback when pulled past threshold
- Animate pull indicator
- Disable during active refresh
```

### 5.2 Create PullToRefresh Component
New file: `src/components/ui/pull-to-refresh.tsx`

```text
UI features:
- Animated spinner/arrow indicator
- Progress bar during pull
- Smooth spring animations via framer-motion
- Haptic feedback on mobile (if available)
```

### 5.3 Integrate into Home Page
**File:** `src/pages/Home.tsx`

Changes:
- Wrap content with PullToRefresh component
- Invalidate React Query cache on refresh
- Refetch songs, products, and user stats
- Show toast notification on successful refresh

---

## Part 6: Create Partner Brands Hook

### 6.1 Create `usePartnerBrands` Hook
New file: `src/hooks/usePartnerBrands.ts`

```text
Hook structure:
- Fetch partner brands from Supabase
- Data already seeded in database
```

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/hooks/useProducts.ts` | Create | Fetch products from DB |
| `src/hooks/useGearProducts.ts` | Create | Fetch gear products from DB |
| `src/hooks/useMedicalProviders.ts` | Create | Fetch doctors from DB |
| `src/hooks/useChecklistItems.ts` | Create | Fetch checklist from DB |
| `src/hooks/useCities.ts` | Create | Fetch cities from DB |
| `src/hooks/usePartnerBrands.ts` | Create | Fetch partner brands from DB |
| `src/hooks/usePullToRefresh.ts` | Create | Pull-to-refresh logic |
| `src/components/ui/pull-to-refresh.tsx` | Create | PTR UI component |
| `src/pages/Home.tsx` | Modify | Add pull-to-refresh |
| `src/pages/VocalRiderStore.tsx` | Modify | Use hooks instead of mock |
| `src/pages/StagePrep.tsx` | Modify | Use hooks instead of mock |
| `src/components/home/VocalRiderPicks.tsx` | Modify | Use hooks |
| `src/components/home/FeaturedGearPreview.tsx` | Modify | Use hooks |

---

## Database Operations Required

### Migrations (Schema Changes)
1. Add new enum values to `product_category`
2. Add columns to `products` table

### Data Inserts
1. 27 products into `products` table
2. 12 gear products into `gear_products` table  
3. 15 medical providers into `medical_providers` table
4. 8 checklist items into `checklist_items` table

---

## Technical Notes

### React Query Cache Invalidation
The pull-to-refresh will invalidate these query keys:
- `['songs']`
- `['products']`
- `['gear-products']`
- `['partner-brands']`

### Touch Event Handling
The PullToRefresh component will:
- Use `onTouchStart`, `onTouchMove`, `onTouchEnd` events
- Calculate pull distance from touch delta
- Apply resistance curve for natural feel
- Threshold: 80px pull distance to trigger

### Loading States
All components will show:
- Skeleton shimmer during initial load
- Spinner during refresh
- Graceful empty states if no data

