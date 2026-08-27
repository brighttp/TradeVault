"use client";

import { useState } from "react";
import { Lock, Key, Shield, ShieldCheck } from "lucide-react";
import { saveOkxCredentials } from "@/app/actions/settings";

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await saveOkxCredentials(formData);
      if (result.error) {
        setStatus({ error: result.error });
      } else {
        setStatus({ success: true });
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setStatus({ error: "An unexpected error occurred while saving." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 max-w-[1600px] mx-auto space-y-4 w-full">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-white mb-1">Settings</h2>
          <p className="font-label-caps text-label-caps text-on-surface-variant">MANAGE YOUR CONNECTIONS</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* API Credentials Card */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6 relative">
              <div>
                <h3 className="font-headline-md text-xl text-white flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  OKX API Integration
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Connect your exchange securely. Keys are encrypted via Supabase Vault.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 relative">
              
              {status?.error && (
                <div className="p-4 rounded-xl bg-danger-rose/10 border border-danger-rose/20 text-danger-rose font-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {status.error}
                </div>
              )}

              {status?.success && (
                <div className="p-4 rounded-xl bg-success-emerald/10 border border-success-emerald/20 text-success-emerald font-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Credentials saved securely!
                </div>
              )}

              <div className="space-y-2">
                <label className="font-label-caps text-[11px] text-on-surface-variant flex items-center gap-2 tracking-widest">
                  <Key className="w-3 h-3" />
                  API KEY
                </label>
                <input 
                  name="apiKey"
                  type="text" 
                  placeholder="Enter your OKX API Key" 
                  required 
                  className="w-full bg-surface-container-low/50 border border-white/5 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-low rounded-xl h-12 px-4 font-body-sm transition-all outline-none placeholder:text-white/20" 
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-[11px] text-on-surface-variant flex items-center gap-2 tracking-widest">
                  <Lock className="w-3 h-3" />
                  SECRET KEY
                </label>
                <input 
                  name="secretKey"
                  type="password" 
                  placeholder="Enter your OKX Secret Key" 
                  required 
                  className="w-full bg-surface-container-low/50 border border-white/5 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-low rounded-xl h-12 px-4 font-body-sm transition-all outline-none placeholder:text-white/20" 
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-[11px] text-on-surface-variant flex items-center gap-2 tracking-widest">
                  <Shield className="w-3 h-3" />
                  PASSPHRASE
                </label>
                <input 
                  name="passphrase"
                  type="password" 
                  placeholder="Enter your API Passphrase" 
                  required 
                  className="w-full bg-surface-container-low/50 border border-white/5 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-low rounded-xl h-12 px-4 font-body-sm transition-all outline-none placeholder:text-white/20" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full btn-primary text-background font-headline-md text-sm py-3.5 rounded-xl hover:scale-[0.99] active:scale-[0.97] transition-all flex items-center justify-center gap-2 shadow-lg mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Lock className="w-4 h-4 animate-pulse" />
                    ENCRYPTING & SAVING...
                  </>
                ) : (
                  <>
                    SAVE CREDENTIALS
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
