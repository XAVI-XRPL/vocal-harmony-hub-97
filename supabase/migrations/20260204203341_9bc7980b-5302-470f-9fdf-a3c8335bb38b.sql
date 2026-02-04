-- Add DELETE policy for practice_sessions
-- Allows users to delete their own practice session records
CREATE POLICY "Users can delete their own practice sessions"
  ON public.practice_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add DELETE policy for user_song_progress
-- Allows users to delete their own song progress records
CREATE POLICY "Users can delete their own song progress"
  ON public.user_song_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);