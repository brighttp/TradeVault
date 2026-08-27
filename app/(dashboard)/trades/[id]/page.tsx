import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Activity, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalForm } from "@/components/dashboard/journal-form";
import { TradeImageUploader } from "@/components/dashboard/trade-image-uploader";

export default async function TradeDetailPage({ params }: { params: { id: string } }) {
  // Await params safely for Next.js 15+ App Router
  const resolvedParams = await params;
  const tradeId = resolvedParams.id;
  
  const supabase = await createClient();

  // Fetch Trade
  const { data: trade, error: tradeError } = await supabase
    .from("trades")
    .select("*")
    .eq("id", tradeId)
    .single();

  if (tradeError || !trade) {
    notFound();
  }

  // Fetch existing journal if any
  const { data: journal } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("trade_id", tradeId)
    .single();

  const isOpen = trade.status === "OPEN";
  const pnl = Number(trade.pnl) || 0;
  const isProfit = pnl >= 0;

  return (
    <div className="flex-1 flex flex-col h-full w-full relative">
      
      {/* Header */}
      <header className="px-4 md:px-8 py-6 sticky top-0 bg-black/80 backdrop-blur-md z-30 border-b border-white/5">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/trades" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-white">{trade.symbol}</h2>
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded border ${trade.direction === "LONG" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-rose-500/15 text-rose-400 border-rose-500/30"}`}>
              {trade.direction}
            </span>
            {isOpen ? (
              <span className="px-3 py-1 text-xs font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
                ACTIVE
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-bold rounded bg-white/10 text-white/70 border border-white/20">
                CLOSED
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 ml-12">
          Recorded: {new Date(trade.created_at).toLocaleString()}
        </p>
      </header>

      <div className="p-4 md:p-8 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Execution Data */}
        <section className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-8 h-fit">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Activity className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Execution Telemetry</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Entry Price</p>
              <p className="text-3xl font-bold tracking-tight text-white">${Number(trade.entry_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Exit Price</p>
              <p className="text-3xl font-bold tracking-tight text-white">{trade.exit_price ? `$${Number(trade.exit_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` : "—"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Net PnL</p>
            <p className={`text-3xl font-bold tracking-tight ${isProfit ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" : "text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]"}`}>
              {isProfit ? "+" : ""}${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <TradeImageUploader 
            tradeId={trade.id} 
            imageBeforeUrl={trade.image_before_url} 
            imageAfterUrl={trade.image_after_url} 
          />
        </section>

        {/* Right Column: Journaling */}
        <section className={`bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6 h-fit ${trade.journal_status === "COMPLETE" ? "border-emerald-500/30" : "border-amber-500/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]"}`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className={`w-5 h-5 ${trade.journal_status === "COMPLETE" ? "text-emerald-400" : "text-amber-500"}`} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Psychology & Review</h3>
            </div>
            {trade.journal_status === "COMPLETE" && (
              <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/15 px-2 py-1 rounded border border-emerald-500/30">Completed</span>
            )}
          </div>

          <JournalForm 
            tradeId={trade.id} 
            initialData={journal} 
            tradeSymbol={trade.symbol}
            tradePnl={pnl}
          />
        </section>

      </div>
    </div>
  );
}
