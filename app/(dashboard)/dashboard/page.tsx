import { createClient } from "@/lib/supabase/server";
import { PnLCalendar } from "@/components/dashboard/pnl-calendar";
import Link from "next/link";
import { SyncButton } from "@/components/dashboard/sync-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: trades } = await supabase.from("trades").select("*");
  const allTrades = trades || [];

  const allClosedTrades = allTrades.filter(t => t.status === "CLOSED");
  const openTrades = allTrades.filter(t => t.status === "OPEN");
  const openActionRequired = allTrades.filter(t => t.journal_status === "INCOMPLETE" && t.status === "OPEN");
  const closedActionRequired = allTrades.filter(t => t.journal_status === "INCOMPLETE" && t.status === "CLOSED");
  const totalActionRequired = openActionRequired.length + closedActionRequired.length;

  return (
    <div className="p-4 md:p-6 xl:p-8 max-w-[1600px] mx-auto space-y-4 w-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-white mb-1">Vault Overview</h2>
          <p className="font-label-caps text-label-caps text-on-surface-variant">TRADING DASHBOARD</p>
        </div>
        <SyncButton />
      </header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* PNL Calendar & Summary Container */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <PnLCalendar trades={allClosedTrades} executions={null} />
        </div>

        {/* Right Column: Active Ops & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Action Center Card */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-2 text-primary mb-4">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant">ACTION CENTER</span>
            </div>
            <div className="mb-4">
              <div className="font-headline-lg text-4xl text-primary mb-1">{openActionRequired.length}</div>
              <h3 className="font-headline-md text-xs text-primary mb-1">Trades Pending Review</h3>
              <p className="font-body-md text-[10px] text-on-surface-variant">
                Incomplete journals require your attention.
              </p>
            </div>
            <Link href="/trades" className="w-full btn-primary text-background font-headline-md text-sm py-3 rounded-lg hover:scale-95 active:opacity-80 transition-all flex items-center justify-center gap-2 shadow-lg">
              <span className="material-symbols-outlined text-sm">arrow_forward</span> REVIEW NOW
            </Link>
          </div>

          {/* Active Operations List */}
          <div className="glass-panel rounded-2xl p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">show_chart</span>
                <span className="font-label-caps text-[10px] tracking-widest text-white">ACTIVE OPERATIONS</span>
              </div>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-on-surface-variant font-data-mono">{openTrades.length} open</span>
            </div>
            
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[300px]">
              {openTrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-white/20 py-8">
                  <span className="material-symbols-outlined text-3xl">inbox</span>
                  <span className="text-xs">No active positions</span>
                </div>
              ) : (
                openTrades.map((trade) => {
                  const isLong = trade.direction === "LONG";
                  const pnl = Number(trade.pnl) || 0;
                  const isProfit = pnl >= 0;
                  
                  return (
                    <div key={trade.id} className="bg-surface-container-low/50 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div>
                        <h4 className="font-headline-md text-sm text-white mb-1">{trade.symbol}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 border rounded text-[10px] font-bold tracking-wider ${isLong ? "bg-success-emerald/20 text-success-emerald border-success-emerald/50" : "bg-danger-rose/20 text-danger-rose border-danger-rose/50"}`}>
                            {trade.direction}
                          </span>
                          {trade.journal_status === "INCOMPLETE" && (
                            <div className="flex items-center gap-1 text-primary text-[10px]">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Review Needed
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-[10px] text-on-surface-variant tracking-widest uppercase mb-0.5">UNREALIZED PNL</p>
                          <p className={`font-data-mono text-sm font-semibold ${isProfit ? "text-success-emerald" : "text-danger-rose"}`}>
                            {isProfit ? "+" : "-"}${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <Link href={`/trades/${trade.id}`} className="px-3 py-1.5 border border-white/10 rounded-md text-[10px] font-bold text-white hover:bg-white/10 transition-colors">
                          MANAGE
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
