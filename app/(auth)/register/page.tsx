"use client";

import { useState } from "react";
import { signUp } from "@/app/actions/auth";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      // Catch blocks catch redirects in Next.js
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-4 w-full">
      <div className="w-full max-w-md bg-bento-card border border-brand-silver/10 rounded-2xl p-8 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-headline-lg text-3xl font-black text-brand-gold mb-2 tracking-tight">TRADEVAULT</h1>
          <p className="font-body-md text-brand-silver">Create an account to gain your edge.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 rounded-lg bg-brand-red/10 border border-brand-red/30 text-brand-red font-body-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-brand-silver flex items-center gap-2 uppercase tracking-widest">
              <Mail className="w-3 h-3" />
              Email Address
            </label>
            <input 
              name="email"
              type="email" 
              placeholder="trader@firm.com" 
              required 
              className="w-full bg-brand-black border border-brand-silver/20 text-brand-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-lg h-11 px-3 font-body-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-[11px] text-brand-silver flex items-center gap-2 uppercase tracking-widest">
              <Lock className="w-3 h-3" />
              Password
            </label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              required 
              className="w-full bg-brand-black border border-brand-silver/20 text-brand-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-lg h-11 px-3 font-body-sm" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full h-12 bg-brand-gold text-brand-black font-label-caps text-[14px] uppercase tracking-widest font-bold rounded-lg hover:bg-brand-gold/90 transition-colors disabled:opacity-50 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="font-body-sm text-brand-silver">
            Already have an account? <Link href="/login" className="text-brand-gold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
