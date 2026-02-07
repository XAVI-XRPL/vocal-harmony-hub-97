
# Playlists Background in Demo Mode + Hub Page Polish

## 1. Playlists Page -- Show Records Wall in Demo Mode

Currently, unauthenticated (demo) users see a plain "Sign In Required" card with no background. The `RecordsWallBackground` only renders for authenticated users because of an early return.

**File: `src/pages/Playlists.tsx`**

- Move `<RecordsWallBackground />` **above** the auth-loading and not-authenticated checks so it always renders regardless of auth state.
- Wrap the "Sign In Required" card in the same outer `<>` fragment so demo users see the premium records wall behind the sign-in prompt.

## 2. Hub Page -- Premium Polish and Legibility

**File: `src/pages/Hub.tsx`**

- Increase header text contrast: change heading from `gradient-text` to a solid `text-foreground` with a subtle `drop-shadow-lg` for crisp legibility over the background.
- Add a semi-transparent glass-card container behind the header text for extra readability.
- Increase card gap from `gap-4 md:gap-6` to `gap-5 md:gap-7` for more breathing room.

**File: `src/components/hub/HubCard.tsx`**

- Upgrade card styling to `glass-card-3d` for a more premium, raised feel with depth.
- Increase padding from `p-5` to `p-6` for a roomier, less cramped look.
- Boost title text weight/size slightly and ensure the description text uses a brighter muted color (`text-muted-foreground/90`) for better readability.
- Add a subtle text shadow to the title to ensure it pops over the background glow effects.
- Make the icon container slightly larger (`w-16 h-16`, icon `w-8 h-8`) for a bolder visual anchor.
- Increase the chevron size for clearer affordance.

## Technical Summary

| File | Change |
|------|--------|
| `src/pages/Playlists.tsx` | Move `RecordsWallBackground` before auth checks so it always renders |
| `src/pages/Hub.tsx` | Add glass header container, improve text contrast, increase card spacing |
| `src/components/hub/HubCard.tsx` | Upgrade to `glass-card-3d`, larger icons/padding, text shadows for legibility |
