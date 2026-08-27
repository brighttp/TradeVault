"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-obsidian/90 backdrop-blur-2xl text-primary border-r border-outline-variant/20 shadow-[20px_0_50px_rgba(0,0,0,0.5)] py-panel-padding z-50">
      <div className="px-md mb-xl">
        <h1 className="font-headline-md text-headline-md text-primary uppercase tracking-widest">TRADEVAULT</h1>
      </div>
      <ul className="flex-1 space-y-2 px-sm flex flex-col">
        <li>
          <Link 
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group ${
              pathname === "/dashboard" 
                ? "bg-glow-gold text-primary border-r-2 border-primary shadow-[inset_0_0_20px_rgba(252,163,17,0.1)]" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`} 
            href="/dashboard"
          >
            <span className={`material-symbols-outlined text-xl transition-colors ${pathname === "/dashboard" ? "" : "group-hover:text-primary"}`}>dashboard</span>
            <span className={`font-label-caps text-label-caps tracking-widest mt-0.5 transition-transform ${pathname === "/dashboard" ? "" : "group-hover:translate-x-1"}`}>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link 
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group ${
              pathname === "/trades" || pathname?.startsWith("/trades/")
                ? "bg-glow-gold text-primary border-r-2 border-primary shadow-[inset_0_0_20px_rgba(252,163,17,0.1)]" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`} 
            href="/trades"
          >
            <span className={`material-symbols-outlined text-xl transition-colors ${pathname === "/trades" || pathname?.startsWith("/trades/") ? "" : "group-hover:text-primary"}`}>swap_horiz</span>
            <span className={`font-label-caps text-label-caps tracking-widest mt-0.5 transition-transform ${pathname === "/trades" || pathname?.startsWith("/trades/") ? "" : "group-hover:translate-x-1"}`}>Trades</span>
          </Link>
        </li>
        <li>
          <Link 
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group ${
              pathname === "/analytics" || pathname?.startsWith("/analytics/")
                ? "bg-glow-gold text-primary border-r-2 border-primary shadow-[inset_0_0_20px_rgba(252,163,17,0.1)]" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`} 
            href="/analytics"
          >
            <span className={`material-symbols-outlined text-xl transition-colors ${pathname === "/analytics" || pathname?.startsWith("/analytics/") ? "" : "group-hover:text-primary"}`}>analytics</span>
            <span className={`font-label-caps text-label-caps tracking-widest mt-0.5 transition-transform ${pathname === "/analytics" || pathname?.startsWith("/analytics/") ? "" : "group-hover:translate-x-1"}`}>Analytics</span>
          </Link>
        </li>
        <li>
          <Link 
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group ${
              pathname === "/gallery" || pathname?.startsWith("/gallery/")
                ? "bg-glow-gold text-primary border-r-2 border-primary shadow-[inset_0_0_20px_rgba(252,163,17,0.1)]" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`} 
            href="/gallery"
          >
            <span className={`material-symbols-outlined text-xl transition-colors ${pathname === "/gallery" || pathname?.startsWith("/gallery/") ? "" : "group-hover:text-primary"}`}>grid_view</span>
            <span className={`font-label-caps text-label-caps tracking-widest mt-0.5 transition-transform ${pathname === "/gallery" || pathname?.startsWith("/gallery/") ? "" : "group-hover:translate-x-1"}`}>Gallery</span>
          </Link>
        </li>
        <li className="mt-auto">
          <Link 
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group ${
              pathname === "/settings" || pathname?.startsWith("/settings/")
                ? "bg-glow-gold text-primary border-r-2 border-primary shadow-[inset_0_0_20px_rgba(252,163,17,0.1)]" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`} 
            href="/settings"
          >
            <span className={`material-symbols-outlined text-xl transition-colors ${pathname === "/settings" || pathname?.startsWith("/settings/") ? "" : "group-hover:text-primary"}`}>settings</span>
            <span className={`font-label-caps text-label-caps tracking-widest mt-0.5 transition-transform ${pathname === "/settings" || pathname?.startsWith("/settings/") ? "" : "group-hover:translate-x-1"}`}>Settings</span>
          </Link>
        </li>
      </ul>

    </nav>
  );
}
