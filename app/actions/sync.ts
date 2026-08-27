"use server"

import { createClient } from "@/lib/supabase/server";
import { OkxClient } from "@/lib/okx/client";
import { revalidatePath } from "next/cache";

export async function syncOkxTrades() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    // 1. Retrieve decrypted OKX credentials using the RPC
    const { data: creds, error: credsError } = await supabase.rpc("get_okx_credentials", { 
      p_user_id: user.id 
    });

    // The RPC might return an array if it's defined as returning a TABLE, or an object if it returns a single RECORD.
    const credsObj = Array.isArray(creds) ? creds[0] : creds;
    console.log("RPC result:", creds);

    // For this implementation, if the RPC fails or returns empty, we throw a descriptive error.
    if (credsError || !credsObj || !credsObj.api_key) {
      console.error("Credentials fetch error:", credsError, "credsObj:", credsObj);
      return { error: "Failed to retrieve OKX credentials. Ensure they are saved in Settings." };
    }

    // 2. Instantiate OKX Client
    const okx = new OkxClient({
      apiKey: credsObj.api_key,
      secretKey: credsObj.secret_key,
      passphrase: credsObj.passphrase
    });

    // 3. Fetch Open and Closed positions concurrently
    const [openRes, closedRes] = await Promise.all([
      okx.getOpenPositions(),
      okx.getPositionsHistory()
    ]);

    // Handle potential array wrapping based on V5 API standard
    let openPositions: any[] = Array.isArray(openRes) ? openRes : [];
    let closedPositions: any[] = Array.isArray(closedRes) ? closedRes : [];

    // Filter out all CLOSED trades created before today (Aug 27, 2026) to start fresh.
    // We intentionally do NOT filter openPositions, because an open trade is still active 
    // even if it was opened before the cutoff date.
    const CUTOFF_TIMESTAMP = new Date("2026-08-27T00:00:00Z").getTime();
    closedPositions = closedPositions.filter(pos => parseInt(pos.uTime || pos.cTime) >= CUTOFF_TIMESTAMP);

    // DEBUG: Write raw response to file for inspection
    try {
      const fs = require('fs');
      fs.writeFileSync('okx_debug.json', JSON.stringify({ openRes, closedRes }, null, 2));
    } catch(e) {
      console.error("Failed to write debug file", e);
    }

    const tradesMap = new Map();

    // Aggregate Closed Positions to correctly handle partial closes (same cTime) 
    // while keeping sequential trades (different cTime) separate.
    const closedAggregated = new Map();
    for (const pos of closedPositions) {
      const tradeId = `${pos.posId}_${pos.cTime}`;
      if (!closedAggregated.has(tradeId)) {
        closedAggregated.set(tradeId, { ...pos });
      } else {
        const existing = closedAggregated.get(tradeId);
        existing.realizedPnl = (parseFloat(existing.realizedPnl || "0") + parseFloat(pos.realizedPnl || "0")).toString();
        if (parseInt(pos.uTime) > parseInt(existing.uTime)) {
          existing.uTime = pos.uTime;
          existing.closeAvgPx = pos.closeAvgPx || existing.closeAvgPx;
        }
        closedAggregated.set(tradeId, existing);
      }
    }

    // 1. Map Closed Positions First
    for (const pos of Array.from(closedAggregated.values()) as any[]) {
      const tradeId = `${pos.posId}_${pos.cTime}`;
      tradesMap.set(tradeId, {
        user_id: user.id,
        okx_trade_id: tradeId,
        symbol: pos.instId,
        direction: (pos.direction || pos.posSide || "long").toLowerCase() === "short" ? "SHORT" : "LONG",
        entry_price: parseFloat(pos.openAvgPx || pos.avgPx || "0"),
        exit_price: parseFloat(pos.closeAvgPx || pos.avgPx || "0"), 
        pnl: parseFloat(pos.realizedPnl || "0"),
        status: "CLOSED",
        created_at: pos.cTime ? new Date(parseInt(pos.cTime)).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        closed_at: pos.uTime ? new Date(parseInt(pos.uTime)).toISOString() : new Date().toISOString()
      });
    }

    // 2. Map Open Positions Second
    for (const pos of openPositions) {
      const tradeId = `${pos.posId}_${pos.cTime}`;
      
      let direction = "LONG";
      if (pos.posSide === "net") {
        direction = parseFloat(pos.pos || "0") < 0 ? "SHORT" : "LONG";
      } else if ((pos.posSide || "long").toLowerCase() === "short") {
        direction = "SHORT";
      }

      tradesMap.set(tradeId, {
        user_id: user.id,
        okx_trade_id: tradeId, 
        symbol: pos.instId, 
        direction: direction, 
        entry_price: parseFloat(pos.avgPx || "0"),
        pnl: parseFloat(pos.upl || "0"),
        status: "OPEN",
        created_at: pos.cTime ? new Date(parseInt(pos.cTime)).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    const tradesToUpsert = Array.from(tradesMap.values());

    // 3. MIGRATION & CLEANUP: Remove duplicated legacy trades and migrate their journals
    const { data: allDbTrades } = await supabase
      .from('trades')
      .select('*');

    if (allDbTrades && allDbTrades.length > 0) {
      // Legacy trades are those without an underscore in their okx_trade_id
      const legacyTrades = allDbTrades.filter(t => t.okx_trade_id && !t.okx_trade_id.includes('_'));

      for (const legacy of legacyTrades) {
        // Find the new trade that matches (posId_cTime format)
        const newTrades = allDbTrades.filter(t => t.okx_trade_id && t.okx_trade_id.startsWith(`${legacy.okx_trade_id}_`));

        if (newTrades.length > 0) {
          // Pick best match by closed_at time
          let closest = newTrades[0];
          if (newTrades.length > 1 && legacy.closed_at) {
            let minDiff = Infinity;
            for (const nt of newTrades) {
               if (!nt.closed_at) continue;
               const diff = Math.abs(new Date(nt.closed_at).getTime() - new Date(legacy.closed_at).getTime());
               if (diff < minDiff) { minDiff = diff; closest = nt; }
            }
          }
          
          // Transfer journal data if legacy has it and closest DOES NOT
          if (legacy.journal_status === 'COMPLETED' && closest.journal_status === 'INCOMPLETE') {
            await supabase.from('trades').update({
              journal_status: legacy.journal_status,
              conclusion: legacy.conclusion,
              confidence: legacy.confidence,
              reason: legacy.reason,
              emotion: legacy.emotion,
              method: legacy.method
            }).eq('id', closest.id);
          }

          // Delete legacy row
          await supabase.from('trades').delete().eq('id', legacy.id);
        } else {
          // If no new trade exists and it's incomplete, delete it
          if (legacy.journal_status === 'INCOMPLETE') {
            await supabase.from('trades').delete().eq('id', legacy.id);
          }
        }
      }
    }

    // 4. Upsert into Supabase
    if (tradesToUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from("trades")
        .upsert(tradesToUpsert, { 
          onConflict: 'okx_trade_id',
          ignoreDuplicates: false // We want to update PnL for open positions
        });

      if (upsertError) {
        throw new Error(upsertError.message);
      }
    }

    // We must NOT store executions in supabase.auth.updateUser (user_metadata) 
    // because it bloats the JWT session cookie and causes a 431 HTTP error.
    
    // Instead, we will fallback to the unified trades table for now until a DB-safe caching method is available.

    revalidatePath("/dashboard");
    revalidatePath("/trades");
    revalidatePath("/analytics");
    
    return { success: true, count: tradesToUpsert.length };
  } catch (error: any) {
    console.error("Sync Error:", error);
    // Extract a cleaner message if it's an OKX API error
    return { error: error.message || "An unexpected error occurred during sync." };
  }
}
