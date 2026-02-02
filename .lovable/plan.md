

# Build Custom Playlist Feature for Vocal Exercises

## Overview

Add the ability for users to create and manage custom playlists of their favorite vocal exercises. This feature will include a dedicated Playlists page, playlist management functionality, and integration with the existing training/practice flow.

---

## User Experience Flow

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         PLAYLIST JOURNEY                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. VIEW PLAYLISTS          2. CREATE PLAYLIST       3. MANAGE          │
│  ┌─────────────────┐        ┌─────────────────┐      ┌─────────────────┐│
│  │ 🎵 Warm-ups     │   +    │ Create New      │      │ Edit Name       ││
│  │ 🎵 Morning Voc  │  ───>  │ "Daily Practice"│ ───> │ Add/Remove Songs││
│  │ 🎵 Advanced     │        │                 │      │ Reorder         ││
│  └─────────────────┘        └─────────────────┘      └─────────────────┘│
│          │                                                   │          │
│          v                                                   v          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │               4. PLAY PLAYLIST IN TRAINING MODE                 │   │
│  │     Queue exercises → Auto-advance → Track progress             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| Create Playlist | Name and describe a new playlist |
| Add Exercises | Add songs/exercises from Library or Training pages |
| Remove Exercises | Remove items from a playlist |
| Reorder Exercises | Drag to change order in playlist |
| Edit Playlist | Rename or update description |
| Delete Playlist | Remove entire playlist |
| Play Playlist | Launch training mode with queued exercises |

### User Interface

| Screen | Purpose |
|--------|---------|
| Playlists Page | View all user playlists with exercise counts |
| Playlist Detail | View exercises in a playlist, edit, play |
| Create Dialog | Modal to create new playlist |
| Add to Playlist | Quick action from Library/SongCard |

---

## Database Design

### New Table: `playlists`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Owner (references profiles) |
| name | text | Playlist name |
| description | text | Optional description |
| cover_image_url | text | Optional custom cover |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last modified |

### New Table: `playlist_songs`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| playlist_id | uuid | Parent playlist |
| song_id | text | Exercise/song ID |
| position | integer | Order in playlist |
| added_at | timestamp | When added |

### RLS Policies

- Users can only view/edit/delete their own playlists
- Users can only modify songs in their own playlists

---

## Technical Implementation

### 1. Database Migration

Create two new tables with proper RLS policies:
- `playlists` - Stores playlist metadata
- `playlist_songs` - Junction table for playlist-song relationships

### 2. New Files

| File | Purpose |
|------|---------|
| `src/pages/Playlists.tsx` | Main playlists listing page |
| `src/pages/PlaylistDetail.tsx` | Single playlist view with exercises |
| `src/components/playlist/PlaylistCard.tsx` | Card component for playlist display |
| `src/components/playlist/CreatePlaylistDialog.tsx` | Modal for creating playlists |
| `src/components/playlist/AddToPlaylistDialog.tsx` | Modal for adding song to playlist |
| `src/hooks/usePlaylists.ts` | Data fetching and mutations for playlists |

### 3. Modified Files

| File | Changes |
|------|---------|
| `src/App.tsx` | Add routes for /playlists and /playlist/:id |
| `src/components/layout/DesktopSidebar.tsx` | Add Playlists nav item |
| `src/components/layout/MobileNav.tsx` | Update to include Playlists (replace or add) |
| `src/components/song/SongCard.tsx` | Add "Add to Playlist" action button |
| `src/types/index.ts` | Add Playlist and PlaylistSong types |

### 4. Navigation Updates

Add "Playlists" to the navigation with a ListMusic icon:
- Desktop: New sidebar item between Library and Progress
- Mobile: Could replace one item or add as a sub-menu in Library

---

## Component Architecture

```text
Playlists Page
├── Header (title: "My Playlists")
├── Create Playlist Button
├── PlaylistCard[] (grid/list)
│   ├── Cover Art (generated from first 4 songs)
│   ├── Name
│   ├── Song count
│   └── Play button
└── Empty State (if no playlists)

Playlist Detail Page
├── Header (playlist name, back button)
├── Playlist Info Card
│   ├── Cover Art
│   ├── Name + Description
│   ├── Edit/Delete buttons
│   └── Play All button
├── Songs List (draggable)
│   └── SongCard (compact variant)
│       └── Remove from playlist action
└── Add Songs button
```

---

## UI Design

### Playlist Card (Glass Morphism)

- 2x2 grid of song cover arts as thumbnail
- Playlist name with gradient text
- Song count and total duration
- Play button with glow effect
- Hover state with scale animation

### Dialogs

- Glass background matching app theme
- Smooth enter/exit animations
- Form validation for playlist name

---

## Technical Details

### Playlist Hook (`usePlaylists.ts`)

```typescript
// Functions to implement:
- fetchPlaylists() - Get all user playlists
- fetchPlaylistById(id) - Get single playlist with songs
- createPlaylist(name, description?) - Create new playlist
- updatePlaylist(id, updates) - Rename/update playlist
- deletePlaylist(id) - Remove playlist
- addSongToPlaylist(playlistId, songId) - Add exercise
- removeSongFromPlaylist(playlistId, songId) - Remove exercise
- reorderPlaylistSongs(playlistId, songIds[]) - Update order
```

### Type Definitions

```typescript
interface Playlist {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  songs?: PlaylistSong[];
}

interface PlaylistSong {
  id: string;
  playlistId: string;
  songId: string;
  position: number;
  addedAt: string;
  song?: Song; // Joined from mockSongs
}
```

---

## Implementation Order

1. **Database**: Create tables and RLS policies via migration
2. **Types**: Add Playlist types to `src/types/index.ts`
3. **Hook**: Create `usePlaylists.ts` with CRUD operations
4. **Playlists Page**: Build main listing page with empty state
5. **Create Dialog**: Add modal for new playlist creation
6. **Playlist Detail**: Build single playlist view
7. **SongCard Update**: Add "Add to Playlist" button
8. **Add to Playlist Dialog**: Modal for selecting playlist
9. **Navigation**: Update sidebar and mobile nav
10. **Routes**: Add new routes to App.tsx

---

## Authentication Requirement

This feature requires users to be authenticated since playlists are stored per-user. The UI will:
- Show playlists only to logged-in users
- Prompt sign-in when trying to create a playlist while logged out
- Hide "Add to Playlist" buttons for non-authenticated users

