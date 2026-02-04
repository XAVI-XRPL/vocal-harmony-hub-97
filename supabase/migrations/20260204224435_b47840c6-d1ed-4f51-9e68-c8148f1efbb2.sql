-- Insert the remaining 4 stems for TESTIFY V2 (positions 10-13)
INSERT INTO public.stems (id, song_id, name, type, audio_path, color, position) VALUES
  ('testify-v2-raab-first', 'testify-v2', 'RAab First', 'vocal', '/audio/testify-v2/raab-first.mp3', '#ec4899', 10),
  ('testify-v2-raab-second-alt', 'testify-v2', 'RAab Second (Alt)', 'harmony', '/audio/testify-v2/raab-second-2.mp3', '#f472b6', 11),
  ('testify-v2-raab-third', 'testify-v2', 'RAab Third', 'harmony', '/audio/testify-v2/raab-third.mp3', '#fb7185', 12),
  ('testify-v2-instrumental', 'testify-v2', 'Instrumental', 'instrumental', '/audio/testify-v2/instrumental.mp3', '#f59e0b', 13);