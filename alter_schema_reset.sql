ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS last_reset_at TIMESTAMPTZ;
