"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadTradeImage(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("image") as File;
  const tradeId = formData.get("tradeId") as string;
  const imageType = formData.get("imageType") as "before" | "after"; // Must be 'before' or 'after'

  if (!file || !tradeId || !imageType) {
    return { success: false, error: "Missing required fields" };
  }

  // Ensure the user is authenticated
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = authData.user.id;
  const fileExtension = file.name.split(".").pop();
  
  // Construct a unique filename: user_id/trade_id_before_timestamp.ext
  const fileName = `${userId}/${tradeId}_${imageType}_${Date.now()}.${fileExtension}`;

  try {
    // 1. Upload to Supabase Storage Bucket ('trade_images')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("trade_images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    // 2. Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("trade_images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 3. Update the `trades` table with the new image URL
    const updateColumn = imageType === "before" ? "image_before_url" : "image_after_url";
    
    const { error: dbError } = await supabase
      .from("trades")
      .update({ [updateColumn]: imageUrl })
      .eq("id", tradeId)
      .eq("user_id", userId);

    if (dbError) {
      console.error("DB update error:", dbError);
      return { success: false, error: dbError.message };
    }

    // 4. Revalidate the trade details page to reflect changes instantly
    revalidatePath(`/trades/${tradeId}`);

    return { success: true, imageUrl };
  } catch (err: any) {
    console.error("Unexpected upload error:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
