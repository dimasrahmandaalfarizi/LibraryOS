-- LibraryOS Storage Configuration
-- Run this SQL in Supabase SQL Editor AFTER creating the storage bucket

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================

-- First, create the bucket via Supabase Dashboard:
-- 1. Go to Storage in sidebar
-- 2. Click "New bucket"
-- 3. Name: book-files
-- 4. Public: NO (keep it private)
-- 5. Click "Create bucket"

-- Then run this SQL to set up policies:

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Allow authenticated users to view files
CREATE POLICY "Authenticated users can view book files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'book-files');

-- Allow admins to upload files
CREATE POLICY "Admins can upload book files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'book-files' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update files
CREATE POLICY "Admins can update book files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'book-files' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete book files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'book-files' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Success message
SELECT 'Storage policies created successfully!' AS message;
