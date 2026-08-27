import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch closed trades with their journals
  const { data: trades } = await supabase
    .from("trades")
    .select(`
      id,
      pnl,
      status,
      journal_entries (
        method,
        emotion
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "CLOSED");

  const closedTrades = trades || [];

  const emotionMap: Record<string, { trades: number, wins: number, pnl: number }> = {};
  const methodMap: Record<string, { trades: number, wins: number, pnl: number }> = {};

  closedTrades.forEach(trade => {
    const pnl = Number(trade.pnl) || 0;
    const isWin = pnl > 0;
    const journal: any = Array.isArray(trade.journal_entries) ? trade.journal_entries[0] : trade.journal_entries;
    
    if (journal) {
      const emotion = journal.emotion || "Uncategorized";
      const method = journal.method || "Uncategorized";

      if (!emotionMap[emotion]) emotionMap[emotion] = { trades: 0, wins: 0, pnl: 0 };
      emotionMap[emotion].trades += 1;
      if (isWin) emotionMap[emotion].wins += 1;
      emotionMap[emotion].pnl += pnl;

      if (!methodMap[method]) methodMap[method] = { trades: 0, wins: 0, pnl: 0 };
      methodMap[method].trades += 1;
      if (isWin) methodMap[method].wins += 1;
      methodMap[method].pnl += pnl;
    }
  });

  const emotionStats = Object.entries(emotionMap).map(([emotion, stats]) => ({
    emotion,
    trades: stats.trades,
    winRate: `${((stats.wins / stats.trades) * 100).toFixed(0)}%`,
    pnl: parseFloat(stats.pnl.toFixed(2))
  })).sort((a, b) => b.trades - a.trades);

  const methodStats = Object.entries(methodMap).map(([method, stats]) => ({
    method,
    trades: stats.trades,
    winRate: `${((stats.wins / stats.trades) * 100).toFixed(0)}%`,
    pnl: parseFloat(stats.pnl.toFixed(2))
  })).sort((a, b) => b.trades - a.trades);

  return (
    <div className="p-margin w-full max-w-container-max mx-auto flex-1 h-full pb-8">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-brand-white">Analytics</h2>
        <p className="font-body-md text-brand-silver mt-1">Deep dive into your trading psychology and edge.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-bento-gap">
        
        {/* Performance by Emotion */}
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
          <div className="inline-block border-b border-white/5 pb-1 mb-6 self-start">
            <h3 className="text-gray-500 text-xs uppercase tracking-widest">Performance by Emotion</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-white/5">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-gray-500 text-xs uppercase tracking-widest">Emotion</TableHead>
                  <TableHead className="text-gray-500 text-xs uppercase tracking-widest">Trades</TableHead>
                  <TableHead className="text-gray-500 text-xs uppercase tracking-widest">Win Rate</TableHead>
                  <TableHead className="text-gray-500 text-xs uppercase tracking-widest text-right">Net PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emotionStats.length === 0 && (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500 italic">
                      No journal data available yet.
                    </TableCell>
                  </TableRow>
                )}
                {emotionStats.map((stat) => (
                  <TableRow key={stat.emotion} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors border-none">
                    <TableCell className="py-4">
                      <div className="font-body-md font-medium text-brand-white">{stat.emotion}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-data-mono text-brand-white">{stat.trades}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-data-mono text-brand-white">{stat.winRate}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span className={`font-body-md font-bold ${stat.pnl >= 0 ? "text-success-emerald" : "text-danger-rose"}`}>
                        {stat.pnl >= 0 ? "+" : ""}${stat.pnl}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Performance by Method */}
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
          <div className="inline-block border-b border-white/5 pb-1 mb-6 self-start">
            <h3 className="text-gray-500 text-xs uppercase tracking-widest">Performance by Method</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-white/5">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-gray-500 text-xs uppercase tracking-widest">Setup / Method</TableHead>
                  <TableHead className="text-gray-500 text-xs uppercase tracking-widest">Trades</TableHead>
                  <TableHead className="text-gray-500 text-xs uppercase tracking-widest">Win Rate</TableHead>
                  <TableHead className="text-gray-500 text-xs uppercase tracking-widest text-right">Net PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methodStats.length === 0 && (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500 italic">
                      No journal data available yet.
                    </TableCell>
                  </TableRow>
                )}
                {methodStats.map((stat) => (
                  <TableRow key={stat.method} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors border-none">
                    <TableCell className="py-4">
                      <div className="font-body-md font-medium text-brand-white">{stat.method}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-data-mono text-brand-white">{stat.trades}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-data-mono text-brand-white">{stat.winRate}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span className={`font-body-md font-bold ${stat.pnl >= 0 ? "text-success-emerald" : "text-danger-rose"}`}>
                        {stat.pnl >= 0 ? "+" : ""}${stat.pnl}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}
