

# Test Premium Content Access Control

## Summary

This plan adds a premium song to the database and verifies that the RLS policies correctly block free users from accessing it. The current logged-in user has `subscription_tier: free`, so they should NOT be able to see or access premium content.

---

## Phase 1: Add Premium Song to Database

Insert a new premium song with stems to test the access control:

**SQL to execute:**

```sql
-- Insert premium song
INSERT INTO public.songs (id, title, artist, cover_art, duration, bpm, key, difficulty, genre, is_premium)
VALUES (
  'bouncing-on-a-blessing',
  '3. BOUNCING ON A BLESSING',
  'RVMT',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
  220,
  120,
  'E Major',
  'intermediate',
  'Gospel',
  true  -- This is a PREMIUM song
);

-- Insert stems for the premium song (using existing audio files in public/audio/bouncing-on-a-blessing/)
INSERT INTO public.stems (id, song_id, name, type, audio_path, color, position) VALUES
  ('bouncing-lead-vocals', 'bouncing-on-a-blessing', 'Lead Vocals', 'vocal', '/audio/bouncing-on-a-blessing/lead-vocals.mp3', '#14b8a6', 0),
  ('bouncing-backing-vocals', 'bouncing-on-a-blessing', 'Backing Vocals', 'harmony', '/audio/bouncing-on-a-blessing/backing-vocals.mp3', '#a855f7', 1),
  ('bouncing-drums', 'bouncing-on-a-blessing', 'Drums', 'drums', '/audio/bouncing-on-a-blessing/drums.mp3', '#ef4444', 2),
  ('bouncing-bass', 'bouncing-on-a-blessing', 'Bass', 'bass', '/audio/bouncing-on-a-blessing/bass.mp3', '#f59e0b', 3),
  ('bouncing-guitar', 'bouncing-on-a-blessing', 'Guitar', 'instrumental', '/audio/bouncing-on-a-blessing/guitar.mp3', '#f97316', 4),
  ('bouncing-keyboard', 'bouncing-on-a-blessing', 'Keyboard', 'keys', '/audio/bouncing-on-a-blessing/keyboard.mp3', '#10b981', 5),
  ('bouncing-synth', 'bouncing-on-a-blessing', 'Synth', 'other', '/audio/bouncing-on-a-blessing/synth.mp3', '#22d3ee', 6),
  ('bouncing-other', 'bouncing-on-a-blessing', 'Other', 'other', '/audio/bouncing-on-a-blessing/other.mp3', '#6366f1', 7);
```

---

## Phase 2: Test Free User Access (Should Be Blocked)

After adding the premium song, verify:

1. **Library Page Test**
   - Navigate to `/library`
   - Verify only 2 songs are shown (the free songs)
   - Premium song "3. BOUNCING ON A BLESSING" should NOT appear

2. **Direct URL Access Test**
   - Navigate directly to `/training/bouncing-on-a-blessing`
   - Page should show "Song not found" or redirect
   - Premium song data should NOT be returned by the database

3. **API Response Test**
   - Check network requests to verify the Supabase query only returns 2 songs (not 3)

---

## Phase 3: Verify Premium User Access (Optional Future Test)

To fully verify the security works both ways, you could:

1. Update the test user's subscription to 'pro':
   ```sql
   UPDATE public.profiles 
   SET subscription_tier = 'pro' 
   WHERE id = '209a5430-47f4-40af-905f-4de0336a6a62';
   ```

2. Refresh the library page and verify all 3 songs now appear

3. Revert back to 'free' tier to confirm access is revoked

---

## Expected Results

| Test | Free User | Pro User |
|------|-----------|----------|
| Library shows song count | 2 songs | 3 songs |
| Premium song visible | NO | YES |
| Direct URL access | Blocked | Allowed |
| Stems accessible | NO | YES |

---

## Technical Details

The security is enforced by these RLS policies:

**Songs Table:**
- `Anyone can view free songs`: Returns songs where `is_premium = false`
- `Premium subscribers can view premium songs`: Returns songs where `is_premium = true` AND user has valid subscription in profiles table

**Stems Table:**
- `Users can view stems for free songs`: Returns stems for songs where `is_premium = false`
- `Premium users can view stems for premium songs`: Returns stems for songs where `is_premium = true` AND user has valid subscription

---

## Files Modified

No code changes required - this is purely a data insertion test using the existing security infrastructure.

