-- Create playlists table
CREATE TABLE public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create playlist_songs junction table
CREATE TABLE public.playlist_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  song_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate songs in same playlist
ALTER TABLE public.playlist_songs ADD CONSTRAINT unique_playlist_song UNIQUE (playlist_id, song_id);

-- Enable Row Level Security
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for playlists table
CREATE POLICY "Users can view their own playlists" 
  ON public.playlists 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists" 
  ON public.playlists 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" 
  ON public.playlists 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" 
  ON public.playlists 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for playlist_songs table
CREATE POLICY "Users can view songs in their playlists" 
  ON public.playlist_songs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE id = playlist_songs.playlist_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add songs to their playlists" 
  ON public.playlist_songs 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE id = playlist_songs.playlist_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update songs in their playlists" 
  ON public.playlist_songs 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE id = playlist_songs.playlist_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove songs from their playlists" 
  ON public.playlist_songs 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE id = playlist_songs.playlist_id 
      AND user_id = auth.uid()
    )
  );

-- Add trigger for automatic timestamp updates on playlists
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();