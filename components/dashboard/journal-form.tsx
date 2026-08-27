"use client";

import { useState } from "react";
import { saveJournalEntry } from "@/app/actions/journal";
import { generateTradeConclusion } from "@/app/actions/ai";
import { useRouter } from "next/navigation";
import { Brain, CheckCircle2, Sparkles, Loader2 } from "lucide-react";

export function JournalForm({ tradeId, initialData, tradeSymbol, tradePnl }: { tradeId: string, initialData?: any, tradeSymbol: string, tradePnl: number }) {
  let initialUser = initialData?.conclusion || "";
  let initialAi = "";
  try {
    if (initialData?.conclusion?.startsWith("{")) {
      const parsed = JSON.parse(initialData.conclusion);
      initialUser = parsed.user || "";
      initialAi = parsed.ai || "";
    }
  } catch(e) {}

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [confidence, setConfidence] = useState<number>(initialData?.confidence || 3);
  const [conclusion, setConclusion] = useState(initialUser);
  const [aiConclusion, setAiConclusion] = useState(initialAi);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    // Combine both conclusions into a JSON string to avoid DB migrations
    const combinedConclusion = JSON.stringify({
      user: conclusion,
      ai: aiConclusion
    });
    formData.append("conclusion", combinedConclusion);
    
    const result = await saveJournalEntry(tradeId, formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/trades");
      }, 1500);
    }
    
    setIsSubmitting(false);
  };

  const handleGenerateConclusion = async () => {
    const method = (document.querySelector('select[name="method"]') as HTMLSelectElement)?.value || "";
    const emotion = (document.querySelector('select[name="emotion"]') as HTMLSelectElement)?.value || "";
    const entryReason = (document.querySelector('input[name="reason"]') as HTMLInputElement)?.value || "";

    if (!method || !emotion || !entryReason) {
      setError("Please fill in Trading Method, Primary Emotion, and Entry Reason first.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    let chartImageBase64: string | undefined = undefined;
    try {
      const beforeImageElement = document.querySelector('img[alt="Setup (Before)"]') as HTMLImageElement;
      if (beforeImageElement && beforeImageElement.src) {
        const res = await fetch(beforeImageElement.src);
        const blob = await res.blob();
        chartImageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (err) {
      console.warn("Failed to extract chart image for AI analysis", err);
    }
    
    const result = await generateTradeConclusion({
      pair: tradeSymbol,
      pnl: tradePnl,
      method,
      emotion,
      entryReason,
      chartImageBase64
    });

    if (result.success && result.text) {
      setAiConclusion(result.text);
    } else {
      setError(result.error || "Failed to generate AI analysis.");
    }
    
    setIsGenerating(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 font-body-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-body-sm text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Journal saved! Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase tracking-widest">Trading Method</label>
          <select 
            name="method"
            required
            defaultValue={initialData?.method || ""}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all outline-none appearance-none cursor-pointer"
          >
            <option className="bg-[#050505]" value="" disabled>Select Method...</option>
            <option className="bg-[#050505]" value="Continuation">Continuation</option>
            <option className="bg-[#050505]" value="Reversal">Reversal</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase tracking-widest">Primary Emotion</label>
          <select 
            name="emotion"
            required
            defaultValue={initialData?.emotion || ""}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all outline-none appearance-none cursor-pointer"
          >
            <option className="bg-[#050505]" value="" disabled>Identify emotion...</option>
            <option className="bg-[#050505]" value="Confident">Confident</option>
            <option className="bg-[#050505]" value="FOMO">FOMO</option>
            <option className="bg-[#050505]" value="Anxious">Anxious</option>
            <option className="bg-[#050505]" value="Revenge Trade">Revenge Trade</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <div className="flex justify-between items-center">
          <label className="text-xs text-gray-500 uppercase tracking-widest">Confidence Level</label>
          <span className="text-xs text-amber-500 font-bold">{confidence} / 5</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => setConfidence(level)}
              className={`py-3 rounded-lg font-bold transition-colors ${
                confidence === level 
                  ? 'bg-amber-500/10 border-2 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <input type="hidden" name="confidence" value={confidence} />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <label className="text-xs text-gray-500 uppercase tracking-widest">Entry Reason</label>
        <input 
          name="reason"
          type="text" 
          placeholder="e.g. Broken 4H support block with high volume" 
          required 
          defaultValue={initialData?.reason || ""}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all outline-none" 
        />
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <label className="text-xs text-gray-500 uppercase tracking-widest">My Conclusion</label>
        <textarea 
          placeholder="Write your own analysis and thoughts..." 
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
          className="w-full min-h-[120px] resize-none bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all outline-none" 
        />
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <label className="text-xs text-[#FCA311] uppercase tracking-widest">AI Coach Analysis</label>
          <button
            type="button"
            onClick={handleGenerateConclusion}
            disabled={isGenerating}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#FCA311]/50 text-[#FCA311] bg-[#FCA311]/5 hover:bg-[#FCA311]/15 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                Generate AI Analysis
              </>
            )}
          </button>
        </div>
        <textarea 
          placeholder="AI Coach analysis will appear here..." 
          value={aiConclusion}
          onChange={(e) => setAiConclusion(e.target.value)}
          className="w-full min-h-[160px] resize-none bg-[#FCA311]/5 border border-[#FCA311]/20 rounded-lg p-3 text-sm text-[#FCA311] placeholder:text-[#FCA311]/30 focus:outline-none focus:ring-1 focus:ring-[#FCA311]/50" 
        />
      </div>

      <button 
        type="submit" 
        className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
        disabled={isSubmitting || success}
      >
        <Brain className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
        {isSubmitting ? "Processing..." : "Save Journal"}
      </button>

    </form>
  );
}
