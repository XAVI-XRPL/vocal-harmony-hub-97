
-- Drop the existing restrictive SELECT policies on songs
DROP POLICY IF EXISTS "Anyone can view free songs" ON public.songs;
DROP POLICY IF EXISTS "Premium subscribers can view premium songs" ON public.songs;

-- Create a single policy that lets everyone see all songs
-- The UI handles showing lock overlays for premium content
CREATE POLICY "Songs are publicly readable"
  ON public.songs
  FOR SELECT
  USING (true);
