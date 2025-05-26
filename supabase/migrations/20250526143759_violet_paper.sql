/*
  # Storage policies for avatars and item images

  1. Storage Buckets
    - Create 'avatars' bucket for profile pictures
    - Create 'items' bucket for item images
  
  2. Security
    - Enable public access for both buckets
    - Set up RLS policies for uploads and deletes
*/

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create items bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('items', 'items', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for avatar uploads
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for avatar updates
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for avatar deletions
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for item image uploads
CREATE POLICY "Users can upload item images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'items' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for item image updates
CREATE POLICY "Users can update their item images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'items' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for item image deletions
CREATE POLICY "Users can delete their item images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'items' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;