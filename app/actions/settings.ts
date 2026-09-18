"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveOkxCredentials(formData: FormData) {
  const apiKey = formData.get("apiKey") as string;
  const secretKey = formData.get("secretKey") as string;
  const passphrase = formData.get("passphrase") as string;

  if (!apiKey || !secretKey || !passphrase) {
    return { error: "All fields are required" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated. Please log in first." };
  }

  // Call the Supabase RPC function to securely store the OKX credentials
  // The RPC handles storing into vault.secrets and updating user_settings
  const { error } = await supabase.rpc('store_okx_credentials', { 
    p_user_id: user.id,
    p_api_key: apiKey, 
    p_secret_key: secretKey, 
    p_passphrase: passphrase 
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function resetTradingData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated. Please log in first." };
  }

  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  // Update last_reset_at timestamp in user_settings
  const now = new Date().toISOString();
  await supabase
    .from('user_settings')
    .update({ last_reset_at: now })
    .eq('user_id', user.id);

  // Revalidate relevant paths
  revalidatePath("/dashboard");
  revalidatePath("/trades");
  revalidatePath("/analytics");
  revalidatePath("/settings");
  
  return { success: true };
}
