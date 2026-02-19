import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function followShow(supabase: Client, userId: string, movieId: string) {
  const { data, error } = await supabase
    .from("follows")
    .insert({ user_id: userId, movie_id: movieId })
    .select()
    .single();
  return { data, error };
}

export async function unfollowShow(supabase: Client, userId: string, movieId: string) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", movieId);
  return { error };
}

export async function getFollowedShows(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("follows")
    .select("*, movies(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function isFollowing(supabase: Client, userId: string, movieId: string) {
  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .single();
  return !!data;
}
