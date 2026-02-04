# RVMT (Rapid Vocal Mastery Training) — Master System Prompt v2.0

**Last Updated:** February 2026
**Platform:** Lovable Cloud (Supabase) + React 18 + TypeScript + Vite

---

## Project Overview

RVMT is a professional vocal training web application that enables singers to practice with isolated audio stems AND access a full vocalist lifestyle ecosystem — including an in-app product store, medical/vocal health directory, and stage preparation toolkit.

The app allows users to independently control vocals, harmonies, and instrumental tracks, with advanced training features like tempo adjustment and A/B looping. Beyond training, RVMT serves as a vocalist's complete companion — from warming up to stepping on stage.

---

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom "Stadium Blue" glassmorphism design system
- **State Management:** Zustand (stores: audio, user, UI, store/cart)
- **Data Fetching:** TanStack React Query
- **Animation:** Framer Motion
- **Audio Engine:** Howler.js (HTML5 Audio with multi-stem synchronization)
- **Backend:** Lovable Cloud (Supabase) — PostgreSQL + Edge Functions + Auth
- **Routing:** React Router v6
- **Maps:** react-simple-maps (for interactive USA map) OR inline SVG map component

---

## Application Architecture — File Structure

```
src/
  App.tsx                    # Root with routing, providers, splash/onboarding flow
  main.tsx                   # Entry point with React Query + ThemeProvider
  index.css                  # Complete design system (glassmorphism, stem colors)

  types/index.ts             # Core type definitions (Song, Stem, User, Playlist, Product, Doctor, Venue, Brand)

  stores/
    audioStore.ts            # Zustand: playback state, stem mixer, looping
    userStore.ts             # Zustand: auth state, subscription management
    uiStore.ts               # Zustand: search, filters, UI preferences, active city
    storeCartStore.ts        # Zustand: Vocal Rider Store cart state

  hooks/
    useAudioPlayer.ts        # Howler.js multi-stem sync engine
    useAuth.ts               # Supabase auth wrapper
    useSongs.ts              # React Query: fetch songs/stems from database
    usePlaylists.ts          # CRUD operations for playlists
    usePracticeSession.ts    # Practice time tracking + database sync
    useOnboarding.ts         # First-launch onboarding state
    useProducts.ts           # React Query: fetch store products
    useDoctors.ts            # React Query: fetch medical providers by city
    useVenues.ts             # React Query: fetch venues/stadiums by city
    usePartnerBrands.ts      # React Query: fetch IEM/gear partner brands
    usePrepChecklist.ts      # Prep checklist state + persistence

  pages/
    # === EXISTING PAGES ===
    Home.tsx                 # Dashboard — hero, stats, continue practice, NEW feature previews
    Library.tsx              # Song browser with search/filter
    TrainingMode.tsx         # Core training interface (full-screen mixer)
    Auth.tsx                 # Login/signup with email validation
    Profile.tsx              # User profile, stats, subscription status
    Subscription.tsx         # Pro upgrade page with pricing
    Playlists.tsx            # User playlist management
    PlaylistDetail.tsx       # Individual playlist view
    Progress.tsx             # Practice statistics
    Onboarding.tsx           # 3-slide intro carousel
    Splash.tsx               # Animated logo splash screen

    # === NEW PAGES ===
    Hub.tsx                  # Gateway page to Store, Medical, Stage Prep (3 glass cards)
    VocalRiderStore.tsx      # Product marketplace — dressing room theme
    ProductDetail.tsx        # Individual product page
    VocalHealth.tsx          # Medical directory — interactive USA map + doctor cards
    DoctorProfile.tsx        # Individual doctor/provider profile
    StagePrep.tsx            # "Prepping for the Stage" — IEMs, gear, checklist

  components/
    # === EXISTING COMPONENTS ===
    audio/
      WaveformDisplay.tsx
      StemTrack.tsx
      LoopRegion.tsx
      LoopControls.tsx
      TempoControl.tsx
      MiniPlayer.tsx

    layout/
      AppShell.tsx           # Updated: Hub added to navigation
      MobileNav.tsx          # Updated: Hub icon replaces tools/wrench icon
      DesktopSidebar.tsx     # Updated: New sections in sidebar
      Header.tsx
      StadiumBackground.tsx
      StudioBackground.tsx

    ui/
      glass-card.tsx
      glass-button.tsx
      glass-slider.tsx
      icon-button.tsx
      (50+ shadcn/ui components)

    song/
      SongCard.tsx
      
    playlist/
      PlaylistCard.tsx
      AddToPlaylistDialog.tsx
      CreatePlaylistDialog.tsx

    # === NEW COMPONENTS ===
    home/
      ContinuePractice.tsx       # Existing: Recent songs shortcut section
      VocalProgressDiagram.tsx   # Existing
      FeaturedGearPreview.tsx    # NEW: Horizontal scroll of 2-3 IEM products for home page
      VocalRiderPicks.tsx        # NEW: 3-4 store product thumbnails for home page
      VocalHealthCTA.tsx         # NEW: "Find a Vocal Doctor" CTA card for home page

    store/
      ProductCard.tsx            # Product tile: image, name, price, category badge
      ProductGrid.tsx            # Responsive grid of ProductCards
      DressingRoomHero.tsx       # Dressing room table flat-lay hero visual
      CategoryFilter.tsx         # Filter pills: Throat Care, Hydration, Environment, etc.
      CartDrawer.tsx             # Slide-out cart panel
      CartItem.tsx               # Single cart line item

    medical/
      USAMap.tsx                 # Interactive SVG map of USA with tappable city dots
      CityMarker.tsx             # Glowing dot on map — tappable, shows city name
      DoctorCard.tsx             # Provider card: name, specialty, credentials, city
      DoctorList.tsx             # Scrollable list of DoctorCards filtered by city
      VenueCard.tsx              # Stadium/venue card: name, capacity, image
      VenueList.tsx              # Venues in selected city
      EMTBadge.tsx               # Medical cross icon component (red cross on glass)
      CityDrawer.tsx             # Bottom sheet showing doctors + venues for selected city

    stage-prep/
      IEMShowcase.tsx            # Featured in-ear monitor products — large cards
      GearCard.tsx               # Equipment card: product, brand, discount badge
      GearGrid.tsx               # Grid of GearCards
      PartnerBadge.tsx           # "RVMT Partner Discount" ribbon/badge
      DiscountReveal.tsx         # Tap-to-reveal discount code component
      PrepChecklist.tsx          # Interactive pre-show checklist with toggles
      PrepChecklistItem.tsx      # Single checklist item with checkbox animation

    hub/
      HubCard.tsx                # Large glass card for Hub gateway (icon, title, description)

  data/
    mockSongs.ts                 # Existing: seed data + waveform generator
    mockProducts.ts              # NEW: Vocal Rider Store demo products
    mockDoctors.ts               # NEW: Medical provider demo data by city
    mockVenues.ts                # NEW: Stadium/venue demo data by city
    mockBrands.ts                # NEW: Partner brand + IEM/gear demo data
    mockCities.ts                # NEW: Major cities with coordinates for map
    mockChecklist.ts             # NEW: Default prep checklist items

  integrations/supabase/
    client.ts
    types.ts
```

---

## Design System — "Stadium Blue"

### Theme (unchanged)

```
--primary: 200 90% 55% (Cyan-blue)
--accent: 210 85% 65% (Brighter blue)
--background: 215 80% 4% (Near-black with blue tint)
```

### Stem Colors (unchanged)

- Vocal: #14b8a6 (Teal)
- Harmony: #a855f7 (Purple)
- Instrumental: #f59e0b (Amber)
- Drums: #ef4444 (Red)
- Bass: #8b5cf6 (Violet)
- Keys: #10b981 (Green)

### NEW: Feature Module Colors

Each new module gets a signature accent color that complements the Stadium Blue system:

| Module | Accent Color | Hex | Usage |
|--------|-------------|-----|-------|
| Vocal Rider Store | Warm Gold | #D4A574 | Product cards, dressing room warmth, price tags |
| Vocal Health / Medical | Medical Red | #EF4444 | EMT cross badge, emergency accent, doctor cards |
| Stage Prep | Electric Cyan | #22D3EE | IEM product glow, discount badges, checklist checks |
| Hub | Soft White | #E2E8F0 | Hub card icons, neutral gateway |

### Glassmorphism (unchanged)

```css
.glass-card {
  background: hsl(200 50% 50% / 0.04);
  backdrop-filter: blur(40px) saturate(150%);
  border: 1px solid hsl(200 60% 70% / 0.1);
}
```

### NEW: Dressing Room Aesthetic (Store only)

The Vocal Rider Store uses a warmer sub-theme layered on top of Stadium Blue:

```css
.dressing-room-bg {
  background: linear-gradient(
    180deg,
    hsl(30 20% 8% / 0.9) 0%,       /* warm dark wood tone */
    hsl(215 80% 4% / 1) 100%        /* fades back to stadium blue */
  );
}

.dressing-room-card {
  background: hsl(30 30% 50% / 0.06);
  border: 1px solid hsl(35 40% 60% / 0.15);
}
```

---

## Navigation Architecture

### Bottom Nav (Mobile) — 5 Tabs

```
[Training]  [Playlists]  [Home]  [Hub]  [Progress]
   |||         ≡d         (🏠)    ◆       📊
```

- **Home** (center, highlighted) — Dashboard
- **Training** — Library / stem mixer
- **Playlists** — User playlists
- **Hub** — Gateway to Store, Medical, Stage Prep (NEW — replaces old tools/wrench icon)
- **Progress** — Practice stats

### Hub Page Layout

Hub.tsx is a simple gateway with 3 large tappable glass cards:

```
┌─────────────────────────────────┐
│  🛒  Vocal Rider Store          │
│  Throat care, teas, humidifiers │
│  & dressing room essentials     │
│  [Warm Gold accent glow]        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ✚  Vocal Health                │
│  Find ENT doctors & vocal       │
│  specialists in your city       │
│  [Medical Red accent glow]      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  🎧  Prep for the Stage        │
│  In-ear monitors, gear deals    │
│  & your pre-show checklist      │
│  [Electric Cyan accent glow]    │
└─────────────────────────────────┘
```

Each card uses Framer Motion `whileTap={{ scale: 0.97 }}` and has a subtle colored glow matching its module color. Page header: "Your Vocal Toolkit".

### Desktop Sidebar

Add a "TOOLKIT" section below existing nav:

```
── TRAINING ──
  Home
  Library
  Playlists
  Progress

── TOOLKIT ──
  Vocal Rider Store
  Vocal Health
  Stage Prep
```

---

## Routes (App.tsx additions)

```tsx
<Route path="/hub" element={<Hub />} />
<Route path="/store" element={<VocalRiderStore />} />
<Route path="/store/:productId" element={<ProductDetail />} />
<Route path="/vocal-health" element={<VocalHealth />} />
<Route path="/vocal-health/doctor/:doctorId" element={<DoctorProfile />} />
<Route path="/stage-prep" element={<StagePrep />} />
```

---

## NEW: Home Dashboard — Updated Layout

The Home.tsx page adds 3 new preview sections below "Continue Practice". These act as teasers that drive traffic to the new modules. Each section is a horizontal scroll row or a single CTA card.

```
Home.tsx Layout (top to bottom):
─────────────────────────────────
1. Header (RVMT logo, dark mode, notifications)
2. Hero: "Master Your Voice" + "Start Training" CTA
3. Stats: [12 Songs Practiced] [3.5h Training Time]
4. Continue Practice (song list)
5. ──── NEW SECTIONS BELOW ────
6. 🎧 "Prep for the Stage" — horizontal scroll, 2-3 IEM product cards with partner badges
7. 🛒 "Dressing Room Essentials" — horizontal scroll, 3-4 Vocal Rider product thumbnails
8. 🏥 "Vocal Health" — single glass CTA card with EMT cross, "Find a Doctor" button
9. ──── END NEW SECTIONS ────
10. Vocal Progress Diagram (existing)
11. "Unlock All Exercises" footer CTA (existing)
```

### Section 6: FeaturedGearPreview.tsx

```
"Prep for the Stage"                    See all >
┌──────────┐ ┌──────────┐ ┌──────────┐
│ [IEM img]│ │ [IEM img]│ │ [Mic img]│
│ Shure    │ │ 64 Audio │ │ Sennheis │
│ SE846    │ │ U6t      │ │ e945     │
│ $899     │ │ $1,299   │ │ $249     │
│ 🏷 15%  │ │ 🏷 10%  │ │ 🏷 20%  │
│   off    │ │   off    │ │   off    │
└──────────┘ └──────────┘ └──────────┘
  ← swipe →
```

- Horizontal scroll with snap
- Each card is a glass card with product image, brand, model, price, and discount badge
- Tapping a card navigates to `/stage-prep`
- "See all >" navigates to `/stage-prep`

### Section 7: VocalRiderPicks.tsx

```
"Dressing Room Essentials"              See all >
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ [tea img]│ │[humid im]│ │[spray im]│ │[fruit im]│
│ Vocal Tea│ │ Portable │ │ Throat   │ │ Tour     │
│ Maker    │ │ Humidifr │ │ Spray    │ │ Fruit Bx │
│ $34.99   │ │ $49.99   │ │ $12.99   │ │ $24.99   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
  ← swipe →
```

- Warm gold tinted glass cards
- Smaller thumbnails than the gear section
- Tapping navigates to `/store`

### Section 8: VocalHealthCTA.tsx

```
┌─────────────────────────────────────────┐
│  ✚                                      │
│  Find a Vocal Health Doctor             │
│  ENT specialists, vocal coaches &       │
│  therapists in major cities             │
│                                         │
│  [    Explore Vocal Health    ]          │
│                                         │
└─────────────────────────────────────────┘
```

- Single full-width glass card
- Red EMT cross icon (top-left or centered)
- Brief description + CTA button
- Tapping navigates to `/vocal-health`

---

## NEW FEATURE: Vocal Rider Store

### Page: VocalRiderStore.tsx

Full store page with dressing room aesthetic.

**Layout:**

```
┌──────────────────────────────────────┐
│ ← Back          Vocal Rider Store  🛒│
├──────────────────────────────────────┤
│                                      │
│  [DRESSING ROOM HERO IMAGE]          │
│  Top-down flat-lay of products       │
│  spread across dressing room table   │
│  Vanity mirror lights, warm wood     │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Filter: [All] [Throat] [Hydration]  │
│          [Environment] [Nutrition]   │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  ┌─────────┐  ┌─────────┐           │
│  │ Product │  │ Product │           │
│  │  Card   │  │  Card   │           │
│  │         │  │         │           │
│  └─────────┘  └─────────┘           │
│  ┌─────────┐  ┌─────────┐           │
│  │ Product │  │ Product │           │
│  │  Card   │  │  Card   │           │
│  └─────────┘  └─────────┘           │
│                                      │
│  (2-column responsive grid)          │
│                                      │
└──────────────────────────────────────┘
```

### DressingRoomHero.tsx

A stylized hero section at the top of the store. This is NOT a real photograph — build it as a **CSS/SVG illustrated dressing room table** with:

- Warm wood-grain gradient background (CSS)
- Rounded vanity mirror outline with glowing bulb dots around the edge (SVG circles with warm glow)
- Product silhouettes or icons "placed" on the table surface
- Subtle warm lighting gradient from the top
- Text overlay: "The Vocal Rider" in an elegant serif or display font
- Subtext: "Everything your voice needs, backstage to stage"

Use Framer Motion for a gentle parallax scroll effect on the mirror/lights.

### ProductCard.tsx Props

```tsx
interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'throat_care' | 'hydration' | 'environment' | 'nutrition' | 'essentials';
  imageUrl: string;        // placeholder image URL or emoji/icon for demo
  isFeatured: boolean;
  affiliateUrl?: string;   // external purchase link
}
```

- Warm gold border glow on hover
- Category badge (colored pill) in top-right corner
- Price in bold at bottom
- Tap → navigates to ProductDetail or opens affiliateUrl

### CategoryFilter.tsx

Horizontal scroll of filter pills:

```
[All] [🫖 Throat Care] [💧 Hydration] [🌫 Environment] [🍎 Nutrition] [✨ Essentials]
```

- Active pill has warm gold background fill
- Inactive pills are glass-outline style
- Filters the ProductGrid below

---

## NEW FEATURE: Vocal Health — Interactive Medical Directory

### Page: VocalHealth.tsx

**Layout:**

```
┌──────────────────────────────────────┐
│ ← Back         Vocal Health       ✚ │
├──────────────────────────────────────┤
│                                      │
│  "Find Vocal Health Specialists"     │
│  "Tap a city to explore"            │
│                                      │
├──────────────────────────────────────┤
│                                      │
│       ┌──────────────────┐           │
│       │                  │           │
│       │   INTERACTIVE    │           │
│       │    USA MAP       │           │
│       │                  │           │
│       │  ● Seattle       │           │
│       │       ● Chicago  │           │
│       │  ● LA    ● NYC   │           │
│       │     ● Nashville  │           │
│       │  ● Houston       │           │
│       │       ● Atlanta  │           │
│       │       ● Miami    │           │
│       │                  │           │
│       └──────────────────┘           │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Selected: New York City             │
│                                      │
│  ── Vocal Specialists (3) ──         │
│  ┌────────────────────────────┐      │
│  │ Dr. Sarah Chen, MD         │      │
│  │ ENT / Laryngologist        │      │
│  │ ⭐ 4.9 — Manhattan         │      │
│  │ [View Profile] [Book]      │      │
│  └────────────────────────────┘      │
│  ┌────────────────────────────┐      │
│  │ Dr. Marcus Webb, DO        │      │
│  │ Voice Specialist           │      │
│  │ ⭐ 4.8 — Brooklyn          │      │
│  └────────────────────────────┘      │
│                                      │
│  ── Venues & Stadiums (3) ──         │
│  ┌────────────────────────────┐      │
│  │ 🏟 Madison Square Garden   │      │
│  │ Capacity: 20,789           │      │
│  └────────────────────────────┘      │
│  ┌────────────────────────────┐      │
│  │ 🏟 Barclays Center         │      │
│  │ Capacity: 19,000           │      │
│  └────────────────────────────┘      │
│                                      │
└──────────────────────────────────────┘
```

### USAMap.tsx — Interactive SVG Map

**CRITICAL: Build this as an inline SVG component, NOT using an external map library.** This keeps the bundle small and gives us full control over styling.

Implementation approach:

```tsx
// Simplified USA outline as an SVG path
// City markers as animated dots positioned at approximate lat/long coordinates
// Each dot is tappable and triggers city selection

const USAMap = ({ cities, selectedCity, onCitySelect }) => {
  return (
    <svg viewBox="0 0 960 600" className="w-full h-auto">
      {/* USA outline path — use a simplified SVG path of the continental US */}
      <path d="M..." fill="hsl(200 50% 50% / 0.05)" stroke="hsl(200 60% 70% / 0.2)" strokeWidth="1" />

      {/* City markers */}
      {cities.map(city => (
        <g key={city.id} onClick={() => onCitySelect(city)} className="cursor-pointer">
          {/* Outer glow ring (animated pulse) */}
          <circle cx={city.x} cy={city.y} r="12"
            fill={selectedCity?.id === city.id ? 'hsl(0 80% 55% / 0.3)' : 'transparent'}
            className="animate-pulse" />
          {/* Inner dot */}
          <circle cx={city.x} cy={city.y} r="5"
            fill={selectedCity?.id === city.id ? '#EF4444' : '#22D3EE'}
            stroke="white" strokeWidth="1.5" />
          {/* City label */}
          <text x={city.x} y={city.y - 14} textAnchor="middle"
            fill="white" fontSize="10" fontWeight="600" opacity="0.8">
            {city.name}
          </text>
        </g>
      ))}
    </svg>
  );
};
```

**Map styling:**
- USA outline: Very subtle glass fill with thin border (matches Stadium Blue)
- Unselected city dots: Electric cyan (#22D3EE) with white stroke
- Selected city dot: Medical red (#EF4444) with pulsing glow ring
- City labels: Small white text above each dot
- Framer Motion: Dots scale up on tap, selected city has a breathing pulse animation

**City dot positions** (approximate SVG coordinates for viewBox 0 0 960 600):

```
New York:     x=820, y=190
Los Angeles:  x=115, y=350
Chicago:      x=620, y=195
Nashville:    x=650, y=310
Atlanta:      x=690, y=340
Houston:      x=510, y=430
Miami:        x=750, y=470
Dallas:       x=510, y=380
Las Vegas:    x=165, y=290
Seattle:      x=130, y=95
Denver:       x=340, y=250
Detroit:      x=680, y=175
Philadelphia: x=800, y=205
Phoenix:      x=215, y=370
```

### CityDrawer.tsx / City Content Section

When a city is tapped on the map, content slides in below the map (Framer Motion `AnimatePresence`):

1. **City name header** with number of providers
2. **Doctor cards** — scrollable list
3. **Venue cards** — scrollable horizontal list of stadiums/arenas in that city

### DoctorCard.tsx Props

```tsx
interface DoctorCardProps {
  id: string;
  name: string;
  credentials: string;      // 'MD' | 'DO' | 'SLP' | 'DMA'
  specialty: string;         // 'ENT' | 'Laryngologist' | 'Voice Therapist' | 'Vocal Coach'
  city: string;
  neighborhood: string;      // 'Manhattan', 'Beverly Hills', etc.
  rating: number;            // 1-5
  reviewCount: number;
  imageUrl: string;          // placeholder avatar
  phone: string;
  bookingUrl?: string;
}
```

- Glass card with Medical Red left border accent
- EMT cross mini-badge on specialty
- Star rating display
- "View Profile" and "Book" buttons

### VenueCard.tsx Props

```tsx
interface VenueCardProps {
  id: string;
  name: string;
  city: string;
  capacity: number;
  type: 'arena' | 'stadium' | 'theater' | 'club';
  imageUrl: string;
}
```

- Horizontal scroll card
- Stadium icon + capacity badge
- Glass card with subtle cyan border

### EMTBadge.tsx

Reusable medical cross icon:

```tsx
// Red cross on glass circle — used as section identifier
const EMTBadge = ({ size = 'md' }) => (
  <div className={`rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center ${sizeClasses[size]}`}>
    <Plus className="text-red-500" />
  </div>
);
```

Sizes: `sm` (24px for inline), `md` (40px for cards), `lg` (64px for page headers)

---

## NEW FEATURE: Stage Prep — In-Ear Monitors & Gear

### Page: StagePrep.tsx

**Layout:**

```
┌──────────────────────────────────────┐
│ ← Back       Prep for the Stage   🎧│
├──────────────────────────────────────┤
│                                      │
│  "Get Stage Ready"                   │
│  "Premium gear. Exclusive discounts."│
│                                      │
├──────────────────────────────────────┤
│                                      │
│  ── Featured In-Ear Monitors ──      │
│                                      │
│  ┌────────────────────────────┐      │
│  │                            │      │
│  │    [LARGE IEM PRODUCT      │      │
│  │     IMAGE / ICON]          │      │
│  │                            │      │
│  │  Shure SE846               │      │
│  │  Pro Sound Isolating       │      │
│  │                            │      │
│  │  $899.00                   │      │
│  │  🏷 RVMT Members: 15% off │      │
│  │                            │      │
│  │  [Reveal Discount Code]    │      │
│  │  [     Shop Now      ]     │      │
│  │                            │      │
│  └────────────────────────────┘      │
│                                      │
│  ← swipe for more IEMs →            │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  ── More Gear ──                     │
│  ┌──────────┐  ┌──────────┐         │
│  │ Mic Card │  │ Cable Kit│         │
│  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐         │
│  │ Vocal FX │  │ IEM Case │         │
│  └──────────┘  └──────────┘         │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  ── Pre-Show Checklist ──            │
│                                      │
│  ☑ Hydration — 8+ glasses today     │
│  ☑ Vocal warmup completed            │
│  ☐ Steam session done                │
│  ☐ Throat care products packed       │
│  ☐ IEMs charged & tested            │
│  ☐ Set list reviewed                │
│  ☐ Sound check notes ready          │
│  ☐ Emergency vocal kit packed        │
│                                      │
│  Progress: ████░░░░ 2/8             │
│                                      │
└──────────────────────────────────────┘
```

### IEMShowcase.tsx

Large swipeable cards for featured in-ear monitors:

- Full-width card with product image (use a headphone/IEM icon or placeholder image for demo)
- Brand logo area
- Product name + description
- Retail price with strikethrough when discounted
- RVMT Partner Discount badge (electric cyan)
- "Reveal Discount Code" button → DiscountReveal component
- "Shop Now" button → opens affiliate URL

Use Framer Motion for swipe gesture between IEM cards.

### DiscountReveal.tsx

```tsx
// Tap to reveal discount code — adds engagement + tracks clicks
const DiscountReveal = ({ code, discount }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <button onClick={() => setRevealed(true)} className="glass-card">
      {revealed ? (
        <div className="font-mono text-cyan-400 text-lg tracking-widest">
          {code}  {/* e.g., "RVMT15" */}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Tag className="text-cyan-400" />
          <span>Tap to reveal {discount}% off code</span>
        </div>
      )}
    </button>
  );
};
```

### PrepChecklist.tsx

Interactive checklist with satisfying check animations:

```tsx
interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
}
```

- Each item is a glass row with a circular checkbox
- Check animation: circle fills with electric cyan, checkmark draws in (Framer Motion path animation)
- Progress bar at bottom showing X/8 completed
- State persisted in localStorage (or Supabase for logged-in users)
- Optional: Associate checklist with an event name + date

### GearCard.tsx Props

```tsx
interface GearCardProps {
  id: string;
  name: string;
  brand: string;
  category: 'IEM' | 'microphone' | 'accessories' | 'vocal_fx' | 'cables';
  price: number;
  partnerPrice?: number;
  discountCode?: string;
  discountPercent?: number;
  imageUrl: string;
  purchaseUrl: string;
  isFeatured: boolean;
}
```

### PartnerBadge.tsx

```tsx
// "RVMT Partner" ribbon overlay for gear cards
const PartnerBadge = ({ discount }) => (
  <div className="absolute top-2 right-2 bg-cyan-500/20 border border-cyan-400/40 
                  rounded-full px-3 py-1 text-xs font-bold text-cyan-300">
    🏷 {discount}% OFF
  </div>
);
```

---

## Mock Data Files (Demo Mode)

All new features ship with mock data so the app is fully functional in demo mode. When Supabase tables are populated, switch to real data via React Query hooks.

### data/mockCities.ts

```typescript
export interface City {
  id: string;
  name: string;
  state: string;
  x: number;        // SVG coordinate
  y: number;        // SVG coordinate
  latitude: number;
  longitude: number;
}

export const mockCities: City[] = [
  { id: 'nyc', name: 'New York', state: 'NY', x: 820, y: 190, latitude: 40.7128, longitude: -74.0060 },
  { id: 'la', name: 'Los Angeles', state: 'CA', x: 115, y: 350, latitude: 34.0522, longitude: -118.2437 },
  { id: 'chicago', name: 'Chicago', state: 'IL', x: 620, y: 195, latitude: 41.8781, longitude: -87.6298 },
  { id: 'nashville', name: 'Nashville', state: 'TN', x: 650, y: 310, latitude: 36.1627, longitude: -86.7816 },
  { id: 'atlanta', name: 'Atlanta', state: 'GA', x: 690, y: 340, latitude: 33.7490, longitude: -84.3880 },
  { id: 'houston', name: 'Houston', state: 'TX', x: 510, y: 430, latitude: 29.7604, longitude: -95.3698 },
  { id: 'miami', name: 'Miami', state: 'FL', x: 750, y: 470, latitude: 25.7617, longitude: -80.1918 },
  { id: 'dallas', name: 'Dallas', state: 'TX', x: 510, y: 380, latitude: 32.7767, longitude: -96.7970 },
  { id: 'lasvegas', name: 'Las Vegas', state: 'NV', x: 165, y: 290, latitude: 36.1699, longitude: -115.1398 },
  { id: 'seattle', name: 'Seattle', state: 'WA', x: 130, y: 95, latitude: 47.6062, longitude: -122.3321 },
  { id: 'denver', name: 'Denver', state: 'CO', x: 340, y: 250, latitude: 39.7392, longitude: -104.9903 },
  { id: 'detroit', name: 'Detroit', state: 'MI', x: 680, y: 175, latitude: 42.3314, longitude: -83.0458 },
  { id: 'philadelphia', name: 'Philadelphia', state: 'PA', x: 800, y: 205, latitude: 39.9526, longitude: -75.1652 },
];
```

### data/mockDoctors.ts

```typescript
export interface Doctor {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  cityId: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  phone: string;
  bio: string;
  bookingUrl: string;
  imageUrl: string;
}

export const mockDoctors: Doctor[] = [
  // NEW YORK
  {
    id: 'doc-001',
    name: 'Dr. Sarah Chen',
    credentials: 'MD, FACS',
    specialty: 'Laryngologist',
    cityId: 'nyc',
    neighborhood: 'Manhattan — Upper East Side',
    rating: 4.9,
    reviewCount: 127,
    phone: '(212) 555-0147',
    bio: 'Board-certified laryngologist specializing in performing voice. 15+ years treating Broadway performers, recording artists, and touring vocalists. Fellowship trained at Massachusetts Eye and Ear.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-f.jpg'
  },
  {
    id: 'doc-002',
    name: 'Dr. Marcus Webb',
    credentials: 'DO',
    specialty: 'ENT / Voice Specialist',
    cityId: 'nyc',
    neighborhood: 'Brooklyn — DUMBO',
    rating: 4.8,
    reviewCount: 89,
    phone: '(718) 555-0233',
    bio: 'Osteopathic ENT with a focus on vocal cord pathology and rehabilitation. Works closely with vocal coaches to create integrated recovery plans for singers.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-m.jpg'
  },
  {
    id: 'doc-003',
    name: 'Jamie Rodriguez',
    credentials: 'SLP, CCC',
    specialty: 'Speech-Language Pathologist',
    cityId: 'nyc',
    neighborhood: 'Manhattan — Midtown',
    rating: 4.7,
    reviewCount: 64,
    phone: '(212) 555-0891',
    bio: 'Certified speech-language pathologist specializing in singing voice rehabilitation. Trained in Estill Voice Training and SOVT exercises. Works with pop, gospel, and R&B artists.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-nb.jpg'
  },

  // LOS ANGELES
  {
    id: 'doc-004',
    name: 'Dr. Priya Sharma',
    credentials: 'MD',
    specialty: 'Laryngologist',
    cityId: 'la',
    neighborhood: 'Beverly Hills',
    rating: 4.9,
    reviewCount: 203,
    phone: '(310) 555-0412',
    bio: 'Leading laryngologist for the entertainment industry. Trusted by Grammy-winning artists and major label vocalists. Specializes in vocal cord microsurgery and injection treatments.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-f.jpg'
  },
  {
    id: 'doc-005',
    name: 'Dr. David Kim',
    credentials: 'MD, PhD',
    specialty: 'ENT / Vocal Researcher',
    cityId: 'la',
    neighborhood: 'West Hollywood',
    rating: 4.8,
    reviewCount: 156,
    phone: '(323) 555-0678',
    bio: 'Combines clinical ENT practice with vocal science research at UCLA. Published extensively on vocal fold healing and vocal health maintenance for touring artists.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-m.jpg'
  },

  // NASHVILLE
  {
    id: 'doc-006',
    name: 'Dr. Rachel Monroe',
    credentials: 'MD',
    specialty: 'Laryngologist',
    cityId: 'nashville',
    neighborhood: 'Music Row',
    rating: 4.9,
    reviewCount: 178,
    phone: '(615) 555-0345',
    bio: 'Nashville\'s go-to voice doctor for country, gospel, and Americana artists. Located steps from Music Row. Partners with Vanderbilt Voice Center for complex cases.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-f.jpg'
  },
  {
    id: 'doc-007',
    name: 'Kevin Taylor',
    credentials: 'DMA',
    specialty: 'Vocal Coach / Pedagogue',
    cityId: 'nashville',
    neighborhood: 'East Nashville',
    rating: 4.7,
    reviewCount: 92,
    phone: '(615) 555-0789',
    bio: 'Doctor of Musical Arts in vocal pedagogy. 20 years coaching touring artists in vocal technique, stamina, and recovery. Specializes in gospel and contemporary worship styles.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-m.jpg'
  },

  // ATLANTA
  {
    id: 'doc-008',
    name: 'Dr. Angela Foster',
    credentials: 'MD',
    specialty: 'ENT / Voice Specialist',
    cityId: 'atlanta',
    neighborhood: 'Buckhead',
    rating: 4.8,
    reviewCount: 134,
    phone: '(404) 555-0567',
    bio: 'ENT specialist with a sub-focus on performing voice for R&B, hip-hop, and gospel artists. Emory University affiliated. Offers rapid-turnaround vocal assessments for touring artists.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-f.jpg'
  },

  // CHICAGO
  {
    id: 'doc-009',
    name: 'Dr. Robert Okafor',
    credentials: 'MD, FACS',
    specialty: 'Laryngologist',
    cityId: 'chicago',
    neighborhood: 'Streeterville',
    rating: 4.8,
    reviewCount: 145,
    phone: '(312) 555-0234',
    bio: 'Fellowship-trained laryngologist at Northwestern. Specializes in vocal fold surgery and vocal athlete rehabilitation. Treats opera, gospel, and commercial music artists.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-m.jpg'
  },

  // HOUSTON
  {
    id: 'doc-010',
    name: 'Dr. Lisa Tran',
    credentials: 'MD',
    specialty: 'ENT / Voice Center Director',
    cityId: 'houston',
    neighborhood: 'Texas Medical Center',
    rating: 4.9,
    reviewCount: 167,
    phone: '(713) 555-0891',
    bio: 'Directs the Houston Voice Center at Methodist Hospital. Known for treating gospel and church vocalists. Extensive experience with vocal fold scar revision.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-f.jpg'
  },

  // MIAMI
  {
    id: 'doc-011',
    name: 'Dr. Carlos Reyes',
    credentials: 'MD',
    specialty: 'ENT / Performing Arts',
    cityId: 'miami',
    neighborhood: 'Coral Gables',
    rating: 4.7,
    reviewCount: 98,
    phone: '(305) 555-0456',
    bio: 'Bilingual (English/Spanish) ENT specializing in performing arts medicine. Treats Latin pop, reggaeton, and gospel vocalists. University of Miami affiliated.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-m.jpg'
  },

  // LAS VEGAS
  {
    id: 'doc-012',
    name: 'Dr. Michelle Park',
    credentials: 'MD',
    specialty: 'Laryngologist',
    cityId: 'lasvegas',
    neighborhood: 'The Strip — Medical District',
    rating: 4.8,
    reviewCount: 112,
    phone: '(702) 555-0678',
    bio: 'Las Vegas-based laryngologist who provides rapid vocal assessments for residency performers and touring shows. 24/7 emergency vocal care available for performers.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-f.jpg'
  },

  // DALLAS
  {
    id: 'doc-013',
    name: 'Dr. James Whitfield',
    credentials: 'MD',
    specialty: 'ENT / Voice Specialist',
    cityId: 'dallas',
    neighborhood: 'Uptown',
    rating: 4.7,
    reviewCount: 88,
    phone: '(214) 555-0345',
    bio: 'ENT voice specialist serving the DFW metroplex. Focus on church choir vocalists, worship leaders, and emerging gospel artists. UT Southwestern affiliated.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-m.jpg'
  },

  // SEATTLE
  {
    id: 'doc-014',
    name: 'Dr. Naomi Ito',
    credentials: 'MD, MSc',
    specialty: 'Laryngologist / Voice Researcher',
    cityId: 'seattle',
    neighborhood: 'Capitol Hill',
    rating: 4.8,
    reviewCount: 76,
    phone: '(206) 555-0123',
    bio: 'Combines clinical laryngology with voice science research at University of Washington. Specializes in vocal cord dysfunction and occupational voice disorders for performing artists.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-f.jpg'
  },

  // DENVER
  {
    id: 'doc-015',
    name: 'Dr. Thomas Grant',
    credentials: 'DO',
    specialty: 'ENT / Altitude Voice Specialist',
    cityId: 'denver',
    neighborhood: 'Cherry Creek',
    rating: 4.6,
    reviewCount: 54,
    phone: '(303) 555-0456',
    bio: 'Unique expertise in how altitude affects the singing voice. Helps touring artists adjust their vocal technique for high-altitude performances. Colorado Voice Clinic founder.',
    bookingUrl: '#',
    imageUrl: '/placeholder-doctor-m.jpg'
  },
];
```

### data/mockVenues.ts

```typescript
export interface Venue {
  id: string;
  name: string;
  cityId: string;
  capacity: number;
  type: 'arena' | 'stadium' | 'theater' | 'club';
  imageUrl: string;
}

export const mockVenues: Venue[] = [
  // NEW YORK
  { id: 'v-001', name: 'Madison Square Garden', cityId: 'nyc', capacity: 20789, type: 'arena', imageUrl: '' },
  { id: 'v-002', name: 'Barclays Center', cityId: 'nyc', capacity: 19000, type: 'arena', imageUrl: '' },
  { id: 'v-003', name: 'Radio City Music Hall', cityId: 'nyc', capacity: 5960, type: 'theater', imageUrl: '' },

  // LOS ANGELES
  { id: 'v-004', name: 'SoFi Stadium', cityId: 'la', capacity: 70240, type: 'stadium', imageUrl: '' },
  { id: 'v-005', name: 'The Forum', cityId: 'la', capacity: 17505, type: 'arena', imageUrl: '' },
  { id: 'v-006', name: 'Hollywood Bowl', cityId: 'la', capacity: 17500, type: 'theater', imageUrl: '' },

  // NASHVILLE
  { id: 'v-007', name: 'Bridgestone Arena', cityId: 'nashville', capacity: 19902, type: 'arena', imageUrl: '' },
  { id: 'v-008', name: 'Ryman Auditorium', cityId: 'nashville', capacity: 2362, type: 'theater', imageUrl: '' },
  { id: 'v-009', name: 'Nissan Stadium', cityId: 'nashville', capacity: 69143, type: 'stadium', imageUrl: '' },

  // ATLANTA
  { id: 'v-010', name: 'State Farm Arena', cityId: 'atlanta', capacity: 21000, type: 'arena', imageUrl: '' },
  { id: 'v-011', name: 'Mercedes-Benz Stadium', cityId: 'atlanta', capacity: 71000, type: 'stadium', imageUrl: '' },

  // CHICAGO
  { id: 'v-012', name: 'United Center', cityId: 'chicago', capacity: 20917, type: 'arena', imageUrl: '' },
  { id: 'v-013', name: 'Soldier Field', cityId: 'chicago', capacity: 61500, type: 'stadium', imageUrl: '' },
  { id: 'v-014', name: 'Chicago Theatre', cityId: 'chicago', capacity: 3600, type: 'theater', imageUrl: '' },

  // HOUSTON
  { id: 'v-015', name: 'Toyota Center', cityId: 'houston', capacity: 18104, type: 'arena', imageUrl: '' },
  { id: 'v-016', name: 'NRG Stadium', cityId: 'houston', capacity: 72220, type: 'stadium', imageUrl: '' },

  // MIAMI
  { id: 'v-017', name: 'Kaseya Center', cityId: 'miami', capacity: 19600, type: 'arena', imageUrl: '' },
  { id: 'v-018', name: 'Hard Rock Stadium', cityId: 'miami', capacity: 64767, type: 'stadium', imageUrl: '' },

  // DALLAS
  { id: 'v-019', name: 'American Airlines Center', cityId: 'dallas', capacity: 19200, type: 'arena', imageUrl: '' },
  { id: 'v-020', name: 'AT&T Stadium', cityId: 'dallas', capacity: 80000, type: 'stadium', imageUrl: '' },

  // LAS VEGAS
  { id: 'v-021', name: 'T-Mobile Arena', cityId: 'lasvegas', capacity: 20000, type: 'arena', imageUrl: '' },
  { id: 'v-022', name: 'Allegiant Stadium', cityId: 'lasvegas', capacity: 65000, type: 'stadium', imageUrl: '' },
  { id: 'v-023', name: 'MGM Grand Garden Arena', cityId: 'lasvegas', capacity: 16800, type: 'arena', imageUrl: '' },

  // SEATTLE
  { id: 'v-024', name: 'Climate Pledge Arena', cityId: 'seattle', capacity: 18100, type: 'arena', imageUrl: '' },
  { id: 'v-025', name: 'Lumen Field', cityId: 'seattle', capacity: 68740, type: 'stadium', imageUrl: '' },

  // DENVER
  { id: 'v-026', name: 'Ball Arena', cityId: 'denver', capacity: 20000, type: 'arena', imageUrl: '' },
  { id: 'v-027', name: 'Empower Field at Mile High', cityId: 'denver', capacity: 76125, type: 'stadium', imageUrl: '' },

  // DETROIT
  { id: 'v-028', name: 'Little Caesars Arena', cityId: 'detroit', capacity: 20332, type: 'arena', imageUrl: '' },
  { id: 'v-029', name: 'Ford Field', cityId: 'detroit', capacity: 65000, type: 'stadium', imageUrl: '' },

  // PHILADELPHIA
  { id: 'v-030', name: 'Wells Fargo Center', cityId: 'philadelphia', capacity: 20478, type: 'arena', imageUrl: '' },
  { id: 'v-031', name: 'Lincoln Financial Field', cityId: 'philadelphia', capacity: 69596, type: 'stadium', imageUrl: '' },
];
```

### data/mockProducts.ts

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'throat_care' | 'hydration' | 'environment' | 'nutrition' | 'essentials';
  imageEmoji: string;      // Emoji placeholder for demo mode
  isFeatured: boolean;
  affiliateUrl: string;
}

export const mockProducts: Product[] = [
  // THROAT CARE
  {
    id: 'prod-001',
    name: 'Entertainer\'s Secret Throat Spray',
    description: 'Professional throat moisturizer used by Broadway performers and touring artists. Soothes and moisturizes dry vocal cords instantly.',
    price: 14.99,
    category: 'throat_care',
    imageEmoji: '💊',
    isFeatured: true,
    affiliateUrl: '#'
  },
  {
    id: 'prod-002',
    name: 'Throat Coat Tea — Lemon Echinacea',
    description: 'Traditional Medicinals Throat Coat with slippery elm bark. The industry-standard tea for vocalists. Coats and protects the throat.',
    price: 8.99,
    category: 'throat_care',
    imageEmoji: '🫖',
    isFeatured: true,
    affiliateUrl: '#'
  },
  {
    id: 'prod-003',
    name: 'Grether\'s Pastilles — Blackcurrant',
    description: 'Swiss-made glycerin pastilles favored by opera singers and professional vocalists worldwide. Gentle, long-lasting throat relief.',
    price: 11.99,
    category: 'throat_care',
    imageEmoji: '🍬',
    isFeatured: false,
    affiliateUrl: '#'
  },
  {
    id: 'prod-004',
    name: 'Vocal Eze Throat Spray',
    description: 'All-natural herbal throat spray with slippery elm and echinacea. Fast-acting formula designed specifically for singers.',
    price: 19.99,
    category: 'throat_care',
    imageEmoji: '🌿',
    isFeatured: false,
    affiliateUrl: '#'
  },

  // HYDRATION
  {
    id: 'prod-005',
    name: 'Portable Electric Tea Maker',
    description: 'Compact travel tea kettle with precise temperature control. Perfect for backstage brew. Heats to optimal 175°F for vocal teas.',
    price: 34.99,
    category: 'hydration',
    imageEmoji: '☕',
    isFeatured: true,
    affiliateUrl: '#'
  },
  {
    id: 'prod-006',
    name: 'Manuka Honey — UMF 15+',
    description: 'Premium New Zealand Manuka honey. Anti-inflammatory properties soothe the throat. Mix with warm water or tea before performances.',
    price: 42.99,
    category: 'hydration',
    imageEmoji: '🍯',
    isFeatured: false,
    affiliateUrl: '#'
  },
  {
    id: 'prod-007',
    name: 'Vocal Hydration Electrolyte Mix',
    description: 'Sugar-free electrolyte powder formulated for vocal hydration. Contains hyaluronic acid to support mucous membrane moisture.',
    price: 24.99,
    category: 'hydration',
    imageEmoji: '💧',
    isFeatured: false,
    affiliateUrl: '#'
  },

  // ENVIRONMENT
  {
    id: 'prod-008',
    name: 'MyPurMist Portable Vocal Steamer',
    description: 'Medical-grade personal steam inhaler. Delivers instant warm mist therapy to soothe and hydrate vocal cords. USB rechargeable, tour-friendly.',
    price: 49.99,
    category: 'environment',
    imageEmoji: '🌫️',
    isFeatured: true,
    affiliateUrl: '#'
  },
  {
    id: 'prod-009',
    name: 'Travel Humidifier — Hotel Room Size',
    description: 'Ultra-quiet portable humidifier that fits in any hotel room. Prevents dry air damage to vocal cords during tours. 8-hour runtime.',
    price: 39.99,
    category: 'environment',
    imageEmoji: '💨',
    isFeatured: false,
    affiliateUrl: '#'
  },
  {
    id: 'prod-010',
    name: 'Vicks VapoSteam Inhalant',
    description: 'Medicated inhalant for use with steam vaporizers. Camphor and eucalyptus formula opens airways and soothes throat irritation.',
    price: 7.99,
    category: 'environment',
    imageEmoji: '🫁',
    isFeatured: false,
    affiliateUrl: '#'
  },

  // NUTRITION
  {
    id: 'prod-011',
    name: 'Vocal Health Fruit Box',
    description: 'Curated box of vocalist-friendly fruits: pears, melon, grapes, and berries. High water content fruits that hydrate without causing acid reflux.',
    price: 29.99,
    category: 'nutrition',
    imageEmoji: '🍎',
    isFeatured: true,
    affiliateUrl: '#'
  },
  {
    id: 'prod-012',
    name: 'Ginger Root Chews — Organic',
    description: 'Organic crystallized ginger chews. Natural anti-inflammatory that reduces vocal cord swelling. Perfect pre-show snack.',
    price: 9.99,
    category: 'nutrition',
    imageEmoji: '🫚',
    isFeatured: false,
    affiliateUrl: '#'
  },

  // ESSENTIALS
  {
    id: 'prod-013',
    name: 'Backstage Vocal Kit',
    description: 'Complete dressing room kit: throat spray, tea bags, honey sticks, steamer, and a microfiber towel. Everything you need in one bag.',
    price: 79.99,
    category: 'essentials',
    imageEmoji: '🎒',
    isFeatured: true,
    affiliateUrl: '#'
  },
  {
    id: 'prod-014',
    name: 'LED Vanity Mirror — Portable',
    description: 'Compact LED vanity mirror with 3 lighting modes. Perfect for dressing rooms and hotel rooms. Foldable for travel.',
    price: 24.99,
    category: 'essentials',
    imageEmoji: '🪞',
    isFeatured: false,
    affiliateUrl: '#'
  },
];
```

### data/mockBrands.ts

```typescript
export interface PartnerBrand {
  id: string;
  name: string;
  category: 'IEM' | 'microphone' | 'accessories' | 'vocal_fx';
  discountCode: string;
  discountPercent: number;
  isActive: boolean;
}

export interface GearProduct {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  description: string;
  category: 'IEM' | 'microphone' | 'accessories' | 'vocal_fx' | 'cables';
  price: number;
  partnerPrice: number;
  discountCode: string;
  discountPercent: number;
  imageEmoji: string;
  purchaseUrl: string;
  isFeatured: boolean;
}

export const mockBrands: PartnerBrand[] = [
  { id: 'brand-shure', name: 'Shure', category: 'IEM', discountCode: 'RVMT-SHURE15', discountPercent: 15, isActive: true },
  { id: 'brand-64audio', name: '64 Audio', category: 'IEM', discountCode: 'RVMT-64A10', discountPercent: 10, isActive: true },
  { id: 'brand-ue', name: 'Ultimate Ears', category: 'IEM', discountCode: 'RVMT-UE10', discountPercent: 10, isActive: true },
  { id: 'brand-westone', name: 'Westone', category: 'IEM', discountCode: 'RVMT-WEST12', discountPercent: 12, isActive: true },
  { id: 'brand-senn', name: 'Sennheiser', category: 'microphone', discountCode: 'RVMT-SENN20', discountPercent: 20, isActive: true },
  { id: 'brand-at', name: 'Audio-Technica', category: 'microphone', discountCode: 'RVMT-AT15', discountPercent: 15, isActive: true },
  { id: 'brand-tc', name: 'TC Helicon', category: 'vocal_fx', discountCode: 'RVMT-TCH10', discountPercent: 10, isActive: true },
];

export const mockGearProducts: GearProduct[] = [
  // IN-EAR MONITORS (Featured)
  {
    id: 'gear-001',
    brandId: 'brand-shure',
    brandName: 'Shure',
    name: 'SE846 Pro',
    description: 'Quad high-definition micro-driver design. Industry-leading sound isolation with customizable frequency response. The gold standard for touring professionals.',
    category: 'IEM',
    price: 899.00,
    partnerPrice: 764.15,
    discountCode: 'RVMT-SHURE15',
    discountPercent: 15,
    imageEmoji: '🎧',
    purchaseUrl: '#',
    isFeatured: true
  },
  {
    id: 'gear-002',
    brandId: 'brand-64audio',
    brandName: '64 Audio',
    name: 'U6t',
    description: '6-driver universal-fit IEM with tia high driver for unparalleled treble clarity. LID (Linear Impedance Design) ensures consistent sound across all sources.',
    category: 'IEM',
    price: 1299.00,
    partnerPrice: 1169.10,
    discountCode: 'RVMT-64A10',
    discountPercent: 10,
    imageEmoji: '🎧',
    purchaseUrl: '#',
    isFeatured: true
  },
  {
    id: 'gear-003',
    brandId: 'brand-ue',
    brandName: 'Ultimate Ears',
    name: 'UE LIVE',
    description: 'Custom-molded in-ear monitors with 6 balanced armature drivers and 1 dynamic driver. Used by artists on the world\'s biggest stages.',
    category: 'IEM',
    price: 2199.00,
    partnerPrice: 1979.10,
    discountCode: 'RVMT-UE10',
    discountPercent: 10,
    imageEmoji: '🎧',
    purchaseUrl: '#',
    isFeatured: true
  },
  {
    id: 'gear-004',
    brandId: 'brand-westone',
    brandName: 'Westone',
    name: 'Mach 60',
    description: '6-driver in-ear monitor with 3-way crossover. Audiophile-grade sound in a compact, comfortable fit. Braided MMCX cable for durability on tour.',
    category: 'IEM',
    price: 999.00,
    partnerPrice: 879.12,
    discountCode: 'RVMT-WEST12',
    discountPercent: 12,
    imageEmoji: '🎧',
    purchaseUrl: '#',
    isFeatured: true
  },

  // MICROPHONES
  {
    id: 'gear-005',
    brandId: 'brand-senn',
    brandName: 'Sennheiser',
    name: 'e945 Supercardioid Vocal Mic',
    description: 'Professional supercardioid dynamic microphone. Superior feedback rejection for live performance. Smooth, detailed vocal reproduction.',
    category: 'microphone',
    price: 249.00,
    partnerPrice: 199.20,
    discountCode: 'RVMT-SENN20',
    discountPercent: 20,
    imageEmoji: '🎤',
    purchaseUrl: '#',
    isFeatured: false
  },
  {
    id: 'gear-006',
    brandId: 'brand-at',
    brandName: 'Audio-Technica',
    name: 'AE5400 Condenser Vocal Mic',
    description: 'Cardioid condenser microphone with exceptional clarity for live vocals. Low-mass diaphragm captures every nuance of your performance.',
    category: 'microphone',
    price: 449.00,
    partnerPrice: 381.65,
    discountCode: 'RVMT-AT15',
    discountPercent: 15,
    imageEmoji: '🎤',
    purchaseUrl: '#',
    isFeatured: false
  },

  // VOCAL FX
  {
    id: 'gear-007',
    brandId: 'brand-tc',
    brandName: 'TC Helicon',
    name: 'VoiceLive Play',
    description: 'All-in-one vocal effects processor with harmony, reverb, delay, and pitch correction. Foot-switchable for live performance.',
    category: 'vocal_fx',
    price: 349.00,
    partnerPrice: 314.10,
    discountCode: 'RVMT-TCH10',
    discountPercent: 10,
    imageEmoji: '🎛️',
    purchaseUrl: '#',
    isFeatured: false
  },

  // ACCESSORIES
  {
    id: 'gear-008',
    brandId: 'brand-shure',
    brandName: 'Shure',
    name: 'IEM Cable Replacement Kit',
    description: 'Replacement detachable cable for Shure SE series IEMs. Kevlar-reinforced with gold-plated MMCX connectors.',
    category: 'cables',
    price: 49.00,
    partnerPrice: 41.65,
    discountCode: 'RVMT-SHURE15',
    discountPercent: 15,
    imageEmoji: '🔌',
    purchaseUrl: '#',
    isFeatured: false
  },
  {
    id: 'gear-009',
    brandId: 'brand-westone',
    brandName: 'Westone',
    name: 'Monitor Vault II Case',
    description: 'Rugged zippered carry case for in-ear monitors. Dehumidifier compartment to protect drivers. Carabiner clip for gig bags.',
    category: 'accessories',
    price: 25.00,
    partnerPrice: 22.00,
    discountCode: 'RVMT-WEST12',
    discountPercent: 12,
    imageEmoji: '🧳',
    purchaseUrl: '#',
    isFeatured: false
  },
];
```

### data/mockChecklist.ts

```typescript
export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  category: 'vocal' | 'gear' | 'wellness' | 'logistics';
}

export const defaultChecklist: ChecklistItem[] = [
  { id: 'check-01', label: 'Hydration — 8+ glasses of water today', description: 'Start hydrating 24 hours before showtime', category: 'wellness' },
  { id: 'check-02', label: 'Vocal warmup completed', description: 'Use RVMT training exercises to warm up', category: 'vocal' },
  { id: 'check-03', label: 'Steam session done', description: '10-15 minutes with your portable steamer', category: 'wellness' },
  { id: 'check-04', label: 'Throat care products packed', description: 'Throat spray, tea, honey, lozenges', category: 'wellness' },
  { id: 'check-05', label: 'IEMs charged & tested', description: 'Check all drivers, clean ear tips', category: 'gear' },
  { id: 'check-06', label: 'Set list reviewed', description: 'Know your keys, transitions, and trouble spots', category: 'logistics' },
  { id: 'check-07', label: 'Sound check notes ready', description: 'Monitor mix preferences written down for FOH', category: 'gear' },
  { id: 'check-08', label: 'Emergency vocal kit packed', description: 'Backup everything: tea, honey, throat spray, steamer', category: 'wellness' },
];
```

---

## Database Schema — NEW Tables

### products (Vocal Rider Store)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | Product name |
| description | text | Full description |
| price | decimal | Retail price |
| category | text | 'throat_care' \| 'hydration' \| 'environment' \| 'nutrition' \| 'essentials' |
| image_url | text | Product image URL |
| affiliate_url | text | External purchase link |
| is_featured | boolean | Show on home page |
| created_at | timestamptz | Timestamp |

**RLS:** Public read access (anyone can browse store). Admin-only write.

### medical_providers

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | Doctor/provider name |
| credentials | text | 'MD' \| 'DO' \| 'SLP' \| 'DMA' |
| specialty | text | 'Laryngologist' \| 'ENT' \| 'Voice Therapist' \| 'Vocal Coach' |
| city_id | text (FK) | References cities.id |
| neighborhood | text | Specific area within city |
| rating | decimal | 1-5 stars |
| review_count | integer | Number of reviews |
| phone | text | Contact phone |
| bio | text | Full biography |
| booking_url | text | Online booking link |
| image_url | text | Profile photo URL |
| is_verified | boolean | Verified by RVMT |
| created_at | timestamptz | Timestamp |

**RLS:** Public read access. Admin-only write.

### cities

| Column | Type | Notes |
|--------|------|-------|
| id | text (PK) | e.g., 'nyc', 'la' |
| name | text | Display name |
| state | text | State abbreviation |
| map_x | integer | SVG x coordinate |
| map_y | integer | SVG y coordinate |
| latitude | decimal | Real latitude |
| longitude | decimal | Real longitude |

**RLS:** Public read.

### venues

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | Venue name |
| city_id | text (FK) | References cities.id |
| capacity | integer | Seated capacity |
| type | text | 'arena' \| 'stadium' \| 'theater' \| 'club' |
| image_url | text | Venue photo |

**RLS:** Public read.

### partner_brands

| Column | Type | Notes |
|--------|------|-------|
| id | text (PK) | e.g., 'brand-shure' |
| name | text | Brand name |
| category | text | 'IEM' \| 'microphone' \| 'accessories' \| 'vocal_fx' |
| discount_code | text | e.g., 'RVMT-SHURE15' |
| discount_percent | decimal | e.g., 15 |
| is_active | boolean | Currently partnered |

**RLS:** Public read.

### gear_products

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| brand_id | text (FK) | References partner_brands.id |
| name | text | Product name |
| description | text | Full description |
| category | text | 'IEM' \| 'microphone' \| 'accessories' \| 'vocal_fx' \| 'cables' |
| price | decimal | Retail price |
| partner_price | decimal | Discounted price |
| image_url | text | Product image |
| purchase_url | text | Affiliate/purchase link |
| is_featured | boolean | Show in IEM showcase |

**RLS:** Public read.

### prep_checklists

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK) | References profiles.id |
| checklist_data | jsonb | `{ "check-01": true, "check-02": false, ... }` |
| event_name | text | Optional: "NYC Show 2/15" |
| event_date | date | Optional |
| created_at | timestamptz | Timestamp |

**RLS:** Users can CRUD their own checklists only.

---

## Existing Database & Features (Unchanged)

All existing tables, RLS policies, edge functions, audio engine, and components remain exactly as documented in v1.0. The new features are purely additive — no breaking changes to existing functionality.

Refer to the original prompt for:

- **profiles, songs, stems, playlists, playlist_songs, practice_sessions, user_song_progress** — unchanged
- **has_premium_access()** function — unchanged
- **get-audio-url** edge function — unchanged
- **Howler.js audio sync engine** — unchanged (useAudioPlayer.ts)
- **Audio store, user store** — unchanged
- **All existing components** — unchanged
- **Security model / RLS** — unchanged, new tables follow same patterns

---

## Audio System Architecture (Reference — Unchanged)

The Howler.js multi-stem player (useAudioPlayer.ts) is the most complex component. Key parameters:

```
SYNC_TOLERANCE_SEC = 0.08
DRIFT_CORRECTION_THRESHOLD = 0.15
THROTTLE_MS = 50
SEEK_SYNC_DELAY_MS = 150
```

Do NOT modify the audio engine when adding new features. The new modules (Store, Medical, Stage Prep) are completely independent of the audio system.

---

## Implementation Notes for Lovable

1. **Start with mock data** — All new features should work immediately using the mock data files above. No Supabase table population required for initial build.

2. **Use existing glass-card components** — The new features should use the same `glass-card`, `glass-button`, and glassmorphism system. Only the Store gets the warm "dressing room" sub-theme.

3. **Mobile-first** — All new pages must be fully responsive. The USAMap component should work well on mobile with tap targets at least 44px.

4. **Framer Motion everywhere** — Use `AnimatePresence` for city selection transitions, `whileTap` for interactive elements, staggered entry for card grids.

5. **Horizontal scroll sections** on Home use `overflow-x-auto` with `snap-x snap-mandatory` and `scroll-snap-align: start` on each card.

6. **Bottom nav update** — Replace the current 4th tab icon with a diamond/hub icon (◆ or use Lucide `LayoutGrid`). The Hub page is the gateway to all three new modules.

7. **No real e-commerce yet** — The Store uses affiliate links only. Products open external URLs. No cart/checkout in Phase 1.

8. **USA Map SVG** — Use a simplified continental US outline. A good source is a single `<path>` element. The map does NOT need to show state borders — just the country outline with city dots on top.

9. **Doctor avatars** — Use colored initials avatars (like `<div className="bg-red-500/20 text-red-400 rounded-full w-12 h-12 flex items-center justify-center font-bold">SC</div>`) for demo mode since we don't have real photos.

10. **Prep checklist persistence** — For logged-out users, use localStorage. For logged-in users, sync to `prep_checklists` table in Supabase.
