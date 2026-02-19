import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function syncEpisodesFromTMDB(
  movieId: string,
  tmdbId: number,
  numberOfSeasons: number
) {
  // Call our API endpoint to sync episodes
  const res = await fetch(`/api/tmdb/tv/${tmdbId}/episodes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movieId, numberOfSeasons }),
  });
  return res.ok;
}

export async function getUpcomingEpisodes(
  supabase: Client,
  userId: string,
  startDate: string,
  endDate: string
) {
  // Get movies the user follows
  const { data: follows } = await supabase
    .from("follows")
    .select("movie_id")
    .eq("user_id", userId);

  if (!follows || follows.length === 0) {
    return { data: [], error: null };
  }

  const movieIds = follows.map((f) => f.movie_id);

  const { data, error } = await supabase
    .from("episodes")
    .select("*, movies(*)")
    .in("movie_id", movieIds)
    .gte("air_date", startDate)
    .lte("air_date", endDate)
    .order("air_date", { ascending: true });

  return { data, error };
}

export async function getEpisodesForShow(supabase: Client, movieId: string) {
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("movie_id", movieId)
    .order("season_number", { ascending: true })
    .order("episode_number", { ascending: true });
  return { data, error };
}
