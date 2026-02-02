
# RMVT Cinematic Stadium Blue Theme Implementation

## Overview

This plan transforms the app's visual identity around the uploaded RMVT stadium logo, creating a cohesive blue-themed cinematic experience with animated backgrounds that evoke a concert/stadium atmosphere.

---

## 1. Logo Integration

### Implementation

- **Copy logo** to `src/assets/rmvt-logo.png`
- **Style as app icon**: Rounded corners (rounded-2xl) with subtle glow
- **Header update**: Replace the gradient "R" square with the RMVT logo image
- **Splash/loading screens**: Use logo with stadium light glow effect

### Logo Component
Create a reusable `RMVTLogo` component that:
- Displays the stadium light logo image
- Has curved edges (like an app icon)
- Includes optional animated glow matching the stadium lights
- Scales responsively for different contexts (header, splash, etc.)

---

## 2. Color Scheme Restructure

### Extracted Colors from Logo
The logo features:
- **Stadium Blue**: Deep atmospheric blue (~hsl(210, 70%, 15%))
- **Light Blue Glow**: Bright stadium lights (~hsl(200, 80%, 70%))
- **White**: Pure stadium light dots
- **Fog/Mist Blue**: Atmospheric haze (~hsl(210, 40%, 50%))

### Dark Mode (Primary Experience - Stadium at Night)

| Token | Current | New Value | Purpose |
|-------|---------|-----------|---------|
| --background | 230 25% 3% | 215 80% 4% | Deep stadium night blue |
| --card | 230 25% 5% | 215 70% 7% | Slightly lighter blue surface |
| --primary | 239 84% 67% | 200 90% 55% | Stadium light cyan-blue |
| --accent | 270 91% 65% | 210 85% 65% | Brighter stadium blue |
| --muted | 230 20% 15% | 215 50% 15% | Atmospheric dark blue |
| --gradient-start | 239 84% 67% | 195 85% 50% | Cyan stadium light |
| --gradient-mid | 270 91% 65% | 210 80% 60% | Mid blue glow |
| --gradient-end | 330 81% 60% | 220 75% 70% | Soft sky blue |

### Light Mode (Stadium at Dusk/Day)

| Token | Current | New Value | Purpose |
|-------|---------|-----------|---------|
| --background | 220 20% 98% | 205 60% 97% | Soft sky blue-white |
| --card | 0 0% 100% | 205 40% 99% | Clean white with blue tint |
| --primary | 239 84% 57% | 200 85% 45% | Deep stadium blue |
| --accent | 270 91% 55% | 210 80% 55% | Accent stadium blue |
| --muted | 220 15% 96% | 205 40% 94% | Light blue-grey |
| --gradient-start | 239 84% 57% | 195 80% 45% | Cyan |
| --gradient-mid | 270 91% 55% | 210 75% 50% | Blue |
| --gradient-end | 330 81% 55% | 220 70% 60% | Sky blue |

---

## 3. Animated Stadium Background

### Concept
Create an immersive animated background that evokes stadium concert lighting with:
- Floating light orbs (like distant stadium lights)
- Animated fog/mist effect
- Subtle beam rays from top
- Blue atmospheric gradient

### CSS Animations

**Stadium Light Animation**
```css
@keyframes stadiumLightPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}
```

**Light Beam Sweep**
```css
@keyframes lightBeamSweep {
  0% {
    transform: translateX(-100%) rotate(15deg);
    opacity: 0;
  }
  50% {
    opacity: 0.15;
  }
  100% {
    transform: translateX(200%) rotate(15deg);
    opacity: 0;
  }
}
```

**Fog Drift**
```css
@keyframes fogDrift {
  0%, 100% {
    transform: translateX(0) translateY(0);
    opacity: 0.2;
  }
  50% {
    transform: translateX(20px) translateY(-10px);
    opacity: 0.35;
  }
}
```

### Background Component

Create a new `StadiumBackground` component with:
- Fixed position covering entire viewport
- Multiple animated blur blobs (stadium light orbs)
- Gradient overlay simulating atmospheric haze
- Subtle animated light beams crossing the screen
- Different configurations for dark/light mode

---

## 4. Files to Create

| File | Purpose |
|------|---------|
| `src/assets/rmvt-logo.png` | Copy of uploaded logo |
| `src/components/ui/RMVTLogo.tsx` | Reusable logo component with animations |
| `src/components/layout/StadiumBackground.tsx` | Animated cinematic background |

---

## 5. Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Complete color token overhaul for blue theme + new stadium animations |
| `src/components/layout/Header.tsx` | Replace gradient square with RMVT logo image |
| `src/components/layout/AppShell.tsx` | Integrate StadiumBackground component |
| `src/components/layout/MobileNav.tsx` | Update home button gradient to blue theme |
| `tailwind.config.ts` | Add stadium-specific color tokens if needed |

---

## 6. Implementation Details

### RMVTLogo Component

```typescript
interface RMVTLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

export function RMVTLogo({ size = "md", animated = true, className }: RMVTLogoProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <motion.div
      className={cn(
        sizeMap[size],
        "rounded-2xl overflow-hidden",
        "shadow-[0_0_30px_hsl(200_90%_55%/0.3)]",
        className
      )}
      animate={animated ? {
        boxShadow: [
          "0 0 20px hsl(200 90% 55% / 0.2)",
          "0 0 40px hsl(200 90% 55% / 0.4)",
          "0 0 20px hsl(200 90% 55% / 0.2)",
        ],
      } : undefined}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <img src={rmvtLogo} alt="RMVT" className="w-full h-full object-cover" />
    </motion.div>
  );
}
```

### StadiumBackground Component

```typescript
export function StadiumBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient - deep stadium blue */}
      <div className={cn(
        "absolute inset-0",
        isDark 
          ? "bg-gradient-to-b from-[hsl(215,80%,8%)] via-[hsl(210,70%,6%)] to-[hsl(220,60%,4%)]"
          : "bg-gradient-to-b from-[hsl(205,60%,95%)] via-[hsl(210,50%,92%)] to-[hsl(215,40%,88%)]"
      )} />

      {/* Stadium light orbs */}
      <motion.div
        className="absolute w-96 h-96 -top-20 left-1/4 rounded-full bg-[hsl(200,80%,60%)] blur-[120px]"
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Light beam effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: "linear-gradient(135deg, transparent 40%, hsl(200 80% 70% / 0.1) 50%, transparent 60%)",
        }}
        animate={{
          backgroundPosition: ["-100% -100%", "200% 200%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Fog/mist layers */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[hsl(210,50%,40%/0.1)] to-transparent"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  );
}
```

### Header Logo Update

```typescript
// In Header.tsx, replace the gradient square:
<RMVTLogo size="md" animated />
<span className="font-semibold text-lg gradient-text hidden sm:block">RMVT</span>
```

---

## 7. Visual Reference

### Dark Mode Atmosphere

```text
┌─────────────────────────────────────────────┐
│ ✦ ✦     ✦        ✦   ✦      ← Stadium lights
│      ~~~~  light beams  ~~~~                │
│  ╭─────╮                                    │
│  │RMVT │  RMVT              ← Header + Logo │
│  ╰─────╯                                    │
│                                             │
│     Deep blue gradient background           │
│     with floating cyan light orbs           │
│                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░  ← Fog effect  │
└─────────────────────────────────────────────┘
```

### Light Mode Atmosphere

```text
┌─────────────────────────────────────────────┐
│     Soft sky blue background                │
│                                             │
│  ╭─────╮                                    │
│  │RMVT │  RMVT              ← Header + Logo │
│  ╰─────╯                                    │
│                                             │
│     Clean blue-tinted surfaces              │
│     with subtle light orb accents           │
│                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░  ← Soft haze   │
└─────────────────────────────────────────────┘
```

---

## 8. Expected Results

After implementation:
- RMVT stadium logo displayed as app icon with rounded corners
- Deep cinematic blue theme in dark mode (stadium at night feel)
- Clean sky-blue theme in light mode (stadium at dusk)
- Animated floating light orbs creating stadium atmosphere
- Subtle light beam sweeping animations
- Fog/mist effects at bottom of screen
- All existing glass effects updated to blue tones
- Gradient buttons and accents use stadium cyan-blues
- Cohesive premium "concert" experience throughout app
