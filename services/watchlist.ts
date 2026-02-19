import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function addToWatchlist(supabase: Client, userId: string, movieId: string) {
  const { data, error } = await supabase
    .from("watchlist")
    .insert({ user_id: userId, movie_id: movieId })
    .select()
    .single();
  return { data, error };
}

export async function removeFromWatchlist(supabase: Client, userId: string, movieId: string) {
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", movieId);
  return { error };
}

export async function getWatchlist(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*, movies(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function isInWatchlist(supabase: Client, userId: string, movieId: string) {
  const { data } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .single();
  return !!data;
}
