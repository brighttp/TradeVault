-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgsodium"; -- Required for Supabase Vault

-- 1. Create user_settings table
CREATE TABLE public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    okx_api_key_id UUID,        -- Reference to vault.secrets
    okx_secret_key_id UUID,     -- Reference to vault.secrets
    okx_passphrase_id UUID,     -- Reference to vault.secrets
    custom_methods TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create trades table
CREATE TABLE public.trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    okx_trade_id TEXT UNIQUE, -- Optional: to prevent duplicates when syncing
    symbol TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
    entry_price NUMERIC NOT NULL,
    exit_price NUMERIC,
    pnl NUMERIC,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED')),
    journal_status TEXT NOT NULL DEFAULT 'INCOMPLETE' CHECK (journal_status IN ('INCOMPLETE', 'COMPLETE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create journal_entries table
CREATE TABLE public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id UUID NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE UNIQUE,
    method TEXT NOT NULL,
    reason TEXT NOT NULL,
    confidence INTEGER NOT NULL CHECK (confidence BETWEEN 1 AND 10),
    emotion TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Configuration

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Policies for user_settings
CREATE POLICY "Users can view own settings" 
ON public.user_settings FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
ON public.user_settings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
ON public.user_settings FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Policies for trades
CREATE POLICY "Users can view own trades" 
ON public.trades FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" 
ON public.trades FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" 
ON public.trades FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades" 
ON public.trades FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Policies for journal_entries
-- Since journal_entries is tied to trades, we need to check trade ownership
CREATE POLICY "Users can view own journal entries" 
ON public.journal_entries FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.trades 
  WHERE trades.id = journal_entries.trade_id 
  AND trades.user_id = auth.uid()
));

CREATE POLICY "Users can insert own journal entries" 
ON public.journal_entries FOR INSERT 
TO authenticated 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.trades 
  WHERE trades.id = journal_entries.trade_id 
  AND trades.user_id = auth.uid()
));

CREATE POLICY "Users can update own journal entries" 
ON public.journal_entries FOR UPDATE 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.trades 
  WHERE trades.id = journal_entries.trade_id 
  AND trades.user_id = auth.uid()
));

-- Function to handle timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_modtime BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trades_modtime BEFORE UPDATE ON public.trades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_modtime BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
