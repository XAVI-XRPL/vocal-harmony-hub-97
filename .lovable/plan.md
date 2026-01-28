

# Enhanced Training Mode, Splash Screen & Mobile Optimization

## Overview

This plan addresses four key improvements to the RVMT vocal coaching app:
1. **Fix and enhance waveform displays** - Show actual wave patterns in stem tracks
2. **Optimize mobile layout** - Compact design with less scrolling
3. **Add splash screen with onboarding** - First-run experience for new users
4. **Add more visual polish** - Micro-interactions, better animations, and glass effects

---

## 1. Fix Waveform Display

### Current Issue
The waveform bars are nearly invisible because:
- The bars have minimal visual presence (too thin, too small)
- Missing proper contrast between played and unplayed sections
- No background fill to make the waveform stand out

### Solution

**Enhanced WaveformDisplay Component:**
- Add a filled waveform with gradient that fades from bottom
- Show mirrored waveform (bars above and below centerline) for a more professional audio look
- Increase bar width and add slight gaps between bars
- Add subtle glow effect behind the waveform
- Add animated "breathing" effect when playing

```text
Before:                    After:
|                         ▓▓▓   ▓▓▓▓▓▓   ▓▓▓
|                        ▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓
(barely visible)        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                       ━━━━━━━━━━━━━━━━━━━━━━━
                        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                         ▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓
                          ▓▓▓   ▓▓▓▓▓▓   ▓▓▓
```

---

## 2. Optimize Mobile Layout - Less Scrolling

### Current Issue
Training mode has 5+ stems stacked vertically, each with waveform + controls, requiring significant scrolling.

### Solution - Compact Stem Cards

**New Compact StemTrack Design:**
```text
┌────────────────────────────────────────────────┐
│ 🎤 Lead Vocal        [S] [M]    ━━━━━○━━━━━━  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓|▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
└────────────────────────────────────────────────┘
```

**Key Changes:**
- **Single-line header**: Icon, name, S/M buttons, and volume slider all in one row
- **Inline waveform**: More compact height (48px instead of 60px)
- **Remove separate volume row**: Integrate slider into header
- **Tighter padding**: Reduce from p-4 to p-3
- **Smaller gaps**: Reduce spacing between stem cards

**Full-screen Layout Optimization:**
```text
┌─────────────────────────────────────┐
│ ←  Song Title                    ⚙ │  <- 48px header
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Master  ░░▓▓▓▓▓▓|▓▓▓▓▓░░  0:24 │ │  <- 64px master
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Stems (scrollable area) ───────┐ │
│ │ 🎤 Vocal  [S][M] ━○   ▓▓▓|▓▓▓▓  │ │  <- 72px each
│ │ 🎵 Harmony[S][M] ━━○  ▓▓▓|▓▓▓▓  │ │
│ │ 🎸 Instr. [S][M] ━━━○ ▓▓▓|▓▓▓▓  │ │
│ │ 🥁 Drums  [S][M] ━○   ▓▓▓|▓▓▓▓  │ │
│ │ 🎸 Bass   [S][M] ━━○  ▓▓▓|▓▓▓▓  │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤  <- Fixed transport
│     ◀◀    ▶ PLAY   ▶▶    🔁        │
│         0:24 / 3:54                 │
└─────────────────────────────────────┘
```

**Viewport Calculation:**
- Header: 48px
- Master waveform: 80px
- Transport controls: 120px
- Available for stems: ~400px on mobile (can show 5 stems at 72px each without scrolling)

---

## 3. Splash Screen with Onboarding Flow

### New Components

**SplashScreen Component:**
- Full-screen animated gradient background
- RVMT logo with liquid animation
- Loading progress indicator
- Checks if user has completed onboarding

**OnboardingFlow Component:**
- 3-4 swipeable slides with key features
- Each slide has:
  - Large animated illustration
  - Headline text
  - Brief description
- Skip button and progress dots
- "Get Started" CTA on final slide
- Saves completion to localStorage

### Onboarding Slides

```text
Slide 1: Welcome
┌─────────────────────────────────────┐
│                                     │
│         🎵 (animated logo)          │
│                                     │
│        Welcome to RVMT              │
│                                     │
│   Master your voice with isolated   │
│   stem training technology          │
│                                     │
│              ○ ○ ○                  │
│        [Get Started →]              │
└─────────────────────────────────────┘

Slide 2: Stems Explained
┌─────────────────────────────────────┐
│       ═══ Vocal ═══                 │
│       ═══ Harmony ═══               │
│       ═══ Instrumental ═══          │
│                                     │
│      Separate & Control             │
│                                     │
│   Isolate vocals, harmonies, and    │
│   instrumentals independently       │
│                                     │
│              ○ ○ ○                  │
│        [Next →]                     │
└─────────────────────────────────────┘

Slide 3: Practice Features
┌─────────────────────────────────────┐
│         [S] [M] ━━━○━━              │
│                                     │
│         Solo & Mute                 │
│                                     │
│   Solo any track to focus, or       │
│   mute to practice your part        │
│                                     │
│              ○ ○ ○                  │
│        [Start Training →]           │
└─────────────────────────────────────┘
```

### App Flow

```text
App Launch
    │
    ▼
┌─────────────┐     No     ┌─────────────┐
│ Check local │ ─────────► │  Onboarding │
│   storage   │            │    Flow     │
└─────────────┘            └──────┬──────┘
    │ Yes                         │
    ▼                             ▼
┌─────────────┐            ┌─────────────┐
│    Home     │ ◄───────── │  Complete   │
│    Page     │            │  & Save     │
└─────────────┘            └─────────────┘
```

---

## 4. Polish & Micro-Interactions

### Enhanced Animations

**Stem Track Interactions:**
- Solo button: Pulse glow effect when active
- Mute button: Track dims with subtle blur
- Volume slider: Thumb scales up on drag with glow trail
- Waveform: Subtle "breathing" animation when playing

**Transport Controls:**
- Play button: Morphing icon with ripple effect
- Progress bar: Smooth gradient animation
- Time display: Fade transition on update

**Page Transitions:**
- Slide up with blur-in effect
- Staggered element reveals
- Shared element transitions for song cards

### Visual Enhancements

**Stem Cards:**
- Gradient border that matches stem color
- Subtle inner glow on active stems
- Icon background pulse when solo'd

**Master Waveform:**
- Full-width gradient fill
- Animated playhead with comet trail
- Glow effect behind played portion

**Transport Bar:**
- Stronger glass blur
- Gradient progress fill
- Floating appearance with shadow

---

## Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `src/pages/Splash.tsx` | Initial splash screen |
| `src/pages/Onboarding.tsx` | Onboarding flow slides |
| `src/hooks/useOnboarding.ts` | Onboarding state management |
| `src/components/audio/CompactStemTrack.tsx` | Compact stem track layout |

### Modified Files
| File | Changes |
|------|---------|
| `src/App.tsx` | Add splash/onboarding routes |
| `src/components/audio/WaveformDisplay.tsx` | Enhanced waveform with mirrored bars |
| `src/components/audio/StemTrack.tsx` | Compact single-row layout |
| `src/pages/TrainingMode.tsx` | Optimized spacing, compact layout |
| `src/index.css` | New animations and polish classes |
| `src/components/layout/AppShell.tsx` | Handle splash/onboarding state |

---

## Technical Details

### Splash Screen Logic
```typescript
// useOnboarding.ts
const ONBOARDING_KEY = 'rvmt_onboarding_complete';

export function useOnboarding() {
  const [isComplete, setIsComplete] = useState(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  });

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsComplete(true);
  };

  return { isComplete, completeOnboarding };
}
```

### Enhanced Waveform Bars
```typescript
// Mirrored waveform with gradient
{normalizedData.map((value, i) => (
  <div 
    key={i}
    className="flex flex-col items-center gap-0.5"
    style={{ flex: 1 }}
  >
    {/* Top bar */}
    <div 
      style={{ 
        height: `${value * 50}%`,
        background: isPlayed ? color : `${color}33`,
      }} 
    />
    {/* Center line */}
    <div className="w-full h-px bg-white/10" />
    {/* Bottom bar (mirrored) */}
    <div 
      style={{ 
        height: `${value * 50}%`,
        background: isPlayed ? color : `${color}33`,
      }} 
    />
  </div>
))}
```

### Compact Stem Layout
```typescript
// Single row: [Icon] [Name] [S] [M] [Volume Slider]
<div className="flex items-center gap-2 p-3">
  <StemIcon />
  <span className="flex-shrink-0 w-20 truncate">{stem.name}</span>
  <SoloButton size="sm" />
  <MuteButton size="sm" />
  <VolumeSlider className="flex-1" size="sm" />
</div>
<WaveformDisplay height={40} />
```

---

## Expected Outcome

After implementation:
- Waveforms display as vibrant, mirrored audio visualizations
- All 5 stems visible on mobile without scrolling (compact layout)
- New users see beautiful onboarding explaining the app
- Transport controls are fixed and always accessible
- Every interaction feels premium with smooth animations
- Glass morphism effects are more pronounced and polished

