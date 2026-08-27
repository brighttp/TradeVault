"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function DashboardTimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentFilter = searchParams.get("time") || "ALL";

  const setFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("time");
    } else {
      params.set("time", value);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 bg-brand-navy rounded-lg p-1 border border-brand-silver/10">
      <button 
        onClick={() => setFilter("ALL")}
        className={`px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest rounded-md transition-colors ${currentFilter === "ALL" ? "bg-brand-gold text-brand-black" : "text-brand-silver hover:text-brand-white"}`}
      >
        All Time
      </button>
      <button 
        onClick={() => setFilter("MONTH")}
        className={`px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest rounded-md transition-colors ${currentFilter === "MONTH" ? "bg-brand-gold text-brand-black" : "text-brand-silver hover:text-brand-white"}`}
      >
        30D
      </button>
      <button 
        onClick={() => setFilter("WEEK")}
        className={`px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest rounded-md transition-colors ${currentFilter === "WEEK" ? "bg-brand-gold text-brand-black" : "text-brand-silver hover:text-brand-white"}`}
      >
        7D
      </button>
      <button 
        onClick={() => setFilter("TODAY")}
        className={`px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest rounded-md transition-colors ${currentFilter === "TODAY" ? "bg-brand-gold text-brand-black" : "text-brand-silver hover:text-brand-white"}`}
      >
        1D
      </button>
    </div>
  );
}
