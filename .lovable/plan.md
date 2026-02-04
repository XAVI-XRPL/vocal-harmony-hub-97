

# Home Hub Cards - Horizontal Layout with Custom Icons

## Overview
Redesign the HomeHubCards component to display 3 compact cards in a horizontal row instead of vertically stacked. Each card will feature a specific icon and color scheme, with enhanced animations for visual impact.

## Design Changes

### Card Layout
- Change from vertical column to horizontal row (3 cards side by side)
- Each card will be a compact square/tile with centered icon
- Title only (remove descriptions for cleaner look)
- Equal width distribution using CSS grid

### Icon and Color Scheme
| Card | Icon | Color |
|------|------|-------|
| Vocal Rider Store | Mic | Green (#22c55e / emerald) |
| Vocal Health | Stethoscope | Red (#ef4444) |
| Stage Prep | Headphones | Teal (#14b8a6 / teal) |

### Animation Enhancements
- Staggered entrance animation with scale + fade
- Hover: lift effect with glow pulse in card's accent color
- Active: subtle press feedback
- Continuous subtle icon pulse animation

## Technical Implementation

### File to Modify
`src/components/home/HomeHubCards.tsx`

### Component Structure
```text
+--------+  +--------+  +--------+
|  [Mic] |  [Steth] |  [Head]  |
|        |  |        |  |        |
| Store  |  | Health |  | Prep   |
+--------+  +--------+  +--------+
   Green       Red        Teal
```

### Key Changes
1. Update container from `flex-col` to `grid grid-cols-3` with gap
2. Replace ShoppingBag icon with Mic icon from Lucide
3. Add custom color classes for green, red, and teal accents
4. Restructure card content to be vertically centered with icon on top, title below
5. Remove ChevronRight arrow and description text
6. Add pulsing glow animation on hover
7. Use inline styles for custom accent colors per card

### Animation Details
- Container: staggered entrance with 0.1s delay between cards
- Cards: scale from 0.8 to 1 with opacity fade
- Hover: translateY(-4px) with shadow glow in accent color
- Icon: subtle bounce animation on hover
