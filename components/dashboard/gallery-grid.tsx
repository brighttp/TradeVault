"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PlaybookCard {
  id: string;
  symbol: string;
  direction: string;
  pnl: number;
  imageBeforeUrl: string | null;
  imageAfterUrl: string | null;
  createdAt: string;
  method: string;
  reason: string;
}

export function GalleryGrid({ plays }: { plays: PlaybookCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plays.map((play) => {
        const hasBoth = play.imageBeforeUrl && play.imageAfterUrl;
        
        return (
          <Link href={`/trades/${play.id}`} key={play.id} className="group flex flex-col bg-white/[0.02] border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
            
            {/* Image Container */}
            <div className="relative aspect-video w-full bg-black/20 flex">
              {hasBoth ? (
                // Side by Side
                <div className="flex w-full h-full">
                  <div className="w-1/2 h-full relative border-r border-brand-black">
                    <img src={play.imageBeforeUrl!} alt="Setup" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 text-[9px] font-label-caps uppercase bg-brand-black/80 text-brand-silver px-2 py-0.5 rounded">Setup</span>
                  </div>
                  <div className="w-1/2 h-full relative">
                    <img src={play.imageAfterUrl!} alt="Result" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 text-[9px] font-label-caps uppercase bg-brand-black/80 text-brand-silver px-2 py-0.5 rounded">Result</span>
                  </div>
                </div>
              ) : (
                // Single Image
                <div className="w-full h-full relative">
                  <img src={play.imageBeforeUrl || play.imageAfterUrl!} alt="Trade" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[9px] font-label-caps uppercase bg-brand-black/80 text-brand-silver px-2 py-0.5 rounded">
                    {play.imageBeforeUrl ? "Setup" : "Result"}
                  </span>
                </div>
              )}
              
              {/* Overlay Hover Effect */}
              <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Context Container */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-white flex items-center gap-2">
                    {play.symbol}
                    <span className={`px-2 py-0.5 rounded-md border text-xs ${play.direction === "LONG" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-rose-500/15 text-rose-400 border-rose-500/30"}`}>
                      {play.direction}
                    </span>
                  </h3>
                  <span className="text-sm text-gray-500 font-data-mono">
                    {new Date(play.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
                <span className="inline-block self-start font-label-caps text-xs uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-md px-2 py-0.5">
                  {play.method}
                </span>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {play.reason}
                </p>
              </div>

              <div className="absolute top-4 right-4 bg-brand-black/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 text-brand-gold">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

          </Link>
        )
      })}
    </div>
  );
}
