import { CompletedTradesTable } from "@/components/dashboard/completed-trades-table";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { SyncButton } from "@/components/dashboard/sync-button";

export default async function TradesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all trades for user
  const { data: trades, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const allTrades = trades || [];
  
  const completedPositions = allTrades
    .filter(t => t.status === "CLOSED")
    .sort((a, b) => new Date(b.closed_at || b.updated_at).getTime() - new Date(a.closed_at || a.updated_at).getTime());

  const openPositions = allTrades
    .filter(t => t.status === "OPEN")
    .filter(openTrade => {
      const hasBeenClosed = completedPositions.some(closedTrade => 
        closedTrade.okx_trade_id && 
        openTrade.okx_trade_id && 
        closedTrade.okx_trade_id.startsWith(`${openTrade.okx_trade_id}_`)
      );
      return !hasBeenClosed;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
      {/* Header */}
      <header className="h-20 flex-shrink-0 flex items-center justify-between px-lg pt-lg mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-white">Trades</h2>
          <p className="font-body-md text-gray-400 mt-1">Manage your open positions and review completed trades.</p>
        </div>
        <SyncButton />
      </header>

      {/* Two Column Layout */}
      <div className="flex-1 px-md pb-md grid grid-cols-12 gap-6 overflow-y-auto w-full max-w-[1600px] mx-auto">
        
        {/* Left Column: Open Positions */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-sm border-b border-white/5">
            <h3 className="font-label-caps text-[10px] text-gray-400 tracking-widest">OPEN POSITIONS</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {openPositions.map(pos => {
              const pnl = Number(pos.pnl) || 0;
              const isProfit = pnl >= 0;
              const isLong = pos.direction === "LONG";
              const openDate = new Date(pos.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={pos.id} className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-xl p-4 hover:border-white/20 transition-colors relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity ${isProfit ? "from-success-emerald/5" : "from-danger-rose/5"} to-transparent`}></div>
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-headline-md text-base text-white">{pos.symbol}</h4>
                        <span className={`font-label-caps text-[9px] px-2 py-0.5 rounded-full border ${isLong ? "bg-success-emerald/15 border-success-emerald/30 text-success-emerald" : "bg-danger-rose/15 border-danger-rose/30 text-danger-rose"}`}>
                          {pos.direction}
                        </span>
                      </div>
                      <span className="font-data-mono text-xs text-gray-400">Opened: {openDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                    <div>
                      <span className="font-label-caps text-[9px] text-gray-400 block mb-1">Entry</span>
                      <span className="font-data-mono text-sm text-white">${Number(pos.entry_price).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-label-caps text-[9px] text-gray-400 block mb-1">Unrealized PnL</span>
                      <span className={`font-data-mono text-sm ${isProfit ? "text-success-emerald" : "text-danger-rose"}`}>
                        {isProfit ? "+" : "-"}${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center relative z-10 border-t border-white/5 pt-sm">
                    {pos.journal_status === "INCOMPLETE" ? (
                      <span className="border border-outline-variant text-gray-400 font-label-caps text-[10px] px-xs py-1 rounded uppercase">Review Needed</span>
                    ) : (
                      <span className="border border-success-emerald/30 text-success-emerald font-label-caps text-[10px] px-xs py-1 rounded uppercase">Completed</span>
                    )}
                    
                    {pos.journal_status === "INCOMPLETE" ? (
                      <Link href={`/trades/${pos.id}`} className="bg-gradient-to-r from-primary-container to-secondary-container text-surface-obsidian font-label-caps text-label-caps px-sm py-2 rounded-md hover:shadow-[0_0_15px_rgba(252,163,17,0.4)] transition-all flex items-center gap-1 uppercase">
                        REVIEW <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    ) : (
                      <Link href={`/trades/${pos.id}`} className="border border-primary/50 text-primary hover:bg-primary-container hover:text-surface-obsidian font-label-caps text-label-caps px-sm py-2 rounded-md transition-all flex items-center gap-1 uppercase">
                        VIEW <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
            
            {openPositions.length === 0 && (
              <div className="text-center p-8 font-body-sm text-gray-400 border border-dashed border-white/10 rounded-lg">
                No open positions found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Completed Positions */}
        <CompletedTradesTable trades={completedPositions} />

      </div>
    </div>
  );
}
