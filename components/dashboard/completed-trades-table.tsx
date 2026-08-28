"use client";

import { useState } from "react";
import Link from "next/link";

export function CompletedTradesTable({ trades }: { trades: any[] }) {
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredTrades = trades.filter(pos => {
    // Status Filter
    if (statusFilter !== "ALL") {
      const isComplete = pos.journal_status === "COMPLETE";
      if (statusFilter === "INCOMPLETE" && isComplete) return false;
      if (statusFilter === "COMPLETE" && !isComplete) return false;
    }

    // Time Filter
    if (timeFilter !== "ALL") {
      const tradeDate = new Date(pos.created_at);
      const now = new Date();
      if (timeFilter === "TODAY") {
        if (tradeDate.toDateString() !== now.toDateString()) return false;
      } else if (timeFilter === "WEEK") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        if (tradeDate < oneWeekAgo) return false;
      } else if (timeFilter === "MONTH") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        if (tradeDate < oneMonthAgo) return false;
      }
    }
    return true;
  });

  return (
    <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-sm border-b border-white/5">
        <h3 className="font-label-caps text-[10px] text-gray-400 tracking-widest">COMPLETED POSITIONS</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors relative group">
            <span className="material-symbols-outlined text-[14px]">filter_list</span>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent text-current font-label-caps text-[10px] uppercase tracking-widest focus:outline-none cursor-pointer appearance-none"
            >
              <option className="bg-surface-obsidian text-white" value="ALL">ALL TIME</option>
              <option className="bg-surface-obsidian text-white" value="TODAY">TODAY</option>
              <option className="bg-surface-obsidian text-white" value="WEEK">LAST 7 DAYS</option>
              <option className="bg-surface-obsidian text-white" value="MONTH">LAST 30 DAYS</option>
            </select>
          </div>
          <div className="flex items-center text-gray-400 hover:text-white transition-colors relative group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-current font-label-caps text-[10px] uppercase tracking-widest focus:outline-none cursor-pointer appearance-none"
            >
              <option className="bg-surface-obsidian text-white" value="ALL">ALL STATUS</option>
              <option className="bg-surface-obsidian text-white" value="INCOMPLETE">CONCLUSION NEEDED</option>
              <option className="bg-surface-obsidian text-white" value="COMPLETE">COMPLETED</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-xl overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-white/5 text-gray-400 bg-black/20">
              <th className="font-label-caps text-[10px] py-2 px-4 font-normal whitespace-nowrap">Symbol</th>
              <th className="font-label-caps text-[10px] py-2 px-4 font-normal text-right whitespace-nowrap">PnL</th>
              <th className="font-label-caps text-[10px] py-2 px-4 font-normal whitespace-nowrap">Date Closed</th>
              <th className="font-label-caps text-[10px] py-2 px-4 font-normal whitespace-nowrap">Status</th>
              <th className="font-label-caps text-[10px] py-2 px-4 font-normal text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono">
            {filteredTrades.map((pos) => {
              const pnl = Number(pos.pnl) || 0;
              const isProfit = pnl >= 0;
              const isLong = pos.direction === "LONG";
              const dateClosed = new Date(pos.closed_at || pos.updated_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
              
              return (
                <tr key={pos.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3 px-4">
                    <div className="text-white whitespace-nowrap">{pos.symbol}</div>
                    <div className={`text-[10px] mt-1 ${isLong ? "text-success-emerald" : "text-danger-rose"}`}>{pos.direction}</div>
                  </td>
                  <td className={`py-3 px-4 text-right ${isProfit ? "text-success-emerald" : "text-danger-rose"}`}>
                    {isProfit ? "+" : "-"}${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                    {dateClosed}
                  </td>
                  <td className="py-3 px-4">
                    {pos.journal_status !== "COMPLETE" ? (
                      <span className="bg-primary-container/10 text-primary-container font-label-caps text-[10px] px-2 py-1 rounded whitespace-nowrap">CONCLUSION NEEDED</span>
                    ) : (
                      <span className="bg-success-emerald/10 text-success-emerald font-label-caps text-[10px] px-2 py-1 rounded whitespace-nowrap">COMPLETED</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {pos.journal_status !== "COMPLETE" ? (
                      <Link href={`/trades/${pos.id}`} className="border border-primary/50 text-primary hover:bg-primary-container hover:text-surface-obsidian font-label-caps text-[10px] px-3 py-1.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap">
                        CONCLUSION <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </Link>
                    ) : (
                      <Link href={`/trades/${pos.id}`} className="border border-success-emerald/50 text-success-emerald hover:bg-success-emerald hover:text-surface-obsidian font-label-caps text-[10px] px-3 py-1.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap">
                        VIEW <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
            
            {filteredTrades.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 border-dashed border-white/10">
                  No completed trades match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
