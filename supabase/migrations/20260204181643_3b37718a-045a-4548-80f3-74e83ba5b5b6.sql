-- Phase 1: Add subscription columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
ADD COLUMN subscription_expires_at TIMESTAMPTZ DEFAULT NULL;

-- Phase 2: Create songs table
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
  full_mix_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on songs
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Everyone can view non-premium songs (no auth required)
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

-- Phase 3: Create stems table
CREATE TABLE public.stems (
  id TEXT PRIMARY KEY,
  song_id TEXT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vocal', 'harmony', 'instrumental', 'drums', 'bass', 'keys', 'other')),
  audio_path TEXT NOT NULL,
  color TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on stems
ALTER TABLE public.stems ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check subscription status
CREATE OR REPLACE FUNCTION public.has_premium_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _user_id 
    AND subscription_tier IN ('pro', 'premium')
    AND (subscription_expires_at IS NULL OR subscription_expires_at > now())
  )
$$;

-- Stems follow their parent song's access rules
CREATE POLICY "Users can view stems for free songs"
  ON public.stems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.songs s
      WHERE s.id = stems.song_id
      AND NOT s.is_premium
    )
  );

CREATE POLICY "Premium users can view stems for premium songs"
  ON public.stems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.songs s
      WHERE s.id = stems.song_id
      AND s.is_premium
    )
    AND public.has_premium_access(auth.uid())
  );

-- Phase 4: Seed existing songs data
INSERT INTO public.songs (id, title, artist, cover_art, duration, bpm, key, difficulty, genre, is_premium, full_mix_url)
VALUES 
  ('testify-exercise', '1. TESTIFY EXERCISE', 'RVMT', 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=400&fit=crop', 180, 90, 'G Major', 'beginner', 'Gospel', false, ''),
  ('throwback-exercise', '2. THROWBACK EXERCISE', 'RVMT', '/assets/throwback-exercise-cover.jpg', 180, 95, 'C Major', 'beginner', 'Gospel', false, '');

-- Seed stems for testify-exercise
INSERT INTO public.stems (id, song_id, name, type, audio_path, color, position)
VALUES 
  ('testify-raab-coaching', 'testify-exercise', 'RAab Coaching (Master)', 'vocal', '/audio/testify-exercise/raab-coaching.mp3', '#14b8a6', 0),
  ('testify-instrumental', 'testify-exercise', 'Instrumental', 'instrumental', '/audio/testify-exercise/instrumental.mp3', '#f59e0b', 1),
  ('testify-piano', 'testify-exercise', 'Piano', 'keys', '/audio/testify-exercise/piano.mp3', '#10b981', 2),
  ('testify-guitar', 'testify-exercise', 'Guitar', 'instrumental', '/audio/testify-exercise/guitar.mp3', '#f97316', 3),
  ('testify-raab-exercise', 'testify-exercise', 'RAab Exercise (Lead)', 'vocal', '/audio/testify-exercise/raab-exercise.mp3', '#22d3ee', 4),
  ('testify-jlevy-exercise', 'testify-exercise', 'JLevy Exercise 1', 'vocal', '/audio/testify-exercise/jlevy-exercise-1.mp3', '#06b6d4', 5),
  ('testify-raab-harmony-2', 'testify-exercise', 'RAab Harmony 2', 'harmony', '/audio/testify-exercise/raab-harmony-2.mp3', '#a855f7', 6),
  ('testify-jlevy-harmony-2', 'testify-exercise', 'JLevy Harmony 2', 'harmony', '/audio/testify-exercise/jlevy-harmony-2.mp3', '#c084fc', 7),
  ('testify-raab-harmony-3', 'testify-exercise', 'RAab Harmony 3', 'harmony', '/audio/testify-exercise/raab-harmony-3.mp3', '#e879f9', 8);

-- Seed stems for throwback-exercise
INSERT INTO public.stems (id, song_id, name, type, audio_path, color, position)
VALUES 
  ('throwback-raab-coaching', 'throwback-exercise', 'RAab Coaching (Master)', 'vocal', '/audio/throwback-exercise/raab-coaching.mp3', '#14b8a6', 0),
  ('throwback-instrumental', 'throwback-exercise', 'Instrumental', 'instrumental', '/audio/throwback-exercise/instrumental.mp3', '#f59e0b', 1),
  ('throwback-piano', 'throwback-exercise', 'Piano', 'keys', '/audio/throwback-exercise/piano.mp3', '#10b981', 2),
  ('throwback-guitar', 'throwback-exercise', 'Guitar', 'instrumental', '/audio/throwback-exercise/guitar.mp3', '#f97316', 3),
  ('throwback-raab-exercise', 'throwback-exercise', 'RAab Exercise (Lead)', 'vocal', '/audio/throwback-exercise/raab-exercise.mp3', '#22d3ee', 4),
  ('throwback-jlevy-exercise', 'throwback-exercise', 'JLevy Exercise 1', 'vocal', '/audio/throwback-exercise/jlevy-exercise-1.mp3', '#06b6d4', 5);