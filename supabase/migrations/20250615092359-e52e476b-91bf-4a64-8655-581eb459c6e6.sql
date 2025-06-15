
-- Allow everyone to SELECT from categories for site-wide browsing
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Create the 'profile-pictures' bucket if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to 'profile-pictures'
CREATE POLICY "Authenticated can upload profile images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-pictures');

-- Allow any user to select (view) profile-pictures
CREATE POLICY "Anyone can view profile images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-pictures');
