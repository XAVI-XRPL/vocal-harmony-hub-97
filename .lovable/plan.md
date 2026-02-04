

# Add DELETE Policies for User Data Tables

## Overview
Add Row-Level Security DELETE policies to allow users to delete their own practice data. This addresses a data rights gap where users can create and view their data but cannot remove it.

## Security Finding Resolution

### Accepted Risk: Medical Providers Public Access
The `medical_providers` table has been marked as an accepted security risk. This is a public doctor directory feature (similar to Yelp/ZocDoc) where healthcare providers intentionally want their professional contact information publicly accessible.

---

## Database Migration

### Tables Affected
| Table | Current Policies | Missing Policy |
|-------|------------------|----------------|
| `practice_sessions` | SELECT, INSERT, UPDATE | DELETE |
| `user_song_progress` | SELECT, INSERT, UPDATE | DELETE |

### SQL Migration

```sql
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
```

---

## Policy Details

### practice_sessions DELETE Policy
- **Name**: "Users can delete their own practice sessions"
- **Command**: DELETE
- **Role**: authenticated
- **Using Expression**: `auth.uid() = user_id`
- **Purpose**: Allow users to remove individual practice session records

### user_song_progress DELETE Policy
- **Name**: "Users can delete their own song progress"
- **Command**: DELETE
- **Role**: authenticated
- **Using Expression**: `auth.uid() = user_id`
- **Purpose**: Allow users to clear their progress on specific songs

---

## Security Verification

After applying these policies, both tables will have complete CRUD coverage:

| Operation | practice_sessions | user_song_progress |
|-----------|-------------------|-------------------|
| SELECT | `auth.uid() = user_id` | `auth.uid() = user_id` |
| INSERT | `auth.uid() = user_id` | `auth.uid() = user_id` |
| UPDATE | `auth.uid() = user_id` | `auth.uid() = user_id` |
| DELETE | `auth.uid() = user_id` | `auth.uid() = user_id` |

All policies consistently use the same security check, ensuring users can only manage their own data.

---

## Technical Notes

- The `TO authenticated` clause ensures only logged-in users can delete records
- The `USING` clause validates ownership before allowing deletion
- No cascading delete concerns as these are leaf tables without dependent data

