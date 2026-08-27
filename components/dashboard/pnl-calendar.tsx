"use client";

import { useMemo, useState } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, subMonths, addMonths } from "date-fns";

interface PnLCalendarProps {
  trades: any[];
  executions?: { closedAt: string; pnl: number }[] | null;
}

export function PnLCalendar({ trades, executions }: PnLCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const pnlByDate = useMemo(() => {
    const map = new Map<string, number>();
    
    if (executions && executions.length > 0) {
      // Use 100% accurate raw execution data from OKX, formatted to the user's LOCAL timezone
      executions.forEach(ex => {
        if (!ex.closedAt) return;
        const dateStr = format(new Date(ex.closedAt), "yyyy-MM-dd");
        map.set(dateStr, (map.get(dateStr) || 0) + ex.pnl);
      });
    } else {
      // Fallback for legacy data or if executions aren't synced yet
      trades.forEach(t => {
        const dateStr = format(new Date(t.closed_at || t.updated_at), "yyyy-MM-dd");
        const pnl = Number(t.pnl) || 0;
        map.set(dateStr, (map.get(dateStr) || 0) + pnl);
      });
    }
    return map;
  }, [trades, executions]);

  const monthlyStats = useMemo(() => {
    let totalTrades = 0, winTrades = 0, lossTrades = 0, totalPnL = 0;
    const currentMonthStr = format(currentDate, "yyyy-MM");
    
    if (executions && executions.length > 0) {
      executions.forEach(ex => {
        if (!ex.closedAt) return;
        const dateStr = format(new Date(ex.closedAt), "yyyy-MM-dd");
        if (dateStr.startsWith(currentMonthStr)) {
          totalTrades++; // Counts individual execution fills (partial closes)
          const pnl = ex.pnl;
          totalPnL += pnl;
          if (pnl > 0) winTrades++;
          else if (pnl < 0) lossTrades++;
        }
      });
    } else {
      trades.forEach(t => {
        const dateStr = format(new Date(t.closed_at || t.updated_at), "yyyy-MM-dd");
        
        if (dateStr.startsWith(currentMonthStr)) {
          totalTrades++;
          const pnl = Number(t.pnl) || 0;
          totalPnL += pnl;
          if (pnl > 0) winTrades++;
          else if (pnl < 0) lossTrades++;
        }
      });
    }
    return { totalTrades, winTrades, lossTrades, totalPnL };
  }, [currentDate, trades, executions]);

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const startDay = getDay(daysInMonth[0]);
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const winRate = monthlyStats.totalTrades > 0
    ? ((monthlyStats.winTrades / monthlyStats.totalTrades) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col h-full gap-3">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          <span className="font-label-caps text-label-caps tracking-widest text-white">PNL CALENDAR</span>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-high rounded-md px-3 py-1.5 border border-white/5">
          <button onClick={prevMonth} className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <span className="font-data-mono text-sm font-semibold tracking-wider">
            {format(currentDate, "MMM yyyy").toUpperCase()}
          </span>
          <button onClick={nextMonth} className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-data-mono text-xs mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-on-surface-variant/50 py-2">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-gutter flex-1 bg-white/5 rounded-lg overflow-hidden border border-white/5">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-surface-dim/80 p-1 min-h-[45px]" />
        ))}
        {daysInMonth.map(day => {
          const dateStr = format(day, "yyyy-MM-dd");
          const pnl = pnlByDate.get(dateStr);
          const isToday = format(new Date(), "yyyy-MM-dd") === dateStr;

          let cellClass = "bg-surface-dim/80 p-1 min-h-[45px] flex flex-col items-center justify-center";
          let numClass = "text-white/40";
          let extraContent = null;

          if (pnl !== undefined) {
            numClass = "text-white font-semibold";
            if (pnl > 0) {
              cellClass = "bg-emerald-500/10 p-1 min-h-[45px] flex flex-col items-center justify-center border-b border-emerald-500/20";
              extraContent = <span className="text-[10px] text-success-emerald">+{pnl.toFixed(1)}</span>;
            } else if (pnl < 0) {
              cellClass = "bg-danger-rose/10 p-1 min-h-[45px] flex flex-col items-center justify-center border-b border-danger-rose/20";
              extraContent = <span className="text-[10px] text-danger-rose">{pnl.toFixed(1)}</span>;
            } else {
              extraContent = <span className="text-[10px] text-white/50">0.0</span>;
            }
          }

          if (isToday) {
            cellClass = "bg-surface-dim/80 p-1 min-h-[45px] flex flex-col items-center justify-center border border-primary shadow-[inset_0_0_15px_rgba(252,163,17,0.2)] rounded-md m-0.5 relative";
            numClass = "text-primary font-bold z-10";
            if (extraContent) {
               extraContent = <div className="z-10">{extraContent}</div>;
            }
          }

          return (
            <div key={dateStr} className={cellClass}>
              <span className={numClass}>{format(day, "d")}</span>
              {extraContent}
              {isToday && <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-md"></div>}
            </div>
          );
        })}
        
        {/* Fill remaining cells to complete the grid */}
        {Array.from({ length: (42 - (startDay + daysInMonth.length)) % 7 }).map((_, i) => (
          <div key={`empty-end-${i}`} className="bg-surface-dim/80 p-1 min-h-[45px]" />
        ))}
      </div>

      {/* Monthly Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-sm mt-3">
        {/* Net PnL */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-center hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity ${monthlyStats.totalPnL >= 0 ? "from-success-emerald/10" : "from-danger-rose/10"} to-transparent`}></div>
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest mb-1 relative z-10">NET PNL</span>
          <span className={`font-data-mono text-lg font-bold relative z-10 ${monthlyStats.totalPnL >= 0 ? "text-success-emerald" : "text-danger-rose"}`}>
            {monthlyStats.totalPnL >= 0 ? "+" : "-"}${Math.abs(monthlyStats.totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        {/* Total */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-center hover:-translate-y-1 transition-all duration-300">
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest mb-1">TOTAL</span>
          <span className="font-data-mono text-lg font-bold text-white">{monthlyStats.totalTrades}</span>
        </div>
        {/* Win */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-center hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-success-emerald/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest mb-1 relative z-10">WIN</span>
          <span className="font-data-mono text-lg font-bold text-success-emerald relative z-10">{monthlyStats.winTrades}</span>
        </div>
        {/* Loss */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-center hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-danger-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest mb-1 relative z-10">LOSS</span>
          <span className="font-data-mono text-lg font-bold text-danger-rose relative z-10">{monthlyStats.lossTrades}</span>
        </div>
        {/* Win Rate */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-center hover:-translate-y-1 transition-all duration-300 md:col-span-1 col-span-2">
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest mb-1">WIN RATE</span>
          <span className="font-data-mono text-lg font-bold text-white">{winRate}%</span>
        </div>
      </div>

    </div>
  );
}
