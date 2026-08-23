"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, Lock, Activity, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock Data reflecting Open and Closed logic
const TRADE = {
  id: "trd_closed_1", // switch this to trd_open_1 to test open logic
  symbol: "ETH-USDT-SWAP",
  direction: "SHORT",
  entry: 3500.5,
  exit: 3450.0,
  pnl: 500.50,
  fee: 15.5,
  openTime: "2023-10-27 14:30:00",
  closeTime: "2023-10-27 16:45:00",
  type: "CLOSED", // "OPEN" or "CLOSED"
  status: "INCOMPLETE", 
  // Initial journal details
  method: "reversion",
  emotion: "calm",
  confidence: "8",
  reason: "Overextended on the 4H chart, bearish divergence on RSI.",
  conclusion: ""
};

export default function TradeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 800);
  };

  const isOpen = TRADE.type === "OPEN";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white backdrop-blur-md">
            <Link href="/trades"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              {TRADE.symbol} 
              <Badge variant="outline" className={`uppercase tracking-widest text-[11px] px-3 py-1 ${TRADE.direction === "LONG" ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]" : "text-rose-400 border-rose-400/40 bg-rose-400/10 shadow-[0_0_10px_rgba(251,113,133,0.2)]"}`}>
                {TRADE.direction}
              </Badge>
              {isOpen ? (
                <Badge variant="outline" className="uppercase tracking-widest text-[11px] px-3 py-1 text-blue-400 border-blue-400/40 bg-blue-400/10 animate-pulse">
                  ACTIVE
                </Badge>
              ) : (
                <Badge variant="outline" className="uppercase tracking-widest text-[11px] px-3 py-1 text-zinc-400 border-zinc-400/40 bg-zinc-400/10">
                  CLOSED
                </Badge>
              )}
            </h2>
            <p className="text-sm text-zinc-400 mt-1 font-medium">{TRADE.openTime} {TRADE.closeTime ? `— ${TRADE.closeTime}` : ""}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Execution Data */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="relative overflow-hidden bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Execution Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Entry Price</span>
                  <div className="text-xl font-black text-white">${TRADE.entry.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Exit Price</span>
                  <div className="text-xl font-black text-white">{TRADE.exit ? `$${TRADE.exit.toLocaleString()}` : "—"}</div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Net PnL</span>
                  <div className={`text-2xl font-black drop-shadow-md ${TRADE.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {TRADE.pnl >= 0 ? "+" : ""}${TRADE.pnl.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Fees Paid</span>
                  <div className="text-xl font-black text-zinc-400">${TRADE.fee.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Premium Journal Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className={`relative overflow-hidden bg-black/40 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border ${TRADE.status === "INCOMPLETE" ? "border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)]" : "border-white/10"}`}>
            {TRADE.status === "INCOMPLETE" && (
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            )}
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    {isOpen ? "Initial Trade Logic" : "Post-Trade Review"}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 mt-1">
                    {isOpen ? "Log your rationale while the trade is active." : "The trade is closed. Document your conclusion and lessons learned."}
                  </CardDescription>
                </div>
                {TRADE.status === "INCOMPLETE" && (
                  <Badge variant="outline" className="uppercase tracking-widest text-[10px] px-3 py-1 text-amber-400 border-amber-400/40 bg-amber-400/10 animate-pulse">
                    Action Required
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Initial Entry Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-wider text-zinc-400 font-bold flex items-center justify-between">
                      Trading Setup
                      {!isOpen && <Lock className="w-3 h-3 text-zinc-600" />}
                    </Label>
                    <Select required defaultValue={!isOpen ? TRADE.method : undefined} disabled={!isOpen}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-amber-500/50 rounded-xl h-12">
                        <SelectValue placeholder="Select method used..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-white/10 text-white">
                        <SelectItem value="breakout">Support/Resistance Breakout</SelectItem>
                        <SelectItem value="reversion">Mean Reversion</SelectItem>
                        <SelectItem value="trend">Trend Following</SelectItem>
                        <SelectItem value="scalp">Orderflow Scalp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-wider text-zinc-400 font-bold flex items-center justify-between">
                      Emotion
                      {!isOpen && <Lock className="w-3 h-3 text-zinc-600" />}
                    </Label>
                    <Select required defaultValue={!isOpen ? TRADE.emotion : undefined} disabled={!isOpen}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-amber-500/50 rounded-xl h-12">
                        <SelectValue placeholder="How did you feel?" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-white/10 text-white">
                        <SelectItem value="calm">Calm & Collected</SelectItem>
                        <SelectItem value="anxious">Anxious / FOMO</SelectItem>
                        <SelectItem value="greedy">Greedy</SelectItem>
                        <SelectItem value="frustrated">Frustrated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-wider text-zinc-400 font-bold flex items-center justify-between">
                      Confidence (1-10)
                      {!isOpen && <Lock className="w-3 h-3 text-zinc-600" />}
                    </Label>
                    <Input 
                      type="number" 
                      min="1" max="10" 
                      placeholder="e.g. 8" 
                      required 
                      defaultValue={!isOpen ? TRADE.confidence : undefined}
                      disabled={!isOpen}
                      className="bg-white/5 border-white/10 text-white focus:ring-amber-500/50 rounded-xl h-12 font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider text-zinc-400 font-bold flex items-center justify-between">
                    Entry Rationale
                    {!isOpen && <Lock className="w-3 h-3 text-zinc-600" />}
                  </Label>
                  <textarea 
                    placeholder="Why did you enter this trade?" 
                    required 
                    defaultValue={!isOpen ? TRADE.reason : undefined}
                    disabled={!isOpen}
                    className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm shadow-sm placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-white resize-none transition-colors"
                  />
                </div>

                {/* Conclusion Field (Only for CLOSED trades) */}
                {!isOpen && (
                  <div className="space-y-3 pt-4 border-t border-white/10 mt-6 relative">
                    <div className="absolute -left-6 top-10 w-1 h-12 bg-amber-500 rounded-r-md"></div>
                    <Label className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Conclusion & Lesson
                    </Label>
                    <textarea 
                      placeholder="How did the trade play out? What did you learn?" 
                      required 
                      defaultValue={TRADE.conclusion}
                      className="flex min-h-[120px] w-full rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm shadow-sm placeholder:text-amber-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 text-white resize-none transition-colors"
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  className={`w-full h-12 text-base font-bold rounded-xl transition-all duration-300 ${isOpen ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)]"}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Encrypting & Saving..." : (
                    <>
                      {isOpen ? "Lock In Entry Journal" : "Finalize Post-Trade Review"}
                    </>
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
