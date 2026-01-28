

# RVMT - Vocal Coaching App MVP Plan

## 🎯 Vision
A premium vocal coaching web app with a stunning liquid glass morphism UI where users can browse songs, play them in full, then enter a stem training mode with individual track controls (mute/solo/volume) and synchronized waveform visualizations.

---

## Phase 1: Foundation & Design System

### 1.1 Core Design System Setup
- Implement liquid glass morphism CSS variables (dark theme, glass surfaces, accent gradients)
- Create stem-specific color palette (cyan for vocals, purple for harmony, amber for instrumental, etc.)
- Add liquid animation keyframes (flow, shimmer, pulse, float)
- Configure typography scale and touch-friendly sizing

### 1.2 Glass UI Component Library
- **GlassCard** - Frosted glass cards with hover glow effects
- **GlassButton** - Gradient buttons with liquid press animations
- **GlassSlider** - Volume sliders with glowing thumbs
- **IconButton** - Touch-friendly icon buttons (44px minimum)
- **LoadingShimmer** - Skeleton loading states

---

## Phase 2: Layout & Navigation

### 2.1 Mobile-First App Shell
- Responsive container with safe area handling for notched devices
- Sticky header (56px) with logo, search, and menu
- Fixed bottom navigation bar (Home, Library, Train, Profile)
- Bottom player bar (appears when song is playing)

### 2.2 Page Structure
- **Home** - Hero with animated gradients, featured songs carousel
- **Library** - Song grid with search and filter chips
- **Song Detail** - Full preview with waveform and "Enter Training" CTA
- **Training Mode** - Multi-stem mixer view (the core feature)
- **Profile** - User info and subscription status
- **Subscription** - Pricing cards and plan comparison

---

## Phase 3: Backend Infrastructure (Supabase + Stripe)

### 3.1 Database Schema
- **profiles** table - User display names, avatars, subscription tier
- **songs** table - Title, artist, cover art, duration, difficulty, genre
- **stems** table - Linked to songs, with type, name, URL, color
- **user_progress** table - Practice tracking, favorites, last played

### 3.2 Authentication
- Email/password signup and login with styled auth page
- Session management and protected routes
- User profile creation on signup

### 3.3 Stripe Integration
- Subscription products: Free, Pro ($9.99/mo)
- Checkout session creation edge function
- Webhook handler for subscription status updates
- Premium content gating based on subscription tier

---

## Phase 4: Audio Engine & Visualization

### 4.1 Audio Playback System (Howler.js)
- Multi-track stem loader with synchronized playback
- Global audio state (Zustand store)
- Play/pause, seek, skip forward/back controls
- Individual stem volume, mute, and solo controls
- A-B loop selection

### 4.2 Waveform Visualization (WaveSurfer.js)
- Master waveform for full song view
- Individual stem waveforms with unique colors
- Animated playhead with trailing glow
- Click-to-seek functionality
- Loop region highlighting

### 4.3 Demo Audio Content
- Mock song data with placeholder cover art (Unsplash)
- Generated waveform data for visual demonstration
- Sample stems using free audio sources

---

## Phase 5: Core User Flows

### 5.1 Song Discovery Flow
1. Browse song library with search and filters
2. Tap song card → View song detail with cover art and metadata
3. Play full song preview with single waveform
4. Tap "Enter Training Mode" to expand stems

### 5.2 Stem Training Flow
1. All stems load and display as separate tracks
2. Each track shows: name, solo/mute buttons, volume slider, waveform
3. Mute vocals to practice singing along
4. Solo harmonies to learn parts
5. Adjust individual volumes for custom mix
6. Set loop regions for difficult sections

### 5.3 Subscription Flow
1. Free users see limited songs, paywall on premium content
2. Tap locked song → Paywall modal with pricing
3. Select plan → Stripe checkout
4. Return to app with full access unlocked

---

## Phase 6: Polish & Micro-Interactions

### 6.1 Animations (Framer Motion)
- Page transitions with fade and slide
- Staggered stem track reveals
- Solo/mute button toggle feedback
- Volume slider thumb expansion on drag
- Play button icon morphing

### 6.2 Mobile UX Enhancements
- Swipe gestures for navigation
- Pull-to-refresh on library
- Haptic-style visual feedback
- Empty states with animated illustrations
- Toast notifications for actions

---

## 📱 Key MVP Screens

| Screen | Purpose |
|--------|---------|
| Home | Welcome, featured songs, quick stats |
| Library | Browse all songs with search/filter |
| Song Detail | Preview full song, see metadata |
| Training Mode | Multi-stem mixer (CORE FEATURE) |
| Auth | Login/signup flow |
| Subscription | Pricing and checkout |
| Profile | User settings, subscription status |

---

## 🚀 What You'll Get

✅ Beautiful liquid glass UI optimized for mobile  
✅ Working audio player with multi-track stem control  
✅ Visual waveforms with playhead animation  
✅ Solo, mute, and volume controls per stem  
✅ User authentication and profiles  
✅ Stripe subscription integration  
✅ Demo songs with placeholder content  
✅ Responsive design that scales to desktop  

---

## 🛠 Tech Stack

- **React + TypeScript + Vite** (Lovable default)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Howler.js** for audio playback
- **WaveSurfer.js** for waveform visualization
- **Supabase** for auth, database, storage
- **Stripe** for payments

