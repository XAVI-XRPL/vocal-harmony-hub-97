
# Vocal Rider Store: Kimad Products Integration

## Overview
Replace the current mock products with real products from Kimad Productions Store (kimadstore.com). These are curated vocal health products used by professional vocalists, including throat care items, hydration tools, essential oils, and supplements.

## Products to Implement

Based on the Kimad Store content, here are the products to add:

### Throat Care & Lozenges
1. **Grether's Pastilles Variety Pack** - Blackcurrant flavor, professional throat lozenges
2. **Grether's Pastilles Elderflower** - Premium Swiss throat pastilles
3. **Traditional Medicinals Throat Coat Lozenges** - Echinacea formula
4. **ACT Dry Mouth Lozenges** - Soothing moisturizing lozenges
5. **doTERRA On Guard Throat Drops** - Essential oil throat drops

### Hydration & Nebulizers
6. **VocalMist Portable Nebulizer** - Professional vocal hydration device
7. **VocalMist Carrying Case** - Protective case for nebulizer
8. **VocalMist Hydration Formula Refill Pack** - Saline refills
9. **Voice Straw H2O** - Vocal exercise straw (Coming Soon placeholder)

### Essential Oils (doTERRA)
10. **doTERRA On Guard Softgels** - Immune support blend
11. **doTERRA Breathe Essential Oil** - Respiratory support blend
12. **doTERRA Lavender Essential Oil** - Relaxation and wellness
13. **doTERRA Deep Blue Rub** - Muscle relief for performers
14. **doTERRA On Guard Chewable Tablets** - Immune chewables

### Teas & Honey
15. **Traditional Medicinals Throat Coat Tea** - Classic herbal throat tea
16. **Throat Coat Eucalyptus Tea** - Eucalyptus variant
17. **Yogi Tea Throat Comfort** - Licorice-based soothing tea
18. **Manuka Health Honey MGO 573+** - Premium NZ manuka honey
19. **Wedderspoon Manuka Honey Drops** - Honey lozenges variety

### Nasal & Sinus Care
20. **Ponaris Nasal Emollient** - Nasal moisturizer
21. **Alkalol Nasal Wash** - Nasal rinse solution

### Allergy & Wellness
22. **Zyrtec Allergy Tablets** - Antihistamine
23. **Allegra 24HR Non-Drowsy** - Allergy relief
24. **Claritin Non-Drowsy** - Allergy medicine
25. **Mucinex Chest Congestion** - Expectorant
26. **TUMS Antacid Chewables** - Acid reflux relief

### Recovery
27. **BEMER Therapy** - Professional recovery device (featured)

---

## Implementation Details

### 1. Update Product Categories
Expand the `ProductCategory` type to include new categories:
- `throat-care` - Lozenges, sprays, pastilles
- `hydration` - Nebulizers, steamers, straws
- `essential-oils` - doTERRA and similar products
- `tea-honey` - Teas and honey products
- `nasal-sinus` - Nasal care products
- `allergy-wellness` - OTC medications
- `accessories` - Cases, travel items

### 2. New Mock Products Data
Replace `src/data/mockProducts.ts` with Kimad store products:
- Include real Amazon affiliate links from the site
- Use product-appropriate placeholder images
- Include VocalMist and Voice Straw affiliate links with discount codes
- Mark key products as featured

### 3. Update Category Filter
Modify `CategoryFilter.tsx` to include the new categories with appropriate icons.

### 4. Enhanced Product Card
Update `ProductCard.tsx` to:
- Show discount codes when available (e.g., "Use Code RAAB10")
- Display "Coming Soon" badge for unreleased products
- Add partner brand indicator for VocalMist/doTERRA products

### 5. Store Hero Update
Update `DressingRoomHero.tsx` to reference Kimad Productions branding subtly while maintaining the RVMT aesthetic.

### 6. Home Preview Update
Update `VocalRiderPicks.tsx` to showcase featured Kimad products.

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modify | Add new product categories |
| `src/data/mockProducts.ts` | Replace | New Kimad products data |
| `src/components/store/CategoryFilter.tsx` | Modify | Add new category tabs |
| `src/components/store/ProductCard.tsx` | Modify | Add discount code display |
| `src/components/home/VocalRiderPicks.tsx` | Modify | Update featured products display |

---

## Technical Notes

### Affiliate Links
- VocalMist: `https://myvocalmist.com/?sca_ref=922`
- Voice Straw: `https://voicestraw.com/` (Code: RAAB10)
- doTERRA: `https://referral.doterra.me/6111833` (25% off)
- Amazon products: Direct Amazon links with product ASINs

### Image Strategy
Since we cannot scrape actual product images, we will use:
- High-quality stock photos from Unsplash matching product types
- Consistent image dimensions (300x300)
- Product category-appropriate imagery

### Discount Codes to Display
- **RAAB10** - Voice Straw products
- **RVMT15** - Partner discount (if applicable)
- **doTERRA 25% OFF** - First year discount

---

## UI Enhancements

### Discount Badge Component
```text
+---------------------------+
|  [Featured]               |
|  [Product Image]          |
|                           |
|  VocalMist                |
|  Portable Nebulizer       |
|  ★ 4.9 (234)              |
|  $149.99                  |
|  [Use Code: RAAB10] ←NEW  |
+---------------------------+
```

### Category Pills (Updated)
```text
[All] [Throat Care] [Hydration] [Essential Oils] [Tea & Honey] [Nasal Care] [Allergy]
```

---

## Next Steps After Approval
1. Update types with new categories
2. Create comprehensive product data file
3. Update UI components for discount codes
4. Test all affiliate links work correctly
5. Verify responsive layout with new product count
