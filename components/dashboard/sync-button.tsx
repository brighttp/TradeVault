"use client";

import { useState } from "react";
import { syncOkxTrades } from "@/app/actions/sync";

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setResultMessage(null);

    const result = await syncOkxTrades();
    
    if (result.error) {
      setResultMessage(result.error);
      setTimeout(() => setResultMessage(null), 5000);
    } else {
      setResultMessage(`Success! Synced ${result.count} trades.`);
      setTimeout(() => setResultMessage(null), 3000);
    }
    
    setIsSyncing(false);
  };

  return (
    <div className="flex items-center gap-4">
      {resultMessage && (
        <span className={`font-label-caps text-[10px] uppercase tracking-widest ${resultMessage.includes('Success') ? 'text-success-emerald' : 'text-danger-rose'}`}>
          {resultMessage}
        </span>
      )}
      <button 
        onClick={handleSync}
        disabled={isSyncing}
        className="btn-primary text-background font-headline-md text-sm px-6 py-3 rounded-lg hover:scale-95 active:opacity-80 transition-all flex items-center gap-2 self-start md:self-auto disabled:opacity-75 disabled:cursor-wait shadow-lg"
      >
        <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>
          {isSyncing ? 'refresh' : 'sync'}
        </span>
        {isSyncing ? 'SYNCING...' : 'SYNC OKX DATA'}
      </button>
    </div>
  );
}
