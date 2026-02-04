-- Insert "12. TESTIFY (VERSION 2)" song
INSERT INTO public.songs (id, title, artist, cover_art, duration, bpm, key, difficulty, genre, is_premium, full_mix_url)
VALUES (
  'testify-v2',
  '12. TESTIFY (VERSION 2)',
  'RVMT',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
  180,
  90,
  'G Major',
  'intermediate',
  'Gospel',
  false,
  ''
);

-- Insert stems for "12. TESTIFY (VERSION 2)" - 10 of 14 tracks (first batch)
INSERT INTO public.stems (id, song_id, name, type, audio_path, color, position) VALUES
  ('testify-v2-acapella', 'testify-v2', 'Acapella (Master)', 'vocal', '/audio/testify-v2/acapella.mp3', '#14b8a6', 0),
  ('testify-v2-blakeley-first', 'testify-v2', 'Blakeley First', 'vocal', '/audio/testify-v2/blakeley-first.mp3', '#3b82f6', 1),
  ('testify-v2-blakeley-second', 'testify-v2', 'Blakeley Second', 'harmony', '/audio/testify-v2/blakeley-second.mp3', '#a855f7', 2),
  ('testify-v2-blakeley-third', 'testify-v2', 'Blakeley Third', 'harmony', '/audio/testify-v2/blakeley-third.mp3', '#c084fc', 3),
  ('testify-v2-blakeley-fourth', 'testify-v2', 'Blakeley Fourth', 'harmony', '/audio/testify-v2/blakeley-fourth.mp3', '#e879f9', 4),
  ('testify-v2-justin-first', 'testify-v2', 'Justin First', 'vocal', '/audio/testify-v2/justin-first.mp3', '#06b6d4', 5),
  ('testify-v2-justin-second', 'testify-v2', 'Justin Second', 'harmony', '/audio/testify-v2/justin-second.mp3', '#22d3ee', 6),
  ('testify-v2-justin-third', 'testify-v2', 'Justin Third', 'harmony', '/audio/testify-v2/justin-third.mp3', '#67e8f9', 7),
  ('testify-v2-raab-second', 'testify-v2', 'RAab Second', 'harmony', '/audio/testify-v2/raab-second.mp3', '#d946ef', 8),
  ('testify-v2-raab-fourth', 'testify-v2', 'RAab Fourth', 'harmony', '/audio/testify-v2/raab-fourth.mp3', '#f472b6', 9);