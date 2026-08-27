-- Add conclusion column to journal_entries for post-trade review
ALTER TABLE public.journal_entries 
ADD COLUMN conclusion TEXT;

-- Safely add okx_trade_id column to trades table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='trades' AND column_name='okx_trade_id') THEN
        ALTER TABLE public.trades ADD COLUMN okx_trade_id TEXT UNIQUE;
    END IF;
END
$$;
