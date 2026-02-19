import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getFriendsFeed(supabase: Client, userId: string, limit = 20, offset = 0) {
  // Get friend IDs
  const { data: friendships } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === userId ? f.addressee_id : f.requester_id
  );

  if (friendIds.length === 0) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("ratings")
    .select("*, profiles(*), movies(*)")
    .in("user_id", friendIds)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
}

export async function upsertRating(
  supabase: Client,
  userId: string,
  movieId: string,
  score: number,
  comment: string | null
) {
  const { data, error } = await supabase
    .from("ratings")
    .upsert(
      {
        user_id: userId,
        movie_id: movieId,
        score,
        comment,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,movie_id" }
    )
    .select()
    .single();
  return { data, error };
}

export async function getUserRating(supabase: Client, userId: string, movieId: string) {
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .single();
  return { data, error };
}

export async function deleteRating(supabase: Client, userId: string, movieId: string) {
  const { error } = await supabase
    .from("ratings")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", movieId);
  return { error };
}

export async function getUserRatings(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("ratings")
    .select("*, movies(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
}
