-- Add conclusion column to journal_entries for post-trade review
ALTER TABLE public.journal_entries 
ADD COLUMN conclusion TEXT;
