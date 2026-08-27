-- 1. Add image columns to trades table
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS image_before_url TEXT,
ADD COLUMN IF NOT EXISTS image_after_url TEXT;

-- 2. Create the storage bucket for trade images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trade_images', 'trade_images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies for the trade_images bucket
-- Allow public viewing of images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'trade_images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'trade_images');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'trade_images');

-- Allow authenticated users to delete their images
CREATE POLICY "Authenticated users can delete images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'trade_images');
