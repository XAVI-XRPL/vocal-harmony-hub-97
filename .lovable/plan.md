
# Fix Client-Side Premium Content Checks - Server-Side Enforcement

## Problem Summary

The current implementation has a critical security vulnerability: premium content access is validated only in the frontend using `canAccessPremiumContent()` from the user store. This allows attackers to bypass restrictions by:
1. Modifying localStorage to set `subscriptionTier` to 'pro'
2. Directly accessing song URLs from browser network tab
3. Bypassing UI restrictions via browser DevTools

Currently, all song data (including premium flags and audio URLs) comes from a client-side mock file (`mockSongs.ts`), making it trivial to access premium content without paying.

---

## Solution Overview

Implement proper server-side subscription enforcement with the following approach:

1. **Add subscription tier to profiles table** - Store user subscription status in the database
2. **Create a songs table** - Move song metadata from client-side mock to database
3. **Add RLS policies** - Enforce premium content access at the database level
4. **Create an edge function for audio access** - Serve audio files through a server-side endpoint that validates subscription
5. **Update frontend** - Fetch songs from database instead of mock data

---

## Technical Implementation

### Phase 1: Database Schema Changes

**1. Add subscription columns to profiles table:**

```sql
ALTER TABLE public.profiles 
ADD COLUMN subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
ADD COLUMN subscription_expires_at TIMESTAMPTZ DEFAULT NULL;
```

**2. Create songs table:**

```sql
CREATE TABLE public.songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  cover_art TEXT NOT NULL,
  duration INTEGER NOT NULL,
  bpm INTEGER,
  key TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  genre TEXT NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Everyone can view non-premium songs
CREATE POLICY "Anyone can view free songs"
  ON public.songs FOR SELECT
  USING (NOT is_premium);

-- Premium songs require valid subscription
CREATE POLICY "Premium subscribers can view premium songs"
  ON public.songs FOR SELECT
  USING (
    is_premium AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND subscription_tier IN ('pro', 'premium')
      AND (subscription_expires_at IS NULL OR subscription_expires_at > now())
    )
  );
```

**3. Create stems table:**

```sql
CREATE TABLE public.stems (
  id TEXT PRIMARY KEY,
  song_id TEXT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vocal', 'harmony', 'instrumental', 'drums', 'bass', 'keys', 'other')),
  audio_path TEXT NOT NULL,  -- Path in storage bucket, not public URL
  color TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.stems ENABLE ROW LEVEL SECURITY;

-- Stems follow their parent song's access rules
CREATE POLICY "Users can view stems for accessible songs"
  ON public.stems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.songs s
      WHERE s.id = stems.song_id
      AND (
        NOT s.is_premium 
        OR EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() 
          AND subscription_tier IN ('pro', 'premium')
          AND (subscription_expires_at IS NULL OR subscription_expires_at > now())
        )
      )
    )
  );
```

### Phase 2: Edge Function for Secure Audio Streaming

Create an edge function that validates subscription before serving audio URLs:

**File: `supabase/functions/get-audio-url/index.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  // Verify user
  const token = authHeader.replace('Bearer ', '');
  const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
  if (claimsError || !claims?.claims) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const userId = claims.claims.sub;
  const url = new URL(req.url);
  const stemId = url.searchParams.get('stemId');

  if (!stemId) {
    return new Response(JSON.stringify({ error: 'Missing stemId' }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // RLS will enforce subscription check automatically
  const { data: stem, error: stemError } = await supabase
    .from('stems')
    .select('audio_path, song_id, songs!inner(is_premium)')
    .eq('id', stemId)
    .single();

  if (stemError || !stem) {
    return new Response(JSON.stringify({ error: 'Stem not found or access denied' }), { 
      status: 404, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Return the audio URL (or signed URL from storage bucket)
  return new Response(JSON.stringify({ 
    url: `/audio/${stem.audio_path}`,
    stemId 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

### Phase 3: Frontend Updates

**1. Create data fetching hook:**

**File: `src/hooks/useSongs.ts`**

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Song, Stem } from '@/types';

export function useSongs() {
  return useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data: songs, error } = await supabase
        .from('songs')
        .select(`*, stems(*)`);
      
      if (error) throw error;
      return songs as Song[];
    }
  });
}

export function useSong(id: string) {
  return useQuery({
    queryKey: ['song', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select(`*, stems(*)`)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Song;
    },
    enabled: !!id
  });
}
```

**2. Update userStore to sync with database:**

- Remove local-only subscription state
- Fetch subscription status from profiles table
- Update `canAccessPremiumContent()` to be used only for UI display (server enforces actual access)

**3. Update components:**

- `SongCard.tsx` - Fetch from database, locked status based on query results (if song not returned, it's premium)
- `SongDetail.tsx` - Use `useSong()` hook
- `TrainingMode.tsx` - Use `useSong()` hook
- `Library.tsx` - Use `useSongs()` hook

### Phase 4: Seed Existing Songs

Create a migration to seed the existing mock songs into the database:

```sql
-- Insert existing songs
INSERT INTO public.songs (id, title, artist, cover_art, duration, bpm, key, difficulty, genre, is_premium)
VALUES 
  ('testify-exercise', '1. TESTIFY EXERCISE', 'RVMT', 'https://images.unsplash.com/...', 180, 90, 'G Major', 'beginner', 'Gospel', false),
  ('throwback-exercise', '2. THROWBACK EXERCISE', 'RVMT', '...', 180, 95, 'C Major', 'beginner', 'Gospel', false);

-- Insert stems for each song
INSERT INTO public.stems (id, song_id, name, type, audio_path, color, position)
VALUES 
  ('testify-raab-coaching', 'testify-exercise', 'RAab Coaching (Master)', 'vocal', 'testify-exercise/raab-coaching.mp3', '#14b8a6', 0),
  -- ... more stems
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/xxx_add_subscription_and_songs.sql` | Create | Database schema changes |
| `supabase/functions/get-audio-url/index.ts` | Create | Secure audio URL endpoint |
| `src/hooks/useSongs.ts` | Create | Data fetching from database |
| `src/stores/userStore.ts` | Modify | Sync subscription with database |
| `src/components/song/SongCard.tsx` | Modify | Use database data |
| `src/pages/SongDetail.tsx` | Modify | Use `useSong()` hook |
| `src/pages/TrainingMode.tsx` | Modify | Use `useSong()` hook |
| `src/pages/Library.tsx` | Modify | Use `useSongs()` hook |
| `src/pages/Home.tsx` | Modify | Use `useSongs()` hook |
| `src/integrations/supabase/types.ts` | Auto-update | Generated types |

---

## Security Enforcement Flow

```text
User requests song data
       |
       v
Frontend calls supabase.from('songs').select()
       |
       v
RLS policy checks:
  - Is song premium? 
  - If yes, does user have valid subscription in profiles table?
       |
       v
Only accessible songs returned (premium songs filtered out for free users)
       |
       v
User tries to play audio
       |
       v
Edge function validates subscription before returning audio URL
       |
       v
Audio plays (or access denied error shown)
```

---

## Why This Fix Works

1. **Server-side enforcement** - RLS policies run on the database server, not client
2. **Cannot bypass with DevTools** - Subscription check happens in database query
3. **Cannot modify localStorage** - Subscription tier is stored in database, not localStorage
4. **Audio URLs protected** - Edge function validates before serving audio
5. **Subscription status synchronized** - Frontend reads from database, not local state
6. **Graceful degradation** - Free users see limited song list, premium users see all

---

## Expected Result

| Attack Vector | Before | After |
|---------------|--------|-------|
| Modify localStorage | Bypasses checks | No effect (data from DB) |
| Access URLs directly | Works | Returns 401/404 |
| DevTools bypass | Works | No effect (server enforces) |
| Edit mock data | Works | Not possible (no mock data) |

This comprehensive fix ensures premium content is protected at every layer - database, edge function, and frontend - making it impossible to bypass subscription requirements through client-side manipulation.
