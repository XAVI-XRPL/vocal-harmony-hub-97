-- Add display_order column to songs table
ALTER TABLE songs ADD COLUMN display_order INTEGER;

-- Set order values for existing songs
UPDATE songs SET display_order = 1 WHERE id = 'testify-exercise';
UPDATE songs SET display_order = 2 WHERE id = 'throwback-exercise';
UPDATE songs SET display_order = 3 WHERE id = 'dont-leave-exercise';
UPDATE songs SET display_order = 4 WHERE id = 'testify-v2';

-- Delete BOUNCING ON A BLESSING stems first (foreign key constraint)
DELETE FROM stems WHERE song_id = 'bouncing-on-a-blessing';

-- Delete BOUNCING ON A BLESSING song
DELETE FROM songs WHERE id = 'bouncing-on-a-blessing';