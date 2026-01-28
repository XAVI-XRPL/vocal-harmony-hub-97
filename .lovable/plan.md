
# Practice Progress, A-B Loop & Tempo Control Implementation Plan

## Overview

This plan implements three key training features:
1. **Database storage** for practice sessions with user authentication
2. **A-B loop functionality** to repeat specific song sections
3. **Tempo control** with playback speed adjustment (0.5x to 1.5x)

---

## 1. Database Schema & Authentication

### Database Tables

Create the following tables in Lovable Cloud:

**profiles table** - User profile information
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK, FK to auth.users) | User ID |
| display_name | text | User's display name |
| avatar_url | text | Profile picture URL |
| created_at | timestamptz | Account creation date |
| updated_at | timestamptz | Last update time |

**practice_sessions table** - Individual practice sessions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Session ID |
| user_id | uuid (FK to profiles) | User who practiced |
| song_id | text | Song identifier |
| started_at | timestamptz | Session start time |
| ended_at | timestamptz | Session end time |
| duration_seconds | integer | Total practice time |
| tempo_used | float | Playback speed used |
| loops_practiced | integer | Number of A-B loops |

**user_song_progress table** - Aggregate progress per song
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Record ID |
| user_id | uuid (FK to profiles) | User ID |
| song_id | text | Song identifier |
| total_practice_time | integer | Cumulative seconds |
| times_practiced | integer | Session count |
| last_practiced_at | timestamptz | Most recent session |
| is_favorite | boolean | Favorited flag |

### Row Level Security Policies

- Users can only read/write their own profile data
- Users can only access their own practice sessions and progress
- Enable RLS on all tables

### Authentication Flow

Create an `/auth` page with:
- Email/password sign in and sign up forms
- Form validation using zod
- Redirect handling after successful auth
- Error message display for common issues
- Auto-confirm email enabled for easier testing

---

## 2. A-B Loop Functionality

### Current State
The audio store already has loop-related state:
- `isLooping: boolean`
- `loopStart: number` 
- `loopEnd: number`
- `setLoop()`, `toggleLoop()`, `clearLoop()` actions

The `useAudioPlayer` hook already handles looping in the time update loop.

### UI Implementation

Add loop controls to the Training Mode page:

**Loop Region Selector**
- Two draggable markers on the master waveform (A and B points)
- Visual highlight of the loop region between markers
- Touch-friendly handles for mobile

**Loop Control Buttons**
- "Set A" button - marks current position as loop start
- "Set B" button - marks current position as loop end  
- Loop toggle button (already exists, needs connection to real loop points)
- "Clear" button to reset loop region

**Visual Feedback**
- Shaded region on waveform showing loop area
- Loop badge showing "A 0:15 - B 0:32" time range
- Active glow effect when looping is enabled

---

## 3. Tempo Control (Playback Rate)

### Current State
The audio store already has:
- `playbackRate: number` (defaults to 1)
- `setPlaybackRate()` action

The `useAudioPlayer` hook already applies playback rate to all stems via Howler's `rate()` method.

### UI Implementation

Add tempo controls to the Training Mode transport bar:

**Tempo Slider**
- Range: 0.5x to 1.5x (slower to faster)
- Step increments: 0.05x for fine control
- Shows current percentage (50% - 150%)
- Default value: 100% (1x)

**Quick Presets**
- 0.5x (50%) - Half speed for difficult passages
- 0.75x (75%) - Slower practice tempo
- 1.0x (100%) - Normal speed
- 1.25x (125%) - Challenge mode
- 1.5x (150%) - Fast practice

**Visual Indicator**
- Color coding: slow = blue, normal = white, fast = orange
- Badge showing current tempo near transport controls

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Auth.tsx` | Authentication page with login/signup |
| `src/hooks/useAuth.ts` | Authentication hook with Supabase integration |
| `src/hooks/usePracticeSession.ts` | Practice tracking and database sync |
| `src/components/audio/LoopRegion.tsx` | Visual loop region on waveform |
| `src/components/audio/TempoControl.tsx` | Tempo adjustment UI component |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add /auth route, wrap with auth provider |
| `src/stores/userStore.ts` | Connect to Supabase auth state |
| `src/pages/TrainingMode.tsx` | Add loop UI, tempo controls, session tracking |
| `src/stores/audioStore.ts` | Minor refinements if needed |
| `src/hooks/useAudioPlayer.ts` | Ensure loop bounds are respected |
| `src/components/audio/WaveformDisplay.tsx` | Add loop region visualization |
| `src/pages/Profile.tsx` | Display real practice stats from database |

---

## Implementation Flow

```text
Phase 1: Database & Auth
┌─────────────────────────────────────────────────────────┐
│  1. Create database tables via migration                │
│  2. Set up RLS policies                                 │
│  3. Create Auth.tsx page                                │
│  4. Create useAuth hook                                 │
│  5. Connect userStore to Supabase                       │
│  6. Add /auth route                                     │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Phase 2: Tempo Control
┌─────────────────────────────────────────────────────────┐
│  1. Create TempoControl component                       │
│  2. Add to TrainingMode transport bar                   │
│  3. Connect to audioStore.setPlaybackRate               │
│  4. Style with glass morphism                           │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Phase 3: A-B Loop
┌─────────────────────────────────────────────────────────┐
│  1. Create LoopRegion component                         │
│  2. Add loop markers to WaveformDisplay                 │
│  3. Add "Set A/B" buttons to transport                  │
│  4. Connect to audioStore loop state                    │
│  5. Add visual loop region highlight                    │
└─────────────────────────────────────────────────────────┘
          │
          ▼
Phase 4: Practice Tracking
┌─────────────────────────────────────────────────────────┐
│  1. Create usePracticeSession hook                      │
│  2. Start session on TrainingMode mount                 │
│  3. Track time, tempo, loop usage                       │
│  4. Save to database on unmount/pause                   │
│  5. Update Profile page with real stats                 │
└─────────────────────────────────────────────────────────┘
```

---

## Technical Details

### Authentication Implementation

```typescript
// useAuth hook pattern
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
  }
);

// Then check existing session
supabase.auth.getSession().then(({ data: { session } }) => {
  setSession(session);
  setUser(session?.user ?? null);
});
```

### Tempo Control Logic
```typescript
// TempoControl.tsx - connects to store
const { playbackRate, setPlaybackRate } = useAudioStore();

// Slider with 0.5 to 1.5 range
<GlassSlider
  value={playbackRate}
  min={0.5}
  max={1.5}
  step={0.05}
  onChange={setPlaybackRate}
/>
```

### A-B Loop Logic
```typescript
// Set loop points at current time
const handleSetLoopA = () => {
  setLoopStart(currentTime);
};

const handleSetLoopB = () => {
  setLoopEnd(currentTime);
  setLoop(loopStart, currentTime);
};

// Waveform visual region
const loopStartPercent = (loopStart / duration) * 100;
const loopEndPercent = (loopEnd / duration) * 100;
```

### Practice Session Tracking
```typescript
// Start session on mount
useEffect(() => {
  if (!user) return;
  
  const sessionStart = new Date();
  
  return () => {
    // Save session on unmount
    savePracticeSession({
      user_id: user.id,
      song_id: currentSong.id,
      started_at: sessionStart,
      ended_at: new Date(),
      duration_seconds: totalTime,
      tempo_used: playbackRate,
      loops_practiced: loopCount,
    });
  };
}, [currentSong?.id]);
```

---

## Expected Results

After implementation:
- Users can sign up and log in with email/password
- Practice time is tracked and saved to the database
- Profile page shows real practice statistics
- Users can set A-B loop points by clicking buttons or dragging markers
- Loop region is visually highlighted on the waveform
- Playback automatically loops between A and B points
- Tempo slider allows 0.5x to 1.5x playback speed
- Quick tempo presets for common practice speeds
- All audio stems stay synchronized at any tempo
