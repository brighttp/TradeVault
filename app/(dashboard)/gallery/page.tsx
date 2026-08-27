import { createClient } from "@/lib/supabase/server";
import { GalleryGrid } from "@/components/dashboard/gallery-grid";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch trades that have either a before or after image, joining with journal_entries
  const { data: plays, error } = await supabase
    .from("trades")
    .select(`
      id,
      symbol,
      direction,
      pnl,
      image_before_url,
      image_after_url,
      created_at,
      journal_entries (
        method,
        reason
      )
    `)
    .eq("user_id", user.id)
    .or("image_before_url.not.is.null,image_after_url.not.is.null")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching playbook gallery:", error);
  }

  // Flatten the relation since Supabase returns a 1:1 join as an array if not defined strictly, or an object. 
  // Let's map it safely.
  const formattedPlays = (plays || []).map((play: any) => {
    // If journal_entries is an array, take the first item
    const journal = Array.isArray(play.journal_entries) 
      ? play.journal_entries[0] 
      : play.journal_entries;

    return {
      id: play.id,
      symbol: play.symbol,
      direction: play.direction,
      pnl: play.pnl,
      imageBeforeUrl: play.image_before_url,
      imageAfterUrl: play.image_after_url,
      createdAt: play.created_at,
      method: journal?.method || "Uncategorized",
      reason: journal?.reason || "No context provided."
    };
  });

  return (
    <div className="p-margin w-full max-w-container-max mx-auto flex-1 h-full pb-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-headline-lg text-headline-lg font-bold text-brand-white">Playbook Gallery</h1>
        <p className="font-body-md text-brand-silver">Review your documented setups and results.</p>
      </div>

      {formattedPlays.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-4">photo_library</span>
          <h3 className="text-white font-bold mb-2">No Plays Documented Yet</h3>
          <p className="text-gray-500 text-sm">Upload screenshots to your trades to build your playbook.</p>
        </div>
      ) : (
        <GalleryGrid plays={formattedPlays} />
      )}
    </div>
  );
}
