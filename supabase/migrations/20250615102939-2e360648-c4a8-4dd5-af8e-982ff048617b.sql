
-- 1. Ensure the 'profile-pictures' bucket is public (if not already)
UPDATE storage.buckets SET public = TRUE WHERE id = 'profile-pictures';

-- 2. Policy: Allow anyone to read (SELECT) from the profiles table (for avatar display, etc)
-- Safe, as profile data shown is public info (avatar_url, name, etc)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
    ON public.profiles
    FOR SELECT
    USING (true);

-- 3. (Optional: If you have an 'avatars' bucket, make public too)
UPDATE storage.buckets SET public = TRUE WHERE id = 'avatars';
