import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, Target, DollarSign, Activity, Zap } from "lucide-react";
import Link from "next/link";
import { PnlChart } from "@/components/dashboard/pnl-chart";

// Mock data reflecting new logic
const ACTION_REQUIRED_TRADES = [
  { id: "trd_open_1", symbol: "BTC-USDT-SWAP", direction: "LONG", pnl: 450.50, date: "Active Now", type: "OPEN", reason: "Needs Entry Journal" },
  { id: "trd_closed_1", symbol: "ETH-USDT-SWAP", direction: "SHORT", pnl: -120.00, date: "Closed 2h ago", type: "CLOSED", reason: "Needs Conclusion" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      {/* Hero Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-purple-500/20 to-blue-500/20 blur-2xl opacity-50"></div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" />
            Command Center
          </h2>
          <p className="text-zinc-400 mt-2 text-lg">Your high-performance trading telemetry.</p>
        </div>
      </div>

      {/* Premium Stats Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Net Profit Card */}
        <Card className="relative overflow-hidden bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] group transition-all duration-500 hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)] hover:border-emerald-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-emerald-500/20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Net Profit</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">+$8,940.00</div>
            <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <TrendingUpIcon className="w-4 h-4" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        {/* Win Rate Card */}
        <Card className="relative overflow-hidden bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] group transition-all duration-500 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] hover:border-purple-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-purple-500/20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Win Rate</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Target className="h-5 w-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-white">68.5%</div>
            <p className="text-sm text-zinc-400 mt-2 font-medium">Based on 45 closed trades</p>
          </CardContent>
        </Card>

        {/* Action Required Card */}
        <Card className="relative overflow-hidden bg-amber-500/5 backdrop-blur-2xl border-amber-500/20 shadow-[0_8px_30px_rgba(245,158,11,0.1)] group transition-all duration-500 hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] hover:border-amber-500/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-amber-500/20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold tracking-wider text-amber-500 uppercase">Action Required</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Zap className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">{ACTION_REQUIRED_TRADES.length}</div>
            <p className="text-sm text-amber-500/80 mt-2 font-medium">Trades pending journal review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-3">
        {/* Chart Section */}
        <Card className="md:col-span-4 lg:col-span-2 relative overflow-hidden bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-xl font-bold text-white tracking-wide">Cumulative Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <PnlChart />
          </CardContent>
        </Card>

        {/* Action Required List */}
        <Card className="md:col-span-3 lg:col-span-1 relative overflow-hidden bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 overflow-auto">
            <div className="space-y-4">
              {ACTION_REQUIRED_TRADES.map((trade) => (
                <div key={trade.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20">
                  <div className="absolute left-0 top-0 w-1 h-full bg-amber-500 opacity-70"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100">{trade.symbol}</span>
                        <Badge variant="outline" className={`uppercase text-[10px] font-bold ${trade.direction === "LONG" ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" : "text-rose-400 border-rose-400/30 bg-rose-400/10"}`}>
                          {trade.direction}
                        </Badge>
                      </div>
                      <div className="text-xs text-amber-400/90 mt-1 font-medium">{trade.reason}</div>
                      <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{trade.type} • {trade.date}</div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`font-black tracking-tight ${trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"} drop-shadow-sm`}>
                        {trade.pnl >= 0 ? "+" : ""}{trade.pnl}
                      </span>
                      <Button size="sm" asChild className="h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all group-hover:scale-105">
                        <Link href={`/trades/${trade.id}`}>
                          Execute <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
