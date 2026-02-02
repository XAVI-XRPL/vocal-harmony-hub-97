

# Desktop Experience: Premium Vocal Coach OS with Sidebar Navigation

## Overview

Transform the RMVT app from a mobile-first layout to a responsive design that provides a premium "Vocal Coach OS" desktop experience featuring a collapsible glass-morphism sidebar while maintaining the existing mobile navigation.

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  DESKTOP (≥768px)                                                       │
├───────────────┬─────────────────────────────────────────────────────────┤
│               │                                                         │
│   SIDEBAR     │              MAIN CONTENT AREA                          │
│   ┌───────┐   │   ┌─────────────────────────────────────────────────┐   │
│   │ RMVT  │   │   │  Header (search, notifications, theme)         │   │
│   │ Logo  │   │   ├─────────────────────────────────────────────────┤   │
│   ├───────┤   │   │                                                 │   │
│   │ Home  │◄──│   │                                                 │   │
│   │Library│   │   │              Page Content                       │   │
│   │Progress   │   │                                                 │   │
│   │ Train │   │   │                                                 │   │
│   │Profile│   │   │                                                 │   │
│   ├───────┤   │   │                                                 │   │
│   │       │   │   │                                                 │   │
│   │ Pro   │   │   └─────────────────────────────────────────────────┘   │
│   │Upgrade│   │                                                         │
│   └───────┘   │                                                         │
│               │                                                         │
└───────────────┴─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  MOBILE (<768px)                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  Header                                                         │   │
│   ├─────────────────────────────────────────────────────────────────┤   │
│   │                                                                 │   │
│   │                      Page Content                               │   │
│   │                                                                 │   │
│   │                                                                 │   │
│   ├─────────────────────────────────────────────────────────────────┤   │
│   │  ┌───┐ ┌───┐ ┌─────┐ ┌───┐ ┌───┐                               │   │
│   │  │Lib│ │Prg│ │Home │ │Trn│ │Pro│  ← Bottom Nav (existing)      │   │
│   │  └───┘ └───┘ └─────┘ └───┘ └───┘                               │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Design Principles

1. **Premium Glass Morphism** - Sidebar uses existing `glass-card-3d` and `nav-glass` effects
2. **Collapsible Mini Mode** - Desktop sidebar collapses to icon-only rail (48px width)
3. **Active Route Highlighting** - Gradient background with glow effect on active item
4. **Smooth Animations** - Framer Motion transitions for expand/collapse
5. **Keyboard Shortcut** - Cmd/Ctrl+B to toggle sidebar (built into shadcn sidebar)
6. **Consistent with Mobile** - Same icons, same routes, same color scheme

---

## Implementation

### 1. Create Desktop Sidebar Component

**New File: `src/components/layout/DesktopSidebar.tsx`**

A premium sidebar featuring:
- RMVT logo at top with animated glow
- Navigation items matching MobileNav (Library, Progress, Home, Train, Profile)
- Active state with gradient background and glow
- Mini mode showing icons only with tooltips
- Collapsible rail with toggle button
- "Upgrade to Pro" CTA at bottom for free users
- Glass-morphism styling using existing CSS classes

### 2. Update AppShell Component

**Modify: `src/components/layout/AppShell.tsx`**

- Wrap content in `SidebarProvider` for desktop
- Show `DesktopSidebar` on desktop (hidden on mobile via md:block)
- Keep existing `MobileNav` for mobile (hidden on desktop via md:hidden)
- Use `SidebarInset` for main content area
- Maintain existing MiniPlayer logic

### 3. Add Sidebar Glass Styles

**Modify: `src/index.css`**

Add new CSS classes:
- `.sidebar-glass` - Glass effect specifically for sidebar
- `.sidebar-nav-item-active` - Active navigation item styling with gradient and glow
- `.sidebar-divider` - Subtle glass divider between sections

### 4. Update Header for Desktop

**Modify: `src/components/layout/Header.tsx`**

- Add `SidebarTrigger` for desktop (visible on md: and up)
- Keep existing mobile menu button behavior
- Ensure header integrates smoothly with sidebar

---

## Component Details

### DesktopSidebar Features

| Feature | Implementation |
|---------|---------------|
| Logo | RMVT logo with animated glow, shows text when expanded |
| Nav Items | 5 items matching mobile: Library, Progress, Home, Train, Profile |
| Active State | Gradient background + glow shadow + bold text |
| Collapsed Mode | 48px width, icons only, tooltips on hover |
| Pro CTA | Bottom section with Crown icon, gradient border |
| Animations | Framer Motion for item hover/tap states |
| Keyboard | Cmd/Ctrl+B toggles sidebar (via shadcn) |

### Navigation Items

```text
Icon        Label       Route           Description
────────────────────────────────────────────────────
Library     Library     /library        Browse all exercises
BarChart3   Progress    /progress       View practice stats
Home        Home        /               Dashboard
Mic2        Train       /training       Start training
User        Profile     /profile        Account settings
```

---

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/layout/DesktopSidebar.tsx` | New sidebar component with glass styling |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/layout/AppShell.tsx` | Integrate sidebar provider and desktop layout |
| `src/components/layout/Header.tsx` | Add sidebar trigger for desktop |
| `src/index.css` | Add sidebar-specific glass styles |

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| < 768px (mobile) | Bottom navigation bar, no sidebar |
| ≥ 768px (tablet/desktop) | Collapsible sidebar, no bottom nav |

### Existing Components Used

- `SidebarProvider`, `Sidebar`, `SidebarContent`, `SidebarTrigger` from shadcn
- `RMVTLogo` component for branding
- `NavLink` for active route detection
- Existing glass CSS classes (`glass-card-3d`, `nav-glass`, `gradient-bg`, etc.)

---

## Premium Visual Effects

1. **Sidebar Glass** - Deep blur with subtle blue tint, matching stadium theme
2. **Active Glow** - Primary color glow on active navigation item
3. **Hover States** - Subtle background shift with smooth transitions
4. **Logo Animation** - Breathing glow effect on RMVT logo
5. **Collapse Animation** - Smooth width transition with icon centering
6. **Divider Lines** - Gradient dividers between sections

---

## Expected Result

- Desktop users see a premium, collapsible sidebar with glass styling
- Mobile users continue to use the existing bottom navigation
- Consistent visual language across all breakpoints
- Keyboard navigation support (Cmd/Ctrl+B)
- Active route highlighting matches mobile behavior
- Pro upgrade CTA visible to free users

