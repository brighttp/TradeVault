"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveJournalEntry(tradeId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const method = formData.get("method") as string;
  const reason = formData.get("reason") as string;
  const emotion = formData.get("emotion") as string;
  const confidence = parseInt(formData.get("confidence") as string, 10);
  const conclusion = formData.get("conclusion") as string;

  if (!method || !reason || !emotion || !confidence) {
    return { error: "Method, reason, emotion, and confidence are required" };
  }

  // 1. Upsert into journal_entries
  const { error: journalError } = await supabase
    .from("journal_entries")
    .upsert({
      trade_id: tradeId,
      method,
      reason,
      emotion,
      confidence,
      conclusion,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'trade_id'
    });

  if (journalError) {
    console.error("Journal Upsert Error:", journalError);
    return { error: "Failed to save journal entry: " + journalError.message };
  }

  // 2. Update trades table journal_status
  const { error: tradeError } = await supabase
    .from("trades")
    .update({ 
      journal_status: "COMPLETE",
      updated_at: new Date().toISOString()
    })
    .eq("id", tradeId);

  if (tradeError) {
    console.error("Trade Update Error:", tradeError);
    return { error: "Journal saved, but failed to update trade status." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  revalidatePath(`/trades/${tradeId}`);

  return { success: true };
}
