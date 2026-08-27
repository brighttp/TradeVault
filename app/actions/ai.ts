"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateTradeConclusion(tradeData: {
  pair: string;
  pnl: number;
  method: string;
  emotion: string;
  entryReason: string;
  weakness?: string;
  chartImageBase64?: string;
}) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { error: "Gemini API key is not configured in .env.local" };
    }

    let prompt = `Anda adalah seorang pelatih performa trading kripto elite yang tegas, jeli, dan tanpa basa-basi. Gunakan Bahasa Indonesia yang natural dan tegas dengan istilah trading umum (cuan, loss, FOMO, overtrading, disiplin).

Detail Trading:
- Pair: ${tradeData.pair}
- Net PnL: $${tradeData.pnl}
- Trading Method: ${tradeData.method || "Tidak spesifik"}
- Emosi Utama: ${tradeData.emotion || "Tidak spesifik"}
- Alasan Entry: ${tradeData.entryReason || "Tidak spesifik"}
- Kelemahan Setup (Setup Weakness): ${tradeData.weakness || "Tidak spesifik"}

Aturan Evaluasi:
1. Jika Profit (PnL Positif): Berikan ucapan selamat atas cuan dan eksekusi yang baik. NAMUN, segera peringatkan trader untuk tidak arogan, suruh mereka mengamankan modal, dan ingatkan dengan amat ketat untuk menghindari overtrading hari ini.
2. Jika Loss (PnL Negatif) DAN emosi utamanya mengandung FOMO, Greed, Panic, atau Revenge Trade: Jadilah pelatih yang SANGAT SARKASTIS, KERAS, dan GALAK. Kritik tajam kedisiplinan mereka. Katakan bahwa mereka sedang berjudi dan murni menyumbangkan uang ke market karena tidak bisa mengontrol psikologi sendiri.
3. Jika Loss Normal (PnL Negatif dengan emosi lain): Berikan evaluasi dan kritik yang tegas namun konstruktif terkait manajemen risiko berdasarkan metode, alasan entry, dan kelemahan setup mereka.
4. Perhatikan Kelemahan Setup (Setup Weakness): Jika trader sudah mengakui kelemahan (misalnya telat masuk, volume rendah, melawan tren), gunakan ini untuk memberikan teguran yang tepat sasaran. Jika profit tapi kelemahan fatal, ingatkan bahwa mereka hanya beruntung.

Format Output: HANYA tulis 3 hingga 4 kalimat evaluasi akhir secara langsung. JANGAN gunakan pemformatan markdown sama sekali (tanpa bintang, tanpa bold, tanpa bullet points). Hasilkan plain text murni tanpa basa-basi intro.`;

    if (tradeData.chartImageBase64) {
      prompt += `\n\nAnalisis juga gambar chart yang dilampirkan. Validasi apakah 'Alasan Entry' dari trader sesuai dengan realita teknikal di chart, dan kritik dengan brutal jika ada kesalahan teknikal yang jelas.`;
    }

    const contentParts: any[] = [prompt];
    
    if (tradeData.chartImageBase64) {
      contentParts.push({
        inlineData: {
          data: tradeData.chartImageBase64,
          mimeType: "image/jpeg"
        }
      });
    }

    const modelsToTry = ["gemini-3.7-flash", "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(contentParts);
        const text = result.response.text();
        return { success: true, text: text.trim() };
      } catch (err: any) {
        console.warn(`[AI Fallback] Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    throw lastError;
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    if (error.message?.includes("503") || error.message?.includes("high demand")) {
      return { error: "API Google (Gemini) sedang mengalami beban tinggi (High Demand) di semua server. Mohon tunggu beberapa menit." };
    }
    return { error: error.message || "Failed to generate conclusion." };
  }
}
