
# Simple Onboarding Flow with Stadium Background & Demo Mode

## Summary

Create a streamlined, visually stunning onboarding experience using the existing stadium background with animated light orbs and particles. The flow will be simple (3 slides max) and include a "Try Demo" option that allows users to explore the app without creating an account.

---

## Current State Analysis

- **Onboarding (`src/pages/Onboarding.tsx`)**: 3-slide carousel with custom gradient backgrounds, icons, and animations
- **Stadium Background (`src/components/layout/StadiumBackground.tsx`)**: Animated particle system with light orbs, sweeping beams, and fog effects
- **App Flow (`src/App.tsx`)**: Splash -> Onboarding (if first time) -> Home
- **Auth**: Uses Supabase auth with email/password login/signup
- **User Store**: Tracks `isAuthenticated`, user profile, subscription tier

---

## Design Approach

### Visual Design
- Replace the current plain gradient background with the cinematic StadiumBackground
- Add a dark overlay for text readability
- Keep the glassmorphism aesthetic consistent with the rest of the app
- Use the frosted GlassButton for CTAs

### Onboarding Slides (Simplified to 3)
1. **Welcome** - "Master Your Voice" with RVMT branding
2. **How It Works** - Show stem separation concept visually
3. **Get Started** - Options: "Create Account", "Sign In", or "Try Demo"

### Demo Mode
- Allow users to explore the app without authentication
- Demo users can access free songs only (RLS already enforces this)
- Show subtle prompts to sign up when accessing limited features
- Store demo mode state in localStorage

---

## Technical Implementation

### Phase 1: Create Demo Mode Hook

**File: `src/hooks/useDemoMode.ts`**

```typescript
import { useState, useEffect } from "react";

const DEMO_MODE_KEY = "rvmt_demo_mode";

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    setIsDemoMode(stored === "true");
    setIsLoading(false);
  }, []);

  const enableDemoMode = () => {
    localStorage.setItem(DEMO_MODE_KEY, "true");
    setIsDemoMode(true);
  };

  const disableDemoMode = () => {
    localStorage.removeItem(DEMO_MODE_KEY);
    setIsDemoMode(false);
  };

  return { isDemoMode, isLoading, enableDemoMode, disableDemoMode };
}
```

### Phase 2: Redesign Onboarding with Stadium Background

**File: `src/pages/Onboarding.tsx`** (Complete rewrite)

Key changes:
- Import and use `StadiumBackground` component
- Add dark overlay for readability (`bg-gradient-to-b from-black/50 via-black/30 to-black/70`)
- Simplify to 3 focused slides
- Add final slide with auth options:
  - "Create Account" -> Navigate to `/auth?signup=true`
  - "Sign In" -> Navigate to `/auth`
  - "Try Demo" -> Enable demo mode and proceed to home

```text
Slide Structure:

[Slide 1: Welcome]
- Large animated RVMT logo
- "Master Your Voice"
- "Professional stem-based vocal training"

[Slide 2: How It Works]  
- Visual stem bars animation
- "Control Every Layer"
- "Isolate vocals, harmonies, and instruments"

[Slide 3: Get Started]
- "Ready to Train?"
- [Create Account] (Primary frosted button)
- [Sign In] (Secondary glass button)
- [Try Demo] (Ghost link button)
```

### Phase 3: Update App Flow to Support Demo Mode

**File: `src/App.tsx`**

Modify `AppContent` to check for demo mode:
- If demo mode is enabled and onboarding complete, show the app
- Demo users skip auth but can still access free content

```typescript
const { isDemoMode, enableDemoMode } = useDemoMode();

// After splash completes:
if (isComplete) {
  // Already onboarded - show app (auth or demo)
  setShowApp(true);
} else {
  // First time - show onboarding
  setShowOnboarding(true);
}

const handleOnboardingComplete = (mode: 'auth' | 'demo') => {
  if (mode === 'demo') {
    enableDemoMode();
  }
  completeOnboarding();
  setShowOnboarding(false);
  setShowApp(true);
};
```

### Phase 4: Add Demo Mode Indicator & Upgrade Prompts

**File: `src/components/layout/DemoModeBanner.tsx`** (New)

A subtle top banner for demo mode users:
```typescript
<motion.div className="bg-primary/20 border-b border-primary/30 px-4 py-2 text-center">
  <p className="text-sm">
    <span className="text-muted-foreground">Exploring in demo mode.</span>
    <button onClick={() => navigate('/auth')} className="text-primary ml-2">
      Create account to save progress
    </button>
  </p>
</motion.div>
```

Update `AppShell.tsx` to show the banner when in demo mode.

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useDemoMode.ts` | Create | Demo mode state management |
| `src/pages/Onboarding.tsx` | Rewrite | Stadium background, simplified slides, auth options |
| `src/App.tsx` | Modify | Support demo mode flow |
| `src/components/layout/DemoModeBanner.tsx` | Create | Subtle upgrade prompt banner |
| `src/components/layout/AppShell.tsx` | Modify | Show demo banner when applicable |

---

## User Flow Diagram

```text
App Launch
    |
    v
[Splash Screen - 2.5s]
    |
    v
First Time User? ----No----> [Home Dashboard]
    |                              ^
   Yes                             |
    |                              |
    v                              |
[Onboarding Slide 1]               |
    |                              |
    v                              |
[Onboarding Slide 2]               |
    |                              |
    v                              |
[Onboarding Slide 3]               |
    |                              |
    +-- "Create Account" --> [Auth Page - Signup]
    |                              |
    +-- "Sign In" ---------> [Auth Page - Login]
    |                              |
    +-- "Try Demo" ---------------+
         (sets demo mode)
```

---

## Demo Mode Behavior

| Feature | Demo Mode | Authenticated |
|---------|-----------|---------------|
| Free songs | Full access | Full access |
| Premium songs | Blocked (RLS) | Based on subscription |
| Practice sessions | Not saved | Saved to database |
| Playlists | Not available | Full access |
| Progress tracking | Local only | Synced to database |
| Upgrade banner | Shown | Hidden |

---

## Design Specifications

### Stadium Background Integration
- Use existing `StadiumBackground` component unchanged
- Add overlay: `bg-gradient-to-b from-black/50 via-black/30 to-black/70`
- Content z-index above background (z-10)

### Button Styling
- Primary CTA: `GlassButton variant="frosted"` (shimmer + glow)
- Secondary: `GlassButton variant="secondary"`
- Demo link: Text button with `text-muted-foreground hover:text-foreground`

### Animations
- Slide transitions: Framer Motion with spring physics
- Logo entrance: Scale + fade
- Staggered content appearance: 0.1s delay between elements
