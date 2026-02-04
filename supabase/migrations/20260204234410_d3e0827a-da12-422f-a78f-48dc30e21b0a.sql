-- Add explicit deny-all policies for unauthenticated users on profiles table
-- This provides defense in depth against RLS bypass

CREATE POLICY "Deny all access for unauthenticated users on profiles"
ON public.profiles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Add explicit deny-all policies for unauthenticated users on practice_sessions table
CREATE POLICY "Deny all access for unauthenticated users on practice_sessions"
ON public.practice_sessions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);